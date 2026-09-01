export {
  EARTH_RADIUS_METERS,
  assertGeoPoint,
  haversineDistanceMeters,
  type GeoPoint,
} from "./distance";

export {
  DEFAULT_DEMO_RADIUS_METERS,
  assertPositiveRadius,
  filterWithinRadius,
  isWithinDistance,
  isWithinRadius,
  resolveRadiusMeters,
  type NearbyMatch,
} from "./radius";

export {
  filterNearbyHeroes,
  filterNearbyUsers,
  heroMatchesSkillAndCategory,
  matchNearbyHeroes,
  type HeroMatchCriteria,
  type LocatedHero,
  type LocatedUser,
} from "./heroMatching";
