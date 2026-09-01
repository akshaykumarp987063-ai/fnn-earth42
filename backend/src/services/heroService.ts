import { query } from "../config/db";
import type { NearbyHeroesQuery } from "../schemas/hero";
import type { HeroNearbyResponse } from "../types";
import { calculateDistanceMeters } from "../utils/geo";

type HeroRow = {
  id: string;
  user_id: string;
  pseudonym: string;
  skills: string[];
  latitude: number;
  longitude: number;
  availability: boolean;
  reputation: number;
};

export async function listNearbyHeroes(
  queryCoords: NearbyHeroesQuery,
): Promise<HeroNearbyResponse[]> {
  const radius = queryCoords.radius || 1000;

  const result = await query<HeroRow>(
    `SELECT
       h.id,
       h.user_id,
       p.pseudonym,
       h.skills,
       h.latitude,
       h.longitude,
       h.availability,
       h.reputation
     FROM heroes h
     INNER JOIN profiles p ON p.id = h.user_id
     WHERE h.availability = true`,
  );

  const nearby: HeroNearbyResponse[] = result.rows
    .map((row) => {
      const dist = calculateDistanceMeters(
        queryCoords.latitude,
        queryCoords.longitude,
        Number(row.latitude),
        Number(row.longitude),
      );

      return {
        id: row.id,
        pseudonym: row.pseudonym,
        skills: row.skills ?? [],
        availability: row.availability,
        reputation: Number(row.reputation),
        distanceMeters: dist,
      };
    })
    .filter((hero) => hero.distanceMeters <= radius)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return nearby;
}
