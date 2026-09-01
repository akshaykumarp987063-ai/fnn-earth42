import { haversineDistanceMeters, type GeoPoint } from "./distance";

/** Demo default. Pass `radiusMeters` into helpers instead of duplicating this value. */
export const DEFAULT_DEMO_RADIUS_METERS = 500;

export function assertPositiveRadius(radiusMeters: number): void {
  if (!Number.isFinite(radiusMeters) || radiusMeters < 0) {
    throw new RangeError("radiusMeters must be a finite number >= 0");
  }
}

export function resolveRadiusMeters(radiusMeters?: number): number {
  const resolved = radiusMeters ?? DEFAULT_DEMO_RADIUS_METERS;
  assertPositiveRadius(resolved);
  return resolved;
}

export function isWithinDistance(distanceMeters: number, radiusMeters?: number): boolean {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new RangeError("distanceMeters must be a finite number >= 0");
  }
  return distanceMeters <= resolveRadiusMeters(radiusMeters);
}

export function isWithinRadius(
  origin: GeoPoint,
  point: GeoPoint,
  radiusMeters?: number,
): boolean {
  return isWithinDistance(haversineDistanceMeters(origin, point), radiusMeters);
}

export interface NearbyMatch<T> {
  item: T;
  distanceMeters: number;
}

export function filterWithinRadius<T>(
  origin: GeoPoint,
  items: readonly T[],
  getPoint: (item: T) => GeoPoint,
  radiusMeters?: number,
): NearbyMatch<T>[] {
  const radius = resolveRadiusMeters(radiusMeters);

  const matches: NearbyMatch<T>[] = [];
  for (const item of items) {
    const distanceMeters = haversineDistanceMeters(origin, getPoint(item));
    if (isWithinDistance(distanceMeters, radius)) {
      matches.push({ item, distanceMeters });
    }
  }

  matches.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return matches;
}
