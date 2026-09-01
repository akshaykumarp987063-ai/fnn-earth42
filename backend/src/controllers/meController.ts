import type { Request, Response } from "express";
import { query } from "../config/db";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

type ProfileRow = {
  id: string;
  email: string | null;
  pseudonym: string;
  role: string;
  reputation: number;
};

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await query<ProfileRow>(
    `SELECT id, email, pseudonym, role, reputation
     FROM profiles
     WHERE id = $1
     LIMIT 1`,
    [req.user.id],
  );

  const profile = result.rows[0];

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  res.status(200).json({
    id: profile.id,
    email: profile.email ?? req.user.email,
    pseudonym: profile.pseudonym,
    role: profile.role,
    reputation: profile.reputation,
  });
});
