import type { RequestHandler } from "express";
import { supabase } from "../config/supabase";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function readBearerToken(authorizationHeader: string | undefined): string {
  if (!authorizationHeader) {
    throw new AppError("Missing authorization header", 401);
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorizationHeader.trim());
  if (!match) {
    throw new AppError("Bearer token required", 401);
  }

  return match[1];
}

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req.get("authorization"));

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.id) {
    throw new AppError("Invalid or expired token", 401);
  }

  req.user = {
    id: data.user.id,
    email: data.user.email ?? null,
  };

  next();
});
