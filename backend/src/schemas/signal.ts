import { z } from "zod";

export const incidentCategorySchema = z.enum([
  "PERSONAL_SAFETY",
  "WOMEN_SAFETY",
  "CHILD_SAFETY",
  "ELDERLY_HELP",
  "MEDICAL",
  "TRANSPORT",
  "SUSPICIOUS_ACTIVITY",
  "DISASTER",
  "COMMUNITY_SERVICE",
  "FIRE",
  "INFRASTRUCTURE",
  "NATURAL_DISASTER",
  "LOST_PERSON",
  "LOST_ITEM",
  "OTHER",
]);

export const incidentSeveritySchema = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);

export const incidentUrgencySchema = z.enum(["IMMEDIATE", "SOON", "NORMAL"]);

export const createSignalSchema = z
  .object({
    description: z.string().trim().min(1, "Description is required").max(2000),
    latitude: z.coerce
      .number()
      .gte(-90, "Latitude must be between -90 and 90")
      .lte(90, "Latitude must be between -90 and 90"),
    longitude: z.coerce
      .number()
      .gte(-180, "Longitude must be between -180 and 180")
      .lte(180, "Longitude must be between -180 and 180"),
    category: incidentCategorySchema,
    severity: incidentSeveritySchema.optional(),
    urgency: incidentUrgencySchema.optional(),
    confidence: z.coerce.number().min(0).max(1).optional(),
    summary: z.string().trim().max(500).optional(),
    recommendedResponder: z.string().trim().max(255).optional(),
    stakeAmount: z.coerce.number().positive().optional(),
    mediaUrl: z.string().trim().url().max(2000).optional(),
  })
  .strip();

export const nearbySignalsQuerySchema = z.object({
  latitude: z.coerce
    .number()
    .gte(-90, "Latitude must be between -90 and 90")
    .lte(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce
    .number()
    .gte(-180, "Longitude must be between -180 and 180")
    .lte(180, "Longitude must be between -180 and 180"),
  radius: z.coerce.number().positive().default(500),
});

export const voteSignalSchema = z.object({
  vote: z.enum(["UP", "DOWN"]),
  latitude: z.coerce.number().gte(-90).lte(90).optional(),
  longitude: z.coerce.number().gte(-180).lte(180).optional(),
  proofMediaId: z.string().uuid().optional(),
});

export const locationProofSchema = z.object({
  mediaUrl: z.string().trim().url("Valid media URL required").max(2000),
  latitude: z.coerce.number().gte(-90).lte(90).optional(),
  longitude: z.coerce.number().gte(-180).lte(180).optional(),
});

export const signalIdParamSchema = z.object({
  id: z.string().uuid("Invalid signal id"),
});

export type CreateSignalInput = z.infer<typeof createSignalSchema>;
export type NearbySignalsQuery = z.infer<typeof nearbySignalsQuerySchema>;
export type VoteSignalInput = z.infer<typeof voteSignalSchema>;
export type LocationProofInput = z.infer<typeof locationProofSchema>;

