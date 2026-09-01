import { Router } from "express";
import { postSubmitSelfie } from "../controllers/privacyController";
import { requireAuth } from "../middleware/auth";

export const privacyRouter = Router();

privacyRouter.post("/:id/selfie", requireAuth, postSubmitSelfie);
