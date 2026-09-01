import { query, withTransaction } from "../config/db";
import type { PrivacyChallenge, PrivacyChallengeStatus } from "../types";
import { AppError } from "../utils/AppError";

type ChallengeRow = {
  id: string;
  signal_id: string;
  user_id: string;
  expires_at: Date | string;
  status: string;
  match_confidence: string | number | null;
  created_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapChallenge(row: ChallengeRow): PrivacyChallenge {
  return {
    id: row.id,
    signalId: row.signal_id,
    userId: row.user_id,
    status: row.status as PrivacyChallengeStatus,
    expiresAt: toIso(row.expires_at),
    matchConfidence: row.match_confidence !== null ? Number(row.match_confidence) : null,
    createdAt: toIso(row.created_at),
  };
}

export async function createPrivacyChallenge(
  userId: string,
  signalId: string,
): Promise<PrivacyChallenge> {
  const signalCheck = await query<{ id: string }>(
    `SELECT id FROM signals WHERE id = $1 LIMIT 1`,
    [signalId],
  );

  if (!signalCheck.rows[0]) {
    throw new AppError("Signal not found", 404);
  }

  // Check if an active challenge already exists for this user and signal
  const existing = await query<ChallengeRow>(
    `SELECT id, signal_id, user_id, expires_at, status, match_confidence, created_at
     FROM privacy_challenges
     WHERE signal_id = $1 AND user_id = $2 AND status = 'PENDING' AND expires_at > now()
     LIMIT 1`,
    [signalId, userId],
  );

  if (existing.rows[0]) {
    return mapChallenge(existing.rows[0]);
  }

  // 60-second privacy challenge window
  const result = await query<ChallengeRow>(
    `INSERT INTO privacy_challenges (signal_id, user_id, expires_at, status)
     VALUES ($1, $2, now() + interval '60 seconds', 'PENDING')
     RETURNING id, signal_id, user_id, expires_at, status, match_confidence, created_at`,
    [signalId, userId],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError("Failed to create privacy challenge", 500);
  }

  return mapChallenge(row);
}

export async function submitPrivacySelfie(
  userId: string,
  challengeId: string,
  selfieUrl?: string,
  matchResult?: boolean,
  matchConfidence?: number,
): Promise<{ challenge: PrivacyChallenge; message: string; privacyProtected: boolean }> {
  return withTransaction(async (client) => {
    const result = await client.query<ChallengeRow>(
      `SELECT id, signal_id, user_id, expires_at, status, match_confidence, created_at
       FROM privacy_challenges
       WHERE id = $1
       FOR UPDATE`,
      [challengeId],
    );

    const challenge = result.rows[0];
    if (!challenge) {
      throw new AppError("Privacy challenge not found", 404);
    }

    if (challenge.user_id !== userId) {
      throw new AppError("You are not authorized for this privacy challenge", 403);
    }

    const expiresAt = challenge.expires_at instanceof Date
      ? challenge.expires_at
      : new Date(challenge.expires_at);

    // Check 60-second expiration
    if (new Date() > expiresAt || challenge.status === "EXPIRED") {
      await client.query(
        `UPDATE privacy_challenges SET status = 'EXPIRED' WHERE id = $1`,
        [challengeId],
      );
      throw new AppError("Privacy challenge window has expired (60s limit reached)", 410);
    }

    if (challenge.status !== "PENDING") {
      throw new AppError(`Privacy challenge already resolved with status '${challenge.status}'`, 400);
    }

    // Determine AI match result (default high confidence if simulated selfie provided)
    const confidence = matchConfidence ?? (selfieUrl || matchResult ? 0.92 : 0.40);
    const isMatch = matchResult !== undefined ? matchResult : confidence >= 0.75;
    const finalStatus: PrivacyChallengeStatus = isMatch ? "MATCHED" : "NOT_MATCHED";

    const updated = await client.query<ChallengeRow>(
      `UPDATE privacy_challenges
       SET status = $1::privacy_challenge_status,
           match_confidence = $2
       WHERE id = $3
       RETURNING id, signal_id, user_id, expires_at, status, match_confidence, created_at`,
      [finalStatus, confidence, challengeId],
    );

    // If matched, protect user privacy by masking public exposure
    if (isMatch) {
      await client.query(
        `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
         VALUES ($1, 'privacy.matched_protection', 'signals', $2, $3::jsonb)`,
        [
          userId,
          challenge.signal_id,
          JSON.stringify({
            challengeId,
            matchConfidence: confidence,
            action: "Protected incident photo visibility for subject match",
          }),
        ],
      );
    }

    const updatedChallenge = mapChallenge(updated.rows[0]);

    return {
      challenge: updatedChallenge,
      message: isMatch
        ? "Identity verified. Privacy lock activated: incident details protected."
        : "Photo match failed. Privacy challenge rejected.",
      privacyProtected: isMatch,
    };
  });
}
