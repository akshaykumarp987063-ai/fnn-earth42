/**
 * Example usage / self-check for the geo module.
 * Run later with: npx tsx shared/geo/example.ts
 * (Node is not required to land this module; this file is documentation + assertions.)
 */
import {
  DEFAULT_DEMO_RADIUS_METERS,
  filterNearbyHeroes,
  filterNearbyUsers,
  haversineDistanceMeters,
  matchNearbyHeroes,
  type LocatedHero,
} from "./index";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const origin = { latitude: 12.9716, longitude: 77.5946 };

const almostSameBlock = { latitude: 12.973, longitude: 77.5946 };
const acrossTown = { latitude: 13.035, longitude: 77.597 };

const nearMeters = haversineDistanceMeters(origin, almostSameBlock);
const farMeters = haversineDistanceMeters(origin, acrossTown);

assert(nearMeters < DEFAULT_DEMO_RADIUS_METERS, "same-block point should be inside demo radius");
assert(farMeters > DEFAULT_DEMO_RADIUS_METERS, "across-town point should be outside demo radius");

const users = [
  { id: "u-near", ...almostSameBlock },
  { id: "u-far", ...acrossTown },
];

const nearbyUsers = filterNearbyUsers(origin, users);
assert(nearbyUsers.length === 1 && nearbyUsers[0].item.id === "u-near", "only nearby user");

const heroes: LocatedHero[] = [
  {
    id: "h-busy",
    ...almostSameBlock,
    available: false,
    skill: "medical",
    category: "medical",
  },
  {
    id: "h-wrong-skill",
    ...almostSameBlock,
    available: true,
    skill: "fire",
    category: "fire",
  },
  {
    id: "h-far-medic",
    ...acrossTown,
    available: true,
    skill: "medical",
    category: "medical",
  },
  {
    id: "h-near-medic-b",
    latitude: 12.9722,
    longitude: 77.5946,
    available: true,
    skill: "medical",
    category: "medical",
  },
  {
    id: "h-near-medic-a",
    latitude: 12.9718,
    longitude: 77.5946,
    available: true,
    skills: ["medical"],
    category: "medical",
  },
];

const nearbyHeroes = filterNearbyHeroes(origin, heroes);
assert(
  nearbyHeroes.every((match) => match.distanceMeters <= DEFAULT_DEMO_RADIUS_METERS),
  "nearby Heroes are radius-only",
);

const matched = matchNearbyHeroes(heroes, {
  origin,
  requiredSkill: "medical",
  requiredCategory: "medical",
});

assert(
  matched.map((m) => m.item.id).join(",") === "h-near-medic-a,h-near-medic-b",
  "available + skill/category + distance, nearest first",
);

assert(
  matched[0].distanceMeters <= matched[1].distanceMeters,
  "eligible Heroes sorted nearest-first",
);

console.log("geo example checks passed", {
  nearMeters: Math.round(nearMeters),
  farMeters: Math.round(farMeters),
  matchedIds: matched.map((m) => m.item.id),
});
