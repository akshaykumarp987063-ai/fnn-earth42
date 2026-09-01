import { createApp } from "./app";
import { closeDatabase, connectDatabase } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`fnn-api listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      try {
        await closeDatabase();
      } catch (error) {
        console.error("Error closing PostgreSQL pool:", error);
      }
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  console.error("Failed to start fnn-api:", message);
  process.exit(1);
});
