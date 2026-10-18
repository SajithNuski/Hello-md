import { LLMProvider, LLMResult, AIError, RouterRequest } from "./types";
import { GroqProvider } from "./providers/groq";
import { GeminiProvider } from "./providers/gemini";
import { getCachedLLMOutput, setCachedLLMOutput } from "./cache";
import { getProviderStateCollection } from "@/lib/db/collections";
import { env } from "@/lib/env";

interface PoolEntry {
  provider: "groq" | "gemini";
  model: string;
  createInstance: () => LLMProvider;
}

/**
 * Check if a provider model is currently in cooldown in MongoDB
 */
async function isEntryInCooldown(provider: string, model: string): Promise<boolean> {
  try {
    const col = await getProviderStateCollection();
    const state = await col.findOne({ provider, model });
    if (state && state.cooldownUntil > new Date()) {
      return true;
    }
    return false;
  } catch {
    // If DB unavailable, assume not cooling down
    return false;
  }
}

/**
 * Record cooldown in providerState collection
 */
async function setEntryCooldown(
  provider: string,
  model: string,
  cooldownSeconds: number
): Promise<void> {
  try {
    const col = await getProviderStateCollection();
    const cooldownUntil = new Date(Date.now() + cooldownSeconds * 1000);
    await col.updateOne(
      { provider, model },
      {
        $set: {
          provider,
          model,
          cooldownUntil,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (err: unknown) {
    console.warn("Could not save cooldown state to MongoDB:", (err as Error).message);
  }
}

/**
 * Get earliest cooldown expiration across all cooling entries
 */
async function getEarliestCooldownSeconds(): Promise<number> {
  try {
    const col = await getProviderStateCollection();
    const now = new Date();
    const coolingDocs = await col.find({ cooldownUntil: { $gt: now } }).toArray();

    if (coolingDocs.length === 0) return 30;

    const earliestTime = Math.min(...coolingDocs.map((d) => d.cooldownUntil.getTime()));
    const remainingSeconds = Math.max(1, Math.ceil((earliestTime - now.getTime()) / 1000));
    return remainingSeconds;
  } catch {
    return 30;
  }
}

/**
 * Build the prioritized pool: Groq models first, then Gemini
 */
function buildProviderPool(): PoolEntry[] {
  const pool: PoolEntry[] = [];

  // 1. Groq models
  const groqKey = process.env.GROQ_API_KEY || env.GROQ_API_KEY;
  if (groqKey) {
    const groqModels = (process.env.GROQ_MODELS || env.GROQ_MODELS)
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    for (const model of groqModels) {
      pool.push({
        provider: "groq",
        model,
        createInstance: () => new GroqProvider(model, groqKey),
      });
    }
  }

  // 2. Gemini fallback
  const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  if (geminiKey) {
    const geminiModel = process.env.GEMINI_MODEL || env.GEMINI_MODEL || "gemini-1.5-flash";
    pool.push({
      provider: "gemini",
      model: geminiModel,
      createInstance: () => new GeminiProvider(geminiModel, geminiKey),
    });
  }

  return pool;
}

/**
 * Execute an LLM call via the multi-provider router
 */
export async function routeLLMRequest(req: RouterRequest): Promise<LLMResult> {
  const timeoutMs = env.AI_TIMEOUT_MS || 20000;
  const temperature = req.temperature ?? 0.4;
  const maxOutputTokens = req.maxOutputTokens ?? 2500;

  // 1. Check Cache if cacheKey is supplied
  if (req.cacheKey) {
    const cached = await getCachedLLMOutput(req.cacheKey);
    if (cached) {
      return {
        text: cached,
        provider: "cache",
        model: "llmCache",
        cached: true,
      };
    }
  }

  // 2. Handle BYOK (Bring-your-own-key)
  if (req.byok) {
    const { provider, apiKey, model } = req.byok;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const instance =
        provider === "groq"
          ? new GroqProvider(model || "llama-3.3-70b-versatile", apiKey)
          : new GeminiProvider(model || "gemini-1.5-flash", apiKey);

      const result = await instance.generateJson({
        system: req.system,
        user: req.user,
        maxOutputTokens,
        temperature,
        signal: controller.signal,
      });

      return {
        text: result.text,
        provider,
        model: instance.model,
        cached: false,
        usage: result.usage,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  // 3. Shared Pool Routing with Cooldowns and Automatic Fallback
  const pool = buildProviderPool();
  if (pool.length === 0) {
    throw new AIError(
      "No AI providers configured. Please set GROQ_API_KEY or GEMINI_API_KEY in your environment.",
      "AUTH_ERROR",
      { status: 503 }
    );
  }

  const errors: Error[] = [];

  for (const entry of pool) {
    // Check if this model is in cooldown
    if (await isEntryInCooldown(entry.provider, entry.model)) {
      continue;
    }

    let attempts = 0;
    const maxAttemptsForEntry = 2; // Retry 5xx, timeout or invalid JSON once

    while (attempts < maxAttemptsForEntry) {
      attempts++;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const instance = entry.createInstance();
        const output = await instance.generateJson({
          system: req.system,
          user: req.user,
          maxOutputTokens,
          temperature,
          signal: controller.signal,
        });

        // Save to cache if key provided
        if (req.cacheKey) {
          await setCachedLLMOutput({
            key: req.cacheKey,
            output: output.text,
            provider: entry.provider,
            model: entry.model,
          });
        }

        return {
          text: output.text,
          provider: entry.provider,
          model: entry.model,
          cached: false,
          usage: output.usage,
        };
      } catch (err: unknown) {
        const aiErr = err as AIError;

        // If rate limit (429), trigger cooldown and immediately advance to next entry
        if (aiErr.code === "RATE_LIMIT") {
          const cooldown = aiErr.retryAfter || 60;
          await setEntryCooldown(entry.provider, entry.model, cooldown);
          errors.push(aiErr);
          break; // Next entry in pool
        }

        // If auth error (invalid key), do not retry this entry
        if (aiErr.code === "AUTH_ERROR") {
          errors.push(aiErr);
          break;
        }

        // For timeouts, 5xx, or invalid output: retry once
        if (attempts >= maxAttemptsForEntry) {
          errors.push(aiErr);
        }
      } finally {
        clearTimeout(timer);
      }
    }
  }

  // If every entry in the pool failed or was in cooldown:
  const retryAfter = await getEarliestCooldownSeconds();
  throw new AIError(
    `All AI models are currently busy or cooling down. Please retry in ${retryAfter}s.`,
    "AI_BUSY",
    {
      status: 503,
      retryAfter,
    }
  );
}
