import { query, withTransaction } from "../config/db";
import type { HeroTask, HeroTaskStatus } from "../types";
import { AppError } from "../utils/AppError";

type TaskRow = {
  id: string;
  signal_id: string;
  hero_id: string;
  hero_user_id: string;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapTaskRow(row: TaskRow): HeroTask {
  return {
    id: row.id,
    signalId: row.signal_id,
    heroId: row.hero_id,
    status: row.status as HeroTaskStatus,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["RESPONDING", "CANCELLED"],
  RESPONDING: ["ARRIVED", "CANCELLED"],
  ARRIVED: ["RESOLVED", "COMPLETED", "CANCELLED"],
  RESOLVED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export async function acceptTask(userId: string, taskId: string): Promise<HeroTask> {
  return withTransaction(async (client) => {
    const taskResult = await client.query<TaskRow>(
      `SELECT t.id, t.signal_id, t.hero_id, h.user_id AS hero_user_id, t.status::text AS status, t.created_at, t.updated_at
       FROM tasks t
       INNER JOIN heroes h ON h.id = t.hero_id
       WHERE t.id = $1
       FOR UPDATE`,
      [taskId],
    );

    const task = taskResult.rows[0];
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.hero_user_id !== userId) {
      throw new AppError("You are not assigned to this task", 403);
    }

    if (task.status !== "ASSIGNED") {
      throw new AppError(`Cannot accept task in '${task.status}' state`, 400);
    }

    const updated = await client.query<TaskRow>(
      `UPDATE tasks
       SET status = 'ACCEPTED'
       WHERE id = $1
       RETURNING id, signal_id, hero_id, status::text, created_at, updated_at`,
      [taskId],
    );

    await client.query(`UPDATE signals SET status = 'ASSIGNED' WHERE id = $1`, [task.signal_id]);

    return mapTaskRow({ ...updated.rows[0], hero_user_id: userId });
  });
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  newStatus: HeroTaskStatus,
): Promise<HeroTask> {
  // Normalize COMPLETED to RESOLVED for DB compatibility if needed
  const dbStatus = newStatus === "COMPLETED" ? "RESOLVED" : newStatus;

  return withTransaction(async (client) => {
    const taskResult = await client.query<TaskRow>(
      `SELECT t.id, t.signal_id, t.hero_id, h.user_id AS hero_user_id, t.status::text AS status, t.created_at, t.updated_at
       FROM tasks t
       INNER JOIN heroes h ON h.id = t.hero_id
       WHERE t.id = $1
       FOR UPDATE`,
      [taskId],
    );

    const task = taskResult.rows[0];
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.hero_user_id !== userId) {
      throw new AppError("You are not authorized to update this task", 403);
    }

    const allowedNext = VALID_TRANSITIONS[task.status] || [];
    if (!allowedNext.includes(newStatus) && !allowedNext.includes(dbStatus)) {
      throw new AppError(
        `Invalid status transition from '${task.status}' to '${newStatus}'. Allowed: ${allowedNext.join(", ") || "none"}`,
        400,
      );
    }

    const updated = await client.query<TaskRow>(
      `UPDATE tasks
       SET status = $1::hero_task_status
       WHERE id = $2
       RETURNING id, signal_id, hero_id, status::text, created_at, updated_at`,
      [dbStatus, taskId],
    );

    // Sync signal status
    if (dbStatus === "RESPONDING") {
      await client.query(`UPDATE signals SET status = 'RESPONDING' WHERE id = $1`, [task.signal_id]);
    } else if (dbStatus === "RESOLVED") {
      await client.query(`UPDATE signals SET status = 'RESOLVED' WHERE id = $1`, [task.signal_id]);

      // Release locked stake to reporter and reward hero
      const signal = await client.query<{ reporter_id: string }>(
        `SELECT reporter_id FROM signals WHERE id = $1`,
        [task.signal_id],
      );
      if (signal.rows[0]) {
        // Release reporter stake back to available
        await client.query(
          `UPDATE credit_wallets
           SET available_credits = available_credits + 10,
               locked_credits = GREATEST(locked_credits - 10, 0)
           WHERE user_id = $1`,
          [signal.rows[0].reporter_id],
        );

        await client.query(
          `INSERT INTO credit_transactions (user_id, signal_id, amount, type)
           VALUES ($1, $2, 10, 'RELEASE')`,
          [signal.rows[0].reporter_id, task.signal_id],
        );
      }

      // Reward hero with 15 credits
      await client.query(
        `UPDATE credit_wallets
         SET available_credits = available_credits + 15
         WHERE user_id = $1`,
        [userId],
      );

      await client.query(
        `INSERT INTO credit_transactions (user_id, signal_id, amount, type)
         VALUES ($1, $2, 15, 'REWARD')`,
        [userId, task.signal_id],
      );
    }

    return mapTaskRow({ ...updated.rows[0], hero_user_id: userId });
  });
}
