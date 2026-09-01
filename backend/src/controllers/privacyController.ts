import type { Request, Response } from "express";
import {
  challengeIdParamSchema,
  createPrivacyChallengeParamSchema,
  submitSelfieSchema,
} from "../schemas/privacy";
import {
  createPrivacyChallenge,
  submitPrivacySelfie,
} from "../services/privacyService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const postCreateChallenge = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = createPrivacyChallengeParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const challenge = await createPrivacyChallenge(req.user.id, paramParsed.data.id);
  res.status(201).json(challenge);
});

export const postSubmitSelfie = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = challengeIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const bodyParsed = submitSelfieSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(firstZodMessage(bodyParsed.error), 400);
  }

  const result = await submitPrivacySelfie(
    req.user.id,
    paramParsed.data.id,
    bodyParsed.data.selfieUrl,
    bodyParsed.data.matchResult,
    bodyParsed.data.matchConfidence,
  );

  res.status(200).json(result);
});
