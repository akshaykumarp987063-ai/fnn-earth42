/** Mean Earth radius used by Haversine. Distances are always meters. */
export const EARTH_RADIUS_METERS = 6_371_000;

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function assertValidCoordinate(value: number, name: string, min: number, max: number): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be a finite number between ${min} and ${max}`);
  }
}

export function assertGeoPoint(point: GeoPoint): void {
  assertValidCoordinate(point.latitude, "latitude", -90, 90);
  assertValidCoordinate(point.longitude, "longitude", -180, 180);
}

/**
 * Great-circle distance between two WGS84 points, in meters.
 */
export function haversineDistanceMeters(from: GeoPoint, to: GeoPoint): number {
  assertGeoPoint(from);
  assertGeoPoint(to);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}
