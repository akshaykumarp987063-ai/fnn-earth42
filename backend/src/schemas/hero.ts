import { z } from "zod";

export const nearbyHeroesQuerySchema = z.object({
  latitude: z.coerce
    .number()
    .gte(-90, "Latitude must be between -90 and 90")
    .lte(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce
    .number()
    .gte(-180, "Longitude must be between -180 and 180")
    .lte(180, "Longitude must be between -180 and 180"),
  radius: z.coerce.number().positive().default(1000),
});

export type NearbyHeroesQuery = z.infer<typeof nearbyHeroesQuerySchema>;
