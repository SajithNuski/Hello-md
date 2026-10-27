import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "@/lib/env";

const rawUri = env.MONGODB_URI;
// Normalize localhost to 127.0.0.1 on Windows to avoid IPv6 [::1] connection timeout hangs
const uri = rawUri.replace("://localhost:", "://127.0.0.1:");

const CIRCUIT_BREAKER_COOLDOWN_MS = 30000; // 30 seconds

const g = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoPromise?: Promise<MongoClient>;
  _lastMongoFailureTime?: number;
};

export async function getClient(): Promise<MongoClient> {
  const now = Date.now();
  if (
    g._lastMongoFailureTime &&
    now - g._lastMongoFailureTime < CIRCUIT_BREAKER_COOLDOWN_MS
  ) {
    throw new Error("MongoDB is offline (circuit breaker active)");
  }

  if (!g._mongoClient) {
    g._mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
      directConnection: uri.includes("127.0.0.1"),
    });
  }

  if (!g._mongoPromise) {
    g._mongoPromise = g._mongoClient.connect().catch((err) => {
      g._lastMongoFailureTime = Date.now();
      delete g._mongoPromise;
      delete g._mongoClient;
      throw err;
    });
  }

  return g._mongoPromise;
}

export const clientPromise: Promise<MongoClient> = {
  then(...args: Parameters<Promise<MongoClient>["then"]>) {
    return getClient().then(...args);
  },
  catch(...args: Parameters<Promise<MongoClient>["catch"]>) {
    return getClient().catch(...args);
  },
  finally(...args: Parameters<Promise<MongoClient>["finally"]>) {
    return getClient().finally(...args);
  },
  [Symbol.toStringTag]: "Promise",
} as unknown as Promise<MongoClient>;

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db("hellomd");
}

