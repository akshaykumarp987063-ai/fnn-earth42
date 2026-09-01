import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { getHealth } from "./controllers/healthController";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());

  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    }),
  );
  app.use(express.json());

  app.get("/health", getHealth);

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
