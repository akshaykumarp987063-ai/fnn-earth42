import { query } from "../config/db";
import { AppError } from "../utils/AppError";
import { calculateDistanceMeters, DEFAULT_HYPERLOCAL_RADIUS_METERS } from "../utils/geo";

type SignalCoordsRow = {
  id: string;
  latitude: number;
  longitude: number;
};

type MediaRow = {
  id: string;
  signal_id: string;
  uploader_id: string;
  url: string;
  created_at: Date | string;
};

export async function submitLocationProof(
  userId: string,
  signalId: string,
  mediaUrl: string,
  latitude?: number,
  longitude?: number,
): Promise<{ id: string; signalId: string; url: string; createdAt: string }> {
  const signalResult = await query<SignalCoordsRow>(
    `SELECT id, latitude, longitude FROM signals WHERE id = $1 LIMIT 1`,
    [signalId],
  );

  const signal = signalResult.rows[0];
  if (!signal) {
    throw new AppError("Signal not found", 404);
  }

  if (latitude !== undefined && longitude !== undefined) {
    const distance = calculateDistanceMeters(
      latitude,
      longitude,
      Number(signal.latitude),
      Number(signal.longitude),
    );

    if (distance > DEFAULT_HYPERLOCAL_RADIUS_METERS) {
      throw new AppError(
        `Location proof must be taken within ${DEFAULT_HYPERLOCAL_RADIUS_METERS}m of the incident. You are ${Math.round(distance)}m away.`,
        400,
      );
    }
  }

  const result = await query<MediaRow>(
    `INSERT INTO signal_media (signal_id, uploader_id, url)
     VALUES ($1, $2, $3)
     RETURNING id, signal_id, uploader_id, url, created_at`,
    [signalId, userId, mediaUrl],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError("Failed to store location proof", 500);
  }

  return {
    id: row.id,
    signalId: row.signal_id,
    url: row.url,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}
