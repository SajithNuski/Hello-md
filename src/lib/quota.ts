import { APP_CONFIG } from "./config";
import { getUsageCollection } from "./db/collections";

export const DAILY_GENERATIONS = APP_CONFIG.dailyGenerationsLimit; // 3
export const SECTION_REGEN_COST = APP_CONFIG.sectionRegenCost; // 0.25

export interface QuotaStatus {
  used: number;
  remaining: number;
  limit: number;
  resetsAt: string;
  resetTimeFormatted: string;
  secondsUntilReset: number;
}

export interface QuotaCheckResult extends QuotaStatus {
  allowed: boolean;
}

// In-memory fallback map for offline MongoDB / local dev / CLI tests
const globalForQuota = globalThis as unknown as {
  _memoryUsage?: Map<string, { generations: number; estTokens: number; createdAt: Date }>;
};

export const memoryUsage = (globalForQuota._memoryUsage ??= new Map<
  string,
  { generations: number; estTokens: number; createdAt: Date }
>());

/**
 * Reset memory quota store (used primarily in automated tests)
 */
export function resetMemoryQuota(): void {
  memoryUsage.clear();
}

/**
 * Returns the current date in UTC as "YYYY-MM-DD"
 */
export function getUtcDay(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Calculates next 00:00:00 UTC reset time and human-readable countdown
 */
export function getResetsAt(date: Date = new Date()): {
  resetsAt: string;
  resetTimeFormatted: string;
  secondsUntilReset: number;
} {
  const tomorrow = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0)
  );
  const secondsUntilReset = Math.max(0, Math.floor((tomorrow.getTime() - date.getTime()) / 1000));
  const hours = Math.floor(secondsUntilReset / 3600);
  const minutes = Math.floor((secondsUntilReset % 3600) / 60);

  return {
    resetsAt: tomorrow.toISOString(),
    resetTimeFormatted: `${hours}h ${minutes}m`,
    secondsUntilReset,
  };
}

/**
 * Fetch current usage for a subject for today (UTC)
 */
export async function getUsage(subjectId: string, customDate: Date = new Date()): Promise<QuotaStatus> {
  const day = getUtcDay(customDate);
  const memKey = `${subjectId}:${day}`;
  const resetInfo = getResetsAt(customDate);

  let used = 0;

  try {
    const col = await getUsageCollection();
    const doc = await col.findOne({ subjectId, day });
    if (doc) {
      used = doc.generations;
    } else if (memoryUsage.has(memKey)) {
      used = memoryUsage.get(memKey)!.generations;
    }
  } catch {
    // If DB unavailable, fallback to in-memory store
    if (memoryUsage.has(memKey)) {
      used = memoryUsage.get(memKey)!.generations;
    }
  }

  const roundedUsed = Number(used.toFixed(2));
  const remaining = Math.max(0, Number((DAILY_GENERATIONS - roundedUsed).toFixed(2)));

  return {
    used: roundedUsed,
    remaining,
    limit: DAILY_GENERATIONS,
    resetsAt: resetInfo.resetsAt,
    resetTimeFormatted: resetInfo.resetTimeFormatted,
    secondsUntilReset: resetInfo.secondsUntilReset,
  };
}

/**
 * Check if the subject has enough quota to perform an action of given cost
 */
export async function checkQuota(
  subjectId: string,
  cost: number = 1.0,
  customDate: Date = new Date()
): Promise<QuotaCheckResult> {
  const usage = await getUsage(subjectId, customDate);
  const allowed = (usage.remaining + 1e-6) >= cost;

  return {
    ...usage,
    allowed,
  };
}

/**
 * Atomically consume quota for a subject
 */
export async function consumeQuota(
  subjectId: string,
  cost: number = 1.0,
  estTokens: number = 2500,
  customDate: Date = new Date()
): Promise<QuotaStatus> {
  const day = getUtcDay(customDate);
  const memKey = `${subjectId}:${day}`;

  // Always update in-memory mirror
  const currentMem = memoryUsage.get(memKey) || {
    generations: 0,
    estTokens: 0,
    createdAt: customDate,
  };
  currentMem.generations += cost;
  currentMem.estTokens += estTokens;
  memoryUsage.set(memKey, currentMem);

  try {
    const col = await getUsageCollection();
    await col.updateOne(
      { subjectId, day },
      {
        $inc: { generations: cost, estTokens },
        $setOnInsert: { createdAt: customDate },
      },
      { upsert: true }
    );
  } catch (err: unknown) {
    console.warn("Could not record usage to MongoDB, using memory store:", (err as Error).message);
  }

  return getUsage(subjectId, customDate);
}
