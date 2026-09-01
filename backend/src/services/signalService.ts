import type { PoolClient, QueryResult, QueryResultRow } from "pg";
import { query, withTransaction } from "../config/db";
import { env } from "../config/env";
import type { CreateSignalInput, NearbySignalsQuery } from "../schemas/signal";
import type { IncidentCategory, PublicSignal } from "../types";
import { AppError } from "../utils/AppError";
import { calculateDistanceMeters, DEFAULT_HYPERLOCAL_RADIUS_METERS } from "../utils/geo";
import { triageIncident } from "./aiService";
import { ensureWallet } from "./creditService";

type SignalRow = {
  id: string;
  reporter_id: string;
  reporter_pseudonym: string;
  description: string;
  category: string;
  severity: string;
  urgency: string;
  confidence: string | number;
  latitude: number;
  longitude: number;
  status: string;
  upvotes: number;
  downvotes: number;
  created_at: Date | string;
  updated_at: Date | string;
};

type WalletRow = {
  available_credits: string | number;
  locked_credits: string | number;
};

const SIGNAL_SELECT = `
  SELECT
    s.id,
    s.reporter_id,
    p.pseudonym AS reporter_pseudonym,
    s.description,
    s.category::text AS category,
    s.severity::text AS severity,
    s.urgency::text AS urgency,
    s.confidence,
    s.latitude,
    s.longitude,
    s.status::text AS status,
    s.upvotes,
    s.downvotes,
    s.created_at,
    s.updated_at
  FROM signals s
  INNER JOIN profiles p ON p.id = s.reporter_id
`;

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

/**
 * Maps high-level application categories to database schema enum values.
 */
function mapCategoryToDbEnum(category: IncidentCategory): string {
  switch (category) {
    case "WOMEN_SAFETY":
    case "CHILD_SAFETY":
    case "ELDERLY_HELP":
    case "SUSPICIOUS_ACTIVITY":
      return "PERSONAL_SAFETY";
    case "DISASTER":
      return "NATURAL_DISASTER";
    case "COMMUNITY_SERVICE":
      return "OTHER";
    case "TRANSPORT":
      return "INFRASTRUCTURE";
    default:
      return category;
  }
}

function toPublicSignal(
  row: SignalRow,
  mediaUrls: string[] = [],
  distanceMeters?: number,
): PublicSignal {
  const triage = triageIncident(
    row.description,
    row.category as IncidentCategory,
    row.severity as any,
    row.urgency as any,
  );

  return {
    id: row.id,
    reporterId: row.reporter_id,
    reporterPseudonym: row.reporter_pseudonym,
    description: row.description,
    category: row.category,
    severity: row.severity,
    urgency: row.urgency,
    confidence: toNumber(row.confidence) || triage.confidence,
    summary: triage.summary,
    recommendedResponder: triage.recommendedResponder,
    latitude: toNumber(row.latitude),
    longitude: toNumber(row.longitude),
    status: row.status,
    upvotes: toNumber(row.upvotes),
    downvotes: toNumber(row.downvotes),
    mediaUrls,
    distanceMeters,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

async function runQuery<T extends QueryResultRow = QueryResultRow>(
  client: PoolClient | undefined,
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  if (client) {
    return client.query<T>(text, params);
  }
  return query<T>(text, params);
}

async function loadMediaUrls(signalId: string, client?: PoolClient): Promise<string[]> {
  const result = await runQuery<{ url: string }>(
    client,
    `SELECT url FROM signal_media WHERE signal_id = $1 ORDER BY created_at ASC`,
    [signalId],
  );
  return result.rows.map((row: { url: string }) => row.url);
}

export async function loadPublicSignal(
  signalId: string,
  client?: PoolClient,
  distanceMeters?: number,
): Promise<PublicSignal | null> {
  const result = await runQuery<SignalRow>(client, `${SIGNAL_SELECT} WHERE s.id = $1 LIMIT 1`, [signalId]);
  const row = result.rows[0];
  if (!row) {
    return null;
  }
  const mediaUrls = await loadMediaUrls(signalId, client);
  return toPublicSignal(row, mediaUrls, distanceMeters);
}

export async function listSignals(): Promise<PublicSignal[]> {
  const result = await query<SignalRow>(`${SIGNAL_SELECT} ORDER BY s.created_at DESC LIMIT 100`);
  const mediaBySignal = new Map<string, string[]>();

  if (result.rows.length > 0) {
    const ids = result.rows.map((row) => row.id);
    const media = await query<{ signal_id: string; url: string }>(
      `SELECT signal_id, url
       FROM signal_media
       WHERE signal_id = ANY($1::uuid[])
       ORDER BY created_at ASC`,
      [ids],
    );
    for (const item of media.rows) {
      const list = mediaBySignal.get(item.signal_id) ?? [];
      list.push(item.url);
      mediaBySignal.set(item.signal_id, list);
    }
  }

  return result.rows.map((row) => toPublicSignal(row, mediaBySignal.get(row.id) ?? []));
}

export async function listNearbySignals(queryCoords: NearbySignalsQuery): Promise<PublicSignal[]> {
  const radius = queryCoords.radius || DEFAULT_HYPERLOCAL_RADIUS_METERS;
  const allSignals = await listSignals();

  const nearby = allSignals
    .map((signal) => {
      const dist = calculateDistanceMeters(
        queryCoords.latitude,
        queryCoords.longitude,
        signal.latitude,
        signal.longitude,
      );
      return {
        ...signal,
        distanceMeters: dist,
      };
    })
    .filter((signal) => signal.distanceMeters <= radius && signal.status !== "CANCELLED")
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return nearby;
}

export async function getSignalById(id: string): Promise<PublicSignal> {
  const signal = await loadPublicSignal(id);
  if (!signal) {
    throw new AppError("Signal not found", 404);
  }
  return signal;
}

async function findDuplicate(client: PoolClient, input: CreateSignalInput): Promise<PublicSignal | null> {
  const dbCategory = mapCategoryToDbEnum(input.category);

  // Check recent signals with same category within duplicate time window
  const result = await client.query<SignalRow>(
    `${SIGNAL_SELECT}
     WHERE s.category::text = $1
       AND s.status::text NOT IN ('RESOLVED', 'CANCELLED')
       AND s.created_at >= now() - make_interval(mins => $2)
     ORDER BY s.created_at DESC
     LIMIT 10`,
    [dbCategory, env.DUPLICATE_WINDOW_MINUTES],
  );

  for (const row of result.rows) {
    const distance = calculateDistanceMeters(
      input.latitude,
      input.longitude,
      toNumber(row.latitude),
      toNumber(row.longitude),
    );

    if (distance <= env.DUPLICATE_RADIUS_METERS) {
      const mediaUrls = await loadMediaUrls(row.id, client);
      return toPublicSignal(row, mediaUrls, distance);
    }
  }

  return null;
}

export async function createSignal(
  reporterId: string,
  input: CreateSignalInput,
): Promise<PublicSignal> {
  const stakeAmount = input.stakeAmount ?? env.SIGNAL_STAKE_AMOUNT;

  // Run AI triage for automated classification and response routing
  const triage = triageIncident(
    input.description,
    input.category,
    input.severity,
    input.urgency,
  );

  const finalSeverity = input.severity ?? triage.severity;
  const finalUrgency = input.urgency ?? triage.urgency;
  const finalConfidence = input.confidence ?? triage.confidence;
  const dbCategory = mapCategoryToDbEnum(input.category);

  return withTransaction(async (client) => {
    // 1. Ensure profile exists
    const profile = await client.query<{ id: string }>(
      `SELECT id FROM profiles WHERE id = $1 LIMIT 1`,
      [reporterId],
    );
    if (!profile.rows[0]) {
      throw new AppError("Profile not found", 404);
    }

    // 2. Practical duplicate detection
    const duplicate = await findDuplicate(client, input);
    if (duplicate) {
      throw new AppError("A similar incident was already reported nearby", 409, true, {
        existingSignal: duplicate,
      });
    }

    // 3. Ensure wallet exists & check credits
    await ensureWallet(reporterId, client);

    const wallet = await client.query<WalletRow>(
      `SELECT available_credits, locked_credits
       FROM credit_wallets
       WHERE user_id = $1
       FOR UPDATE`,
      [reporterId],
    );

    const available = wallet.rows[0] ? toNumber(wallet.rows[0].available_credits) : 0;
    if (!wallet.rows[0] || available < stakeAmount) {
      throw new AppError(
        `Insufficient credits to report this incident. Required: ${stakeAmount}, Available: ${available}`,
        400,
      );
    }

    // 4. Create Signal
    const inserted = await client.query<{ id: string }>(
      `INSERT INTO signals (
         reporter_id,
         description,
         category,
         severity,
         urgency,
         confidence,
         latitude,
         longitude,
         status
       )
       VALUES (
         $1,
         $2,
         $3::incident_category,
         $4::incident_severity,
         $5::incident_urgency,
         $6,
         $7,
         $8,
         'OPEN'
       )
       RETURNING id`,
      [
        reporterId,
        input.description,
        dbCategory,
        finalSeverity,
        finalUrgency,
        finalConfidence,
        input.latitude,
        input.longitude,
      ],
    );

    const signalId = inserted.rows[0]?.id;
    if (!signalId) {
      throw new AppError("Failed to create signal", 500);
    }

    // 5. Store optional initial media
    if (input.mediaUrl) {
      await client.query(
        `INSERT INTO signal_media (signal_id, uploader_id, url)
         VALUES ($1, $2, $3)`,
        [signalId, reporterId, input.mediaUrl],
      );
    }

    // 6. Lock stake credits
    const updatedWallet = await client.query<WalletRow>(
      `UPDATE credit_wallets
       SET available_credits = available_credits - $1,
           locked_credits = locked_credits + $1
       WHERE user_id = $2
         AND available_credits >= $1
       RETURNING available_credits, locked_credits`,
      [stakeAmount, reporterId],
    );

    if (!updatedWallet.rows[0]) {
      throw new AppError("Insufficient credits to report this incident", 400);
    }

    // 7. Record credit transaction
    await client.query(
      `INSERT INTO credit_transactions (user_id, signal_id, amount, type)
       VALUES ($1, $2, $3, 'STAKE')`,
      [reporterId, signalId, stakeAmount],
    );

    // 8. Severity Response Routing:
    // If CRITICAL: automatically create emergency escalation record & audit log
    if (finalSeverity === "CRITICAL") {
      await client.query(
        `INSERT INTO escalations (signal_id, reason, status, sent_at)
         VALUES ($1, $2, 'SENT', now())`,
        [
          signalId,
          `CRITICAL ${input.category} incident triaged: ${triage.summary}`,
        ],
      );

      await client.query(
        `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
         VALUES ($1, 'incident.auto_escalate', 'signals', $2, $3::jsonb)`,
        [
          reporterId,
          signalId,
          JSON.stringify({
            severity: finalSeverity,
            destination: "MOCK_AUTHORITY",
            responder: triage.recommendedResponder,
          }),
        ],
      );
    }

    // 9. Load created signal
    const created = await loadPublicSignal(signalId, client);
    if (!created) {
      throw new AppError("Failed to load created signal", 500);
    }

    return created;
  });
}

