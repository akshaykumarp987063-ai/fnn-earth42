import { Router } from "express";
import { getUserCredits } from "../controllers/creditController";
import { requireAuth } from "../middleware/auth";

export const creditsRouter = Router();

creditsRouter.get("/", requireAuth, getUserCredits);
