import { Router } from "express";
import { getMe } from "../controllers/meController";
import { requireAuth } from "../middleware/auth";

export const meRouter = Router();

meRouter.get("/", requireAuth, getMe);
