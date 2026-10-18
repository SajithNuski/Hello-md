import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "@/lib/env";

const uri = env.MONGODB_URI;

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

if (!g._mongo) {
  const client = new MongoClient(uri);
  g._mongo = client.connect();
}

export const clientPromise = g._mongo;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("hellomd");
}
