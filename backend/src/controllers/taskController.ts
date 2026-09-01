import type { Request, Response } from "express";
import { taskIdParamSchema, updateTaskStatusSchema } from "../schemas/task";
import { acceptTask, updateTaskStatus } from "../services/taskService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const postAcceptTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const task = await acceptTask(req.user.id, paramParsed.data.id);
  res.status(200).json(task);
});

export const patchTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const paramParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(firstZodMessage(paramParsed.error), 400);
  }

  const bodyParsed = updateTaskStatusSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(firstZodMessage(bodyParsed.error), 400);
  }

  const task = await updateTaskStatus(
    req.user.id,
    paramParsed.data.id,
    bodyParsed.data.status,
  );

  res.status(200).json(task);
});
