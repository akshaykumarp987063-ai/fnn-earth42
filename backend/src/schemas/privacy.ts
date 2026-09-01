import { z } from "zod";

export const createPrivacyChallengeParamSchema = z.object({
  id: z.string().uuid("Invalid signal id"),
});

export const challengeIdParamSchema = z.object({
  id: z.string().uuid("Invalid challenge id"),
});

export const submitSelfieSchema = z.object({
  selfieUrl: z.string().trim().url("Valid selfie URL required").optional(),
  matchConfidence: z.coerce.number().min(0).max(1).optional(),
  matchResult: z.boolean().optional(),
});

export type CreatePrivacyChallengeParam = z.infer<typeof createPrivacyChallengeParamSchema>;
export type ChallengeIdParam = z.infer<typeof challengeIdParamSchema>;
export type SubmitSelfieInput = z.infer<typeof submitSelfieSchema>;
