import type { PoolClient } from "pg";
import { query } from "../config/db";
import type { CreditTransaction, CreditsResponse } from "../types";

type WalletRow = {
  user_id: string;
  available_credits: string | number;
  locked_credits: string | number;
};

type TransactionRow = {
  id: string;
  user_id: string;
  signal_id: string | null;
  amount: string | number;
  type: string;
  created_at: Date | string;
};

function toNumber(val: string | number): number {
  return typeof val === "number" ? val : Number(val);
}

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

export async function ensureWallet(userId: string, client?: PoolClient): Promise<WalletRow> {
  const runner = client ? client.query.bind(client) : query;

  const existing = await runner<WalletRow>(
    `SELECT user_id, available_credits, locked_credits
     FROM credit_wallets
     WHERE user_id = $1
     LIMIT 1`,
    [userId],
  );

  if (existing.rows[0]) {
    return existing.rows[0];
  }

  // Create demo wallet with 100 credits for new users
  const created = await runner<WalletRow>(
    `INSERT INTO credit_wallets (user_id, available_credits, locked_credits)
     VALUES ($1, 100.00, 0.00)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
     RETURNING user_id, available_credits, locked_credits`,
    [userId],
  );

  return created.rows[0] ?? { user_id: userId, available_credits: 100, locked_credits: 0 };
}

export async function getCredits(userId: string): Promise<CreditsResponse> {
  const wallet = await ensureWallet(userId);

  const available = toNumber(wallet.available_credits);
  const locked = toNumber(wallet.locked_credits);
  const total = Math.round((available + locked) * 100) / 100;

  const txResults = await query<TransactionRow>(
    `SELECT id, user_id, signal_id, amount, type, created_at
     FROM credit_transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId],
  );

  const transactions: CreditTransaction[] = txResults.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    signalId: row.signal_id,
    amount: toNumber(row.amount),
    type: row.type as CreditTransaction["type"],
    createdAt: toIso(row.created_at),
  }));

  return {
    balance: {
      available,
      locked,
      total,
    },
    transactions,
  };
}
