import type { Request, Response } from "express";
import { sosSchema } from "../schemas/sos";
import { triggerSos } from "../services/sosService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const postSos = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const parsed = sosSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const result = await triggerSos(
    req.user.id,
    parsed.data.latitude,
    parsed.data.longitude,
    parsed.data.note,
  );

  res.status(201).json(result);
});
