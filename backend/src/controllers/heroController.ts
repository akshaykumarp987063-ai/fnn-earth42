import type { Request, Response } from "express";
import { nearbyHeroesQuerySchema } from "../schemas/hero";
import { listNearbyHeroes } from "../services/heroService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const getNearbyHeroes = asyncHandler(async (req: Request, res: Response) => {
  const parsed = nearbyHeroesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const heroes = await listNearbyHeroes(parsed.data);
  res.status(200).json({ heroes });
});
