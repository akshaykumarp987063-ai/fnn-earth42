import type { Request, Response } from "express";
import { getCredits } from "../services/creditService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const getUserCredits = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const credits = await getCredits(req.user.id);
  res.status(200).json(credits);
});
