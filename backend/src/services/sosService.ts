import { withTransaction } from "../config/db";
import { AppError } from "../utils/AppError";
import { ensureWallet } from "./creditService";
import { loadPublicSignal } from "./signalService";

export async function triggerSos(
  userId: string,
  latitude: number,
  longitude: number,
  note?: string,
) {
  return withTransaction(async (client) => {
    // 1. Verify profile
    const profile = await client.query<{ id: string; pseudonym: string }>(
      `SELECT id, pseudonym FROM profiles WHERE id = $1 LIMIT 1`,
      [userId],
    );

    if (!profile.rows[0]) {
      throw new AppError("Profile not found", 404);
    }

    const reporterName = profile.rows[0].pseudonym;
    const description = note
      ? `EMERGENCY SOS: ${note} (Reported by ${reporterName})`
      : `EMERGENCY SOS: User ${reporterName} activated panic/SOS button at coordinates (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;

    // 2. Ensure wallet exists
    await ensureWallet(userId, client);

    // 3. Create Critical Signal
    const insertedSignal = await client.query<{ id: string }>(
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
         'PERSONAL_SAFETY',
         'CRITICAL',
         'IMMEDIATE',
         1.000,
         $3,
         $4,
         'ESCALATED'
       )
       RETURNING id`,
      [userId, description, latitude, longitude],
    );

    const signalId = insertedSignal.rows[0]?.id;
    if (!signalId) {
      throw new AppError("Failed to create SOS signal", 500);
    }

    // 4. Create Escalation Record
    const insertedEscalation = await client.query<{ id: string }>(
      `INSERT INTO escalations (signal_id, reason, status, sent_at)
       VALUES ($1, $2, 'SENT', now())
       RETURNING id`,
      [signalId, `Automated emergency SOS dispatch for user ${reporterName}`],
    );

    const escalationId = insertedEscalation.rows[0]?.id;

    // 5. Audit Log
    await client.query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
       VALUES ($1, 'sos.trigger', 'signals', $2, $3::jsonb)`,
      [
        userId,
        signalId,
        JSON.stringify({
          escalationId,
          destination: "MOCK_AUTHORITY (Campus Emergency Dispatch)",
          coordinates: { latitude, longitude },
          timestamp: new Date().toISOString(),
        }),
      ],
    );

    const signal = await loadPublicSignal(signalId, client);

    return {
      message: "Emergency SOS activated. Hyperlocal responders and emergency dispatch have been notified.",
      signal,
      escalation: {
        id: escalationId,
        destination: "MOCK_AUTHORITY (VIT Campus Security & Emergency Response)",
        status: "SENT",
      },
    };
  });
}
