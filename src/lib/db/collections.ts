import "server-only";
import { Collection, Document } from "mongodb";
import { z } from "zod";
import { getDb } from "./mongo";

// --- Document Types & Schemas ---

export const UserSchema = z.object({
  githubId: z.string(),
  login: z.string(),
  avatarUrl: z.string().url(),
  encToken: z.string(),
  createdAt: z.date(),
});
export type UserDoc = z.infer<typeof UserSchema>;

export const SectionItemSchema = z.object({
  key: z.enum(["intro", "about", "skills", "projects", "contact"]),
  markdown: z.string(),
  source: z.enum(["ai", "user"]),
  enabled: z.boolean(),
  order: z.number().int(),
});
export type SectionItem = z.infer<typeof SectionItemSchema>;

export const ReadmeSchema = z.object({
  ownerId: z.string(),
  login: z.string(),
  tone: z.enum(["professional", "playful", "minimal", "hacker"]),
  theme: z.string(),
  sections: z.array(SectionItemSchema),
  promptVersion: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ReadmeDoc = z.infer<typeof ReadmeSchema>;

export const GithubFactsSchema = z.object({
  login: z.string(),
  facts: z.record(z.string(), z.any()),
  fetchedAt: z.date(),
});
export type GithubFactsDoc = z.infer<typeof GithubFactsSchema>;

export const LlmCacheSchema = z.object({
  key: z.string(),
  output: z.any(),
  provider: z.enum(["groq", "gemini"]),
  model: z.string(),
  createdAt: z.date(),
});
export type LlmCacheDoc = z.infer<typeof LlmCacheSchema>;

export const UsageSchema = z.object({
  subjectId: z.string(),
  day: z.string(), // YYYY-MM-DD UTC
  generations: z.number(),
  estTokens: z.number(),
  createdAt: z.date(),
});
export type UsageDoc = z.infer<typeof UsageSchema>;

export const ProviderStateSchema = z.object({
  provider: z.string(),
  model: z.string(),
  cooldownUntil: z.date(),
  updatedAt: z.date(),
});
export type ProviderStateDoc = z.infer<typeof ProviderStateSchema>;

export const TemplateSchema = z.object({
  name: z.string(),
  theme: z.string(),
  sectionOrder: z.array(z.string()),
  badgeStyle: z.string(),
  previewMarkdown: z.string(),
  isPublic: z.boolean(),
});
export type TemplateDoc = z.infer<typeof TemplateSchema>;

// --- Collection Accessors ---

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export const getUsersCollection = () => getCollection<UserDoc>("users");
export const getGithubFactsCollection = () => getCollection<GithubFactsDoc>("githubFacts");
export const getReadmesCollection = () => getCollection<ReadmeDoc>("readmes");
export const getLlmCacheCollection = () => getCollection<LlmCacheDoc>("llmCache");
export const getUsageCollection = () => getCollection<UsageDoc>("usage");
export const getProviderStateCollection = () => getCollection<ProviderStateDoc>("providerState");
export const getTemplatesCollection = () => getCollection<TemplateDoc>("templates");
