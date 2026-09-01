import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError("Not found", 404));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  const pgCode =
    typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : undefined;

  if (pgCode) {
    console.error("PostgreSQL error:", err);
    res.status(503).json({
      error: {
        message: "Database error",
        status: 503,
      },
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      message: "Internal server error",
      status: 500,
    },
  });
}
