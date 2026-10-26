import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "@/lib/env";

const uri = env.MONGODB_URI;

const g = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoPromise?: Promise<MongoClient>;
};

export async function getClient(): Promise<MongoClient> {
  if (!g._mongoClient) {
    g._mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
    });
  }
  if (!g._mongoPromise) {
    g._mongoPromise = g._mongoClient.connect().catch((err) => {
      delete g._mongoPromise;
      throw err;
    });
  }
  return g._mongoPromise;
}

export const clientPromise: Promise<MongoClient> = (async () => {
  return await getClient();
})();

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db("hellomd");
}
