import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required. Copy backend/.env.example to backend/.env and paste your Supabase URI."),
  DATABASE_SSL: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  CORS_ORIGIN: z.string().optional().default(""),
  SUPABASE_URL: z
    .string()
    .url()
    .default("https://rbawqxsznvfoodpbdulh.supabase.co"),
  SUPABASE_ANON_KEY: z
    .string()
    .default(
      process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder",
    ),
  JWT_SECRET: z.string().optional().default(""),
  DUPLICATE_WINDOW_MINUTES: z.coerce.number().int().positive().default(10),
  DUPLICATE_RADIUS_METERS: z.coerce.number().int().positive().default(100),
  SIGNAL_STAKE_AMOUNT: z.coerce.number().positive().default(10),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.preprocess(
    (value) => (value === "" || value === undefined ? 587 : value),
    z.coerce.number().int().positive(),
  ),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  SMTP_FROM: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsed.data;
export type Env = typeof env;
