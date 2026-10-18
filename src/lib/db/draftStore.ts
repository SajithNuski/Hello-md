import { ReadmeDoc } from "./collections";

// In-memory draft store fallback for local development when MongoDB daemon is offline
const globalForDrafts = globalThis as unknown as {
  _memoryDrafts?: Map<string, ReadmeDoc & { _id?: string }>;
};

export const memoryDrafts = (globalForDrafts._memoryDrafts ??= new Map<string, ReadmeDoc & { _id?: string }>());
