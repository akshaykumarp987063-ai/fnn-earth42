import { Router } from "express";
import { postCreateChallenge } from "../controllers/privacyController";
import {
  getNearbySignals,
  getSignal,
  getSignals,
  postEscalate,
  postLocationProof,
  postSignal,
  postVote,
} from "../controllers/signalController";
import { requireAuth } from "../middleware/auth";

export const signalsRouter = Router();

signalsRouter.get("/", getSignals);
signalsRouter.get("/nearby", getNearbySignals);
signalsRouter.get("/:id", getSignal);
signalsRouter.post("/", requireAuth, postSignal);
signalsRouter.post("/:id/vote", requireAuth, postVote);
signalsRouter.post("/:id/location-proof", requireAuth, postLocationProof);
signalsRouter.post("/:id/escalate", requireAuth, postEscalate);
signalsRouter.post("/:id/challenge", requireAuth, postCreateChallenge);

