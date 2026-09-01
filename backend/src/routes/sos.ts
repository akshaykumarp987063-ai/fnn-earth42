import { Router } from "express";
import { postSos } from "../controllers/sosController";
import { requireAuth } from "../middleware/auth";

export const sosRouter = Router();

sosRouter.post("/", requireAuth, postSos);
