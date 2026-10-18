import {
  getUsersCollection,
  getGithubFactsCollection,
  getReadmesCollection,
  getLlmCacheCollection,
  getUsageCollection,
  getProviderStateCollection,
  getTemplatesCollection,
} from "./collections";

export async function ensureIndexes(): Promise<void> {
  const users = await getUsersCollection();
  await users.createIndex({ githubId: 1 }, { unique: true });

  const githubFacts = await getGithubFactsCollection();
  await githubFacts.createIndex({ login: 1 }, { unique: true });
  await githubFacts.createIndex({ fetchedAt: 1 }, { expireAfterSeconds: 3600 });

  const readmes = await getReadmesCollection();
  await readmes.createIndex({ ownerId: 1, updatedAt: -1 });

  const llmCache = await getLlmCacheCollection();
  await llmCache.createIndex({ key: 1 }, { unique: true });
  await llmCache.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });

  const usage = await getUsageCollection();
  await usage.createIndex({ subjectId: 1, day: 1 }, { unique: true });
  await usage.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 3600 });

  const providerState = await getProviderStateCollection();
  await providerState.createIndex({ provider: 1, model: 1 }, { unique: true });

  const templates = await getTemplatesCollection();
  await templates.createIndex({ isPublic: 1, name: 1 });
}
