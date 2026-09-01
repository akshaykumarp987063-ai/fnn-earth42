import { type GeoPoint } from "./distance";
import {
  filterWithinRadius,
  resolveRadiusMeters,
  type NearbyMatch,
} from "./radius";

export interface LocatedUser {
  id: string;
  latitude: number;
  longitude: number;
}

export interface LocatedHero {
  id: string;
  latitude: number;
  longitude: number;
  available: boolean;
  /** Primary skill label, if the caller stores a single skill. */
  skill?: string;
  /** Additional skills the Hero can cover. */
  skills?: readonly string[];
  /** Service category the Hero belongs to. */
  category?: string;
}

export interface HeroMatchCriteria {
  origin: GeoPoint;
  /** Defaults to DEFAULT_DEMO_RADIUS_METERS when omitted. */
  radiusMeters?: number;
  requiredSkill?: string;
  requiredCategory?: string;
}

function asPoint(entity: { latitude: number; longitude: number }): GeoPoint {
  return { latitude: entity.latitude, longitude: entity.longitude };
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function heroSkills(hero: LocatedHero): string[] {
  const labels: string[] = [];
  if (hero.skill) labels.push(hero.skill);
  if (hero.skills) labels.push(...hero.skills);
  return labels.map(normalizeLabel);
}

function matchesRequiredSkill(hero: LocatedHero, requiredSkill: string): boolean {
  const required = normalizeLabel(requiredSkill);
  if (!required) return false;
  return heroSkills(hero).includes(required);
}

function matchesRequiredCategory(hero: LocatedHero, requiredCategory: string): boolean {
  const required = normalizeLabel(requiredCategory);
  if (!required || !hero.category) return false;
  return normalizeLabel(hero.category) === required;
}

export function heroMatchesSkillAndCategory(
  hero: LocatedHero,
  criteria: Pick<HeroMatchCriteria, "requiredSkill" | "requiredCategory">,
): boolean {
  const hasSkill = Boolean(criteria.requiredSkill?.trim());
  const hasCategory = Boolean(criteria.requiredCategory?.trim());

  if (!hasSkill && !hasCategory) {
    throw new Error("Hero matching requires requiredSkill and/or requiredCategory");
  }

  if (hasSkill && !matchesRequiredSkill(hero, criteria.requiredSkill as string)) {
    return false;
  }
  if (hasCategory && !matchesRequiredCategory(hero, criteria.requiredCategory as string)) {
    return false;
  }
  return true;
}

export function filterNearbyUsers(
  origin: GeoPoint,
  users: readonly LocatedUser[],
  radiusMeters?: number,
): NearbyMatch<LocatedUser>[] {
  resolveRadiusMeters(radiusMeters);
  return filterWithinRadius(origin, users, asPoint, radiusMeters);
}

export function filterNearbyHeroes(
  origin: GeoPoint,
  heroes: readonly LocatedHero[],
  radiusMeters?: number,
): NearbyMatch<LocatedHero>[] {
  resolveRadiusMeters(radiusMeters);
  return filterWithinRadius(origin, heroes, asPoint, radiusMeters);
}

/**
 * Eligible Heroes: available, matching skill/category, and inside the radius.
 * Results are nearest-first.
 */
export function matchNearbyHeroes(
  heroes: readonly LocatedHero[],
  criteria: HeroMatchCriteria,
): NearbyMatch<LocatedHero>[] {
  const radiusMeters = resolveRadiusMeters(criteria.radiusMeters);
  const eligible = heroes.filter(
    (hero) => hero.available && heroMatchesSkillAndCategory(hero, criteria),
  );
  return filterWithinRadius(criteria.origin, eligible, asPoint, radiusMeters);
}
