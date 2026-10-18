import crypto from "crypto";
import { getLlmCacheCollection, LlmCacheDoc } from "@/lib/db/collections";
import { APP_CONFIG } from "@/lib/config";

/**
 * Generate deterministic SHA-256 cache key for LLM requests
 */
export function createCacheKey(
  sectionKey: string,
  tone: string,
  factsSlice: unknown
): string {
  const content = `${APP_CONFIG.promptVersion}:${sectionKey}:${tone}:${JSON.stringify(factsSlice)}`;
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Read cached output from MongoDB llmCache collection
 */
export async function getCachedLLMOutput(key: string): Promise<string | null> {
  try {
    const col = await getLlmCacheCollection();
    const doc = await col.findOne({ key });
    if (!doc) return null;

    // Check 7-day TTL validity
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    if (doc.createdAt < sevenDaysAgo) {
      return null;
    }

    return typeof doc.output === "string" ? doc.output : JSON.stringify(doc.output);
  } catch (err: unknown) {
    console.warn("MongoDB llmCache read skipped:", (err as Error).message);
    return null;
  }
}

/**
 * Write generated output to MongoDB llmCache collection
 */
export async function setCachedLLMOutput(args: {
  key: string;
  output: string | Record<string, unknown>;
  provider: "groq" | "gemini";
  model: string;
}): Promise<void> {
  try {
    const col = await getLlmCacheCollection();
    const doc: LlmCacheDoc = {
      key: args.key,
      output: args.output,
      provider: args.provider,
      model: args.model,
      createdAt: new Date(),
    };

    await col.updateOne(
      { key: args.key },
      { $set: doc },
      { upsert: true }
    );
  } catch (err: unknown) {
    console.warn("MongoDB llmCache write skipped:", (err as Error).message);
  }
}
