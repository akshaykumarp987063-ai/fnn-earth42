import { withTransaction } from "../config/db";
import type { VoteSignalInput } from "../schemas/signal";
import { AppError } from "../utils/AppError";
import { calculateDistanceMeters, DEFAULT_HYPERLOCAL_RADIUS_METERS } from "../utils/geo";
import { loadPublicSignal } from "./signalService";

type SignalCheckRow = {
  id: string;
  reporter_id: string;
  latitude: number;
  longitude: number;
  status: string;
  upvotes: number;
  downvotes: number;
};

export async function voteOnSignal(
  userId: string,
  signalId: string,
  input: VoteSignalInput,
) {
  return withTransaction(async (client) => {
    // 1. Fetch signal
    const signalResult = await client.query<SignalCheckRow>(
      `SELECT id, reporter_id, latitude, longitude, status, upvotes, downvotes
       FROM signals
       WHERE id = $1
       FOR UPDATE`,
       [signalId],
    );

    const signal = signalResult.rows[0];
    if (!signal) {
      throw new AppError("Signal not found", 404);
    }

    // 2. Rule: User cannot vote on their own signal
    if (signal.reporter_id === userId) {
      throw new AppError("You cannot vote on your own incident report", 400);
    }

    // 3. Rule: Proximity check (must be within 500 meters)
    if (input.latitude !== undefined && input.longitude !== undefined) {
      const distance = calculateDistanceMeters(
        input.latitude,
        input.longitude,
        Number(signal.latitude),
        Number(signal.longitude),
      );

      if (distance > DEFAULT_HYPERLOCAL_RADIUS_METERS) {
        throw new AppError(
          `Voting is only allowed within ${DEFAULT_HYPERLOCAL_RADIUS_METERS}m of the incident. You are ${Math.round(distance)}m away.`,
          403,
        );
      }
    }

    // 4. Rule: User must submit or have submitted a location proof
    let proofMediaId = input.proofMediaId ?? null;
    if (!proofMediaId) {
      const existingProof = await client.query<{ id: string }>(
        `SELECT id FROM signal_media
         WHERE signal_id = $1 AND uploader_id = $2
         ORDER BY created_at DESC
         LIMIT 1`,
        [signalId, userId],
      );
      if (existingProof.rows[0]) {
        proofMediaId = existingProof.rows[0].id;
      }
    }

    // 5. Rule: Check for duplicate vote by this user
    const existingVote = await client.query<{ id: string; vote: string }>(
      `SELECT id, vote FROM signal_votes
       WHERE signal_id = $1 AND user_id = $2
       LIMIT 1`,
      [signalId, userId],
    );

    if (existingVote.rows[0]) {
      throw new AppError("You have already voted on this incident", 409);
    }

    // 6. Record vote
    await client.query(
      `INSERT INTO signal_votes (signal_id, user_id, vote, proof_media_id)
       VALUES ($1, $2, $3::vote_type, $4)`,
      [signalId, userId, input.vote, proofMediaId],
    );

    // 7. Atomically update vote counters
    const isUp = input.vote === "UP";
    const updateQuery = isUp
      ? `UPDATE signals SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes, downvotes, status`
      : `UPDATE signals SET downvotes = downvotes + 1 WHERE id = $1 RETURNING upvotes, downvotes, status`;

    const updatedSignalResult = await client.query<{ upvotes: number; downvotes: number; status: string }>(
      updateQuery,
      [signalId],
    );

    const updatedRow = updatedSignalResult.rows[0];

    // Status progression: if 2+ upvotes and currently OPEN, transition to VERIFIED
    if (updatedRow && updatedRow.upvotes >= 2 && updatedRow.status === "OPEN") {
      await client.query(`UPDATE signals SET status = 'VERIFIED' WHERE id = $1`, [signalId]);
    }

    const updatedPublicSignal = await loadPublicSignal(signalId, client);
    return {
      message: "Vote recorded successfully",
      vote: input.vote,
      signal: updatedPublicSignal,
    };
  });
}
