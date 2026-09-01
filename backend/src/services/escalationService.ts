import { query, withTransaction } from "../config/db";
import type { EscalationRecord } from "../types";
import { AppError } from "../utils/AppError";
import { loadPublicSignal } from "./signalService";

type EscalationRow = {
  id: string;
  signal_id: string;
  reason: string;
  status: string;
  sent_at: Date | string | null;
  created_at: Date | string;
};

function toIso(val: Date | string | null): string | null {
  if (!val) return null;
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

export async function escalateSignal(
  actorId: string,
  signalId: string,
  reason?: string,
  destination: string = "MOCK_AUTHORITY",
): Promise<{ escalation: EscalationRecord; signal: any }> {
  return withTransaction(async (client) => {
    const signalCheck = await client.query<{ id: string; description: string; category: string }>(
      `SELECT id, description, category::text AS category FROM signals WHERE id = $1 FOR UPDATE`,
      [signalId],
    );

    const signal = signalCheck.rows[0];
    if (!signal) {
      throw new AppError("Signal not found", 404);
    }

    const defaultReason = reason || `Escalation requested for critical ${signal.category} incident: ${signal.description.substring(0, 100)}`;

    const result = await client.query<EscalationRow>(
      `INSERT INTO escalations (signal_id, reason, status, sent_at)
       VALUES ($1, $2, 'SENT', now())
       RETURNING id, signal_id, reason, status, sent_at, created_at`,
      [signalId, defaultReason],
    );

    const row = result.rows[0];
    if (!row) {
      throw new AppError("Failed to create escalation", 500);
    }

    // Record immutable audit log
    await client.query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
       VALUES ($1, 'escalation.send', 'escalations', $2, $3::jsonb)`,
      [
        actorId,
        row.id,
        JSON.stringify({
          signalId,
          destination,
          reason: defaultReason,
          timestamp: new Date().toISOString(),
        }),
      ],
    );

    // Update signal status to ESCALATED
    await client.query(`UPDATE signals SET status = 'ESCALATED' WHERE id = $1`, [signalId]);

    const updatedSignal = await loadPublicSignal(signalId, client);

    const escalation: EscalationRecord = {
      id: row.id,
      signalId: row.signal_id,
      reason: row.reason,
      destination,
      status: row.status as EscalationRecord["status"],
      sentAt: toIso(row.sent_at),
      createdAt: toIso(row.created_at)!,
    };

    return {
      escalation,
      signal: updatedSignal,
    };
  });
}
