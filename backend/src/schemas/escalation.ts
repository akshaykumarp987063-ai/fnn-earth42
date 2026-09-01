import { z } from "zod";

export const escalateSignalParamSchema = z.object({
  id: z.string().uuid("Invalid signal id"),
});

export const escalateSignalBodySchema = z.object({
  reason: z.string().trim().min(1, "Reason is required").max(1000).optional(),
  destination: z.string().trim().max(255).optional(),
});

export type EscalateSignalParam = z.infer<typeof escalateSignalParamSchema>;
export type EscalateSignalBody = z.infer<typeof escalateSignalBodySchema>;
