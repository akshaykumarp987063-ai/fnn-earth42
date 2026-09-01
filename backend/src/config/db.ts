import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { env } from "./env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
  // Prevent unhandled errors from crashing the process
  console.error("PostgreSQL pool client error (reconnected):", error.message);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function connectDatabase(): Promise<void> {
  try {
    await query("SELECT 1 AS ok");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    throw new Error(`PostgreSQL connection failed: ${message}`);
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to rollback transaction:", rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
}
