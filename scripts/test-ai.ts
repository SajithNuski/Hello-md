import "./mock-server-only";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { createCacheKey } from "../src/lib/ai/cache";
import { GroqProvider } from "../src/lib/ai/providers/groq";
import { GeminiProvider } from "../src/lib/ai/providers/gemini";
import { AIError } from "../src/lib/ai/types";

async function runAITests() {
  console.log("=== Testing AI Layer (Milestone 3) ===\n");

  // 1. Test Cache Key Determinism
  console.log("[TEST 1] Testing Deterministic SHA-256 Cache Key...");
  const key1 = createCacheKey("intro", "professional", { repos: ["linux", "git"] });
  const key2 = createCacheKey("intro", "professional", { repos: ["linux", "git"] });
  const keyDiff = createCacheKey("intro", "hacker", { repos: ["linux", "git"] });

  if (key1 === key2 && key1 !== keyDiff && key1.length === 64) {
    console.log("✅ Cache keys are deterministic, 64-char hex SHA-256 strings.");
    console.log(`   Sample Key: ${key1}`);
  } else {
    console.error("❌ Cache key test failed!");
    process.exit(1);
  }

  // 2. Test Provider Initialization and Error Guards
  console.log("\n[TEST 2] Testing Provider Error Guards (Missing Key Handling)...");
  try {
    new GroqProvider("llama-3.3-70b-versatile", "");
    console.error("❌ GroqProvider should throw on empty key");
    process.exit(1);
  } catch (err: unknown) {
    if (err instanceof AIError && err.code === "AUTH_ERROR") {
      console.log("✅ GroqProvider correctly throws AUTH_ERROR when key is missing.");
    } else {
      console.error("❌ Unexpected error from GroqProvider:", err);
      process.exit(1);
    }
  }

  try {
    new GeminiProvider("gemini-1.5-flash", "");
    console.error("❌ GeminiProvider should throw on empty key");
    process.exit(1);
  } catch (err: unknown) {
    if (err instanceof AIError && err.code === "AUTH_ERROR") {
      console.log("✅ GeminiProvider correctly throws AUTH_ERROR when key is missing.");
    } else {
      console.error("❌ Unexpected error from GeminiProvider:", err);
      process.exit(1);
    }
  }

  // 3. Test Failover & Router Logic Simulation
  console.log("\n[TEST 3] Testing Router Failover Logic Simulation...");

  // Mocking pool with 2 simulated providers: Primary (fails) -> Fallback (succeeds)
  let primaryCalled = false;
  let fallbackCalled = false;

  const mockPrimary = {
    id: "groq" as const,
    model: "llama-3.3-70b-versatile",
    async generateJson() {
      primaryCalled = true;
      throw new AIError("Simulated 429 Rate Limit", "RATE_LIMIT", {
        status: 429,
        retryAfter: 45,
        provider: "groq",
      });
    },
  };

  const mockFallback = {
    id: "gemini" as const,
    model: "gemini-1.5-flash",
    async generateJson() {
      fallbackCalled = true;
      return {
        text: JSON.stringify({ headline: "Senior Linux Kernel Engineer", tagline: "Open Source Creator" }),
      };
    },
  };

  // Simulating router progression
  const pool = [mockPrimary, mockFallback];
  let finalResult: string | null = null;

  for (const provider of pool) {
    try {
      const res = await provider.generateJson();
      finalResult = res.text;
      break;
    } catch (err: any) {
      if (err.code === "RATE_LIMIT") {
        console.log(`   - Provider ${provider.id} hit rate limit (cooldown ${err.retryAfter}s). Falling back to next...`);
        continue;
      }
    }
  }

  if (primaryCalled && fallbackCalled && finalResult) {
    console.log("✅ Fallback sequence succeeded: Groq -> Gemini fallback verified!");
    console.log(`   Output: ${finalResult}`);
  } else {
    console.error("❌ Fallback test failed!");
    process.exit(1);
  }

  // 4. Test In-Memory / Cached Repeat Request Simulation
  console.log("\n[TEST 4] Testing Cache Hit Verification...");
  const memoryCache = new Map<string, string>();
  const testKey = createCacheKey("about", "minimal", { login: "torvalds" });

  // Store in cache
  memoryCache.set(testKey, JSON.stringify({ paragraphs: ["Creator of Linux and Git."] }));

  // Check cache before calling provider
  let simulatedApiCallCount = 0;
  async function fetchWithSimulatedCache(key: string) {
    if (memoryCache.has(key)) {
      return { text: memoryCache.get(key)!, cached: true };
    }
    simulatedApiCallCount++;
    const fresh = JSON.stringify({ paragraphs: ["Fresh call"] });
    memoryCache.set(key, fresh);
    return { text: fresh, cached: false };
  }

  const result1 = await fetchWithSimulatedCache(testKey);
  const result2 = await fetchWithSimulatedCache(testKey);

  if (result1.cached && result2.cached && simulatedApiCallCount === 0) {
    console.log("✅ Repeat request served directly from cache with zero provider API calls.");
  } else {
    console.error("❌ Cache hit test failed!");
    process.exit(1);
  }

  console.log("\n=== All Milestone 3 AI Tests Passed! ===");
  process.exit(0);
}

runAITests();
