import fs from "fs";
import path from "path";
import { ReadmeDoc } from "./collections";

// In-memory draft store fallback for local development when MongoDB daemon is offline
const globalForDrafts = globalThis as unknown as {
  _memoryDrafts?: Map<string, ReadmeDoc & { _id?: string }>;
};

const CACHE_FILE = path.join(process.cwd(), ".drafts_cache.json");

function loadInitialDrafts(): Map<string, ReadmeDoc & { _id?: string }> {
  const map = new Map<string, ReadmeDoc & { _id?: string }>();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        for (const [k, v] of data) {
          if (v && typeof v === "object") {
            // Restore Date instances
            if (v.createdAt) v.createdAt = new Date(v.createdAt);
            if (v.updatedAt) v.updatedAt = new Date(v.updatedAt);
          }
          map.set(k, v);
        }
      }
    }
  } catch {
    // Ignore cache load failure
  }
  return map;
}

function saveDraftsToFile(map: Map<string, ReadmeDoc & { _id?: string }>) {
  try {
    const entries = Array.from(map.entries());
    fs.writeFileSync(CACHE_FILE, JSON.stringify(entries), "utf-8");
  } catch {
    // Ignore cache save failure
  }
}

class PersistentDraftMap extends Map<string, ReadmeDoc & { _id?: string }> {
  override set(key: string, value: ReadmeDoc & { _id?: string }) {
    super.set(key, value);
    saveDraftsToFile(this);
    return this;
  }

  override delete(key: string) {
    const res = super.delete(key);
    saveDraftsToFile(this);
    return res;
  }

  override clear() {
    super.clear();
    saveDraftsToFile(this);
  }
}

export const memoryDrafts = (globalForDrafts._memoryDrafts ??= (() => {
  const initial = loadInitialDrafts();
  return new PersistentDraftMap(initial);
})());
