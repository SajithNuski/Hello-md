import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required").default("mongodb://localhost:27017/hellomd"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required").default("development_secret_minimum_32_characters_long_for_auth"),
  GITHUB_ID: z.string().optional().default(""),
  GITHUB_SECRET: z.string().optional().default(""),
  GITHUB_SERVER_TOKEN: z.string().optional().default(""),
  TOKEN_ENC_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),
  GROQ_MODELS: z.string().default("openai/gpt-oss-120b,openai/gpt-oss-20b,qwen/qwen3.8-27b"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-3.8-flash"),
  DAILY_GENERATIONS: z.coerce.number().default(3),
  AI_TIMEOUT_MS: z.coerce.number().default(20000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
