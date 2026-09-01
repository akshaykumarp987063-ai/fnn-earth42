import { Router } from "express";
import { patchTaskStatus, postAcceptTask } from "../controllers/taskController";
import { requireAuth } from "../middleware/auth";

export const tasksRouter = Router();

tasksRouter.post("/:id/accept", requireAuth, postAcceptTask);
tasksRouter.patch("/:id/status", requireAuth, patchTaskStatus);
