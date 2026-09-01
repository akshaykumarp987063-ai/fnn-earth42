/**
 * Geolocation utilities for hyperlocal calculations.
 */

export const DEFAULT_HYPERLOCAL_RADIUS_METERS = 500;
export const DEFAULT_DUPLICATE_RADIUS_METERS = 100;

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * @returns Distance in meters.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Checks whether a target point is within the specified radius of an origin point.
 */
export function isWithinRadius(
  originLat: number,
  originLon: number,
  targetLat: number,
  targetLon: number,
  radiusMeters: number = DEFAULT_HYPERLOCAL_RADIUS_METERS,
): boolean {
  return calculateDistanceMeters(originLat, originLon, targetLat, targetLon) <= radiusMeters;
}
