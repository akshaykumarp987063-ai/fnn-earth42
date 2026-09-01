import { Router } from "express";
import { getNearbyHeroes } from "../controllers/heroController";

export const heroesRouter = Router();

heroesRouter.get("/nearby", getNearbyHeroes);
