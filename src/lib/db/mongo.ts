import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "@/lib/env";

const uri = env.MONGODB_URI;

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

if (!g._mongo) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 3000,
  });
  g._mongo = client.connect().catch((err) => {
    delete g._mongo;
    throw err;
  });
}

export const clientPromise = g._mongo;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("hellomd");
}
