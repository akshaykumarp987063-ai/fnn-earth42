import type { Request, Response } from "express";
import { escalateSignalBodySchema, escalateSignalParamSchema } from "../schemas/escalation";
import {
  createSignalSchema,
  locationProofSchema,
  nearbySignalsQuerySchema,
  signalIdParamSchema,
  voteSignalSchema,
} from "../schemas/signal";
import { escalateSignal } from "../services/escalationService";
import { submitLocationProof } from "../services/proofService";
import {
  createSignal,
  getSignalById,
  listNearbySignals,
  listSignals,
} from "../services/signalService";
import { voteOnSignal } from "../services/voteService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const postSignal = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const parsed = createSignalSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const signal = await createSignal(req.user.id, parsed.data);
  res.status(201).json(signal);
});

export const getSignals = asyncHandler(async (_req: Request, res: Response) => {
  const signals = await listSignals();
  res.status(200).json({ signals });
});

export const getNearbySignals = asyncHandler(async (req: Request, res: Response) => {
  const parsed = nearbySignalsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const signals = await listNearbySignals(parsed.data);
  res.status(200).json({ signals });
});

export const getSignal = asyncHandler(async (req: Request, res: Response) => {
  const parsed = signalIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const signal = await getSignalById(parsed.data.id);
  res.status(200).json(signal);
});

export const postVote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = signalIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const bodyParsed = voteSignalSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(firstZodMessage(bodyParsed.error), 400);
  }

  const result = await voteOnSignal(req.user.id, paramParsed.data.id, bodyParsed.data);
  res.status(200).json(result);
});

export const postLocationProof = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = signalIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const bodyParsed = locationProofSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(firstZodMessage(bodyParsed.error), 400);
  }

  const proof = await submitLocationProof(
    req.user.id,
    paramParsed.data.id,
    bodyParsed.data.mediaUrl,
    bodyParsed.data.latitude,
    bodyParsed.data.longitude,
  );

  res.status(201).json({
    message: "Location proof uploaded successfully",
    proof,
  });
});

export const postEscalate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = escalateSignalParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const bodyParsed = escalateSignalBodySchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(firstZodMessage(bodyParsed.error), 400);
  }

  const result = await escalateSignal(
    req.user.id,
    paramParsed.data.id,
    bodyParsed.data.reason,
    bodyParsed.data.destination,
  );

  res.status(200).json(result);
});

