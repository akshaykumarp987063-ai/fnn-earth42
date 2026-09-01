import { Router } from "express";
import { getServices } from "../controllers/servicesController";

export const servicesRouter = Router();

servicesRouter.get("/", getServices);
