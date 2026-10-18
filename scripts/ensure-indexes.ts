import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hellomd";
  console.log("Connecting to MongoDB at:", uri.replace(/\/\/.*@/, "//***@"));
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("hellomd");
    console.log("Connected to MongoDB. Ensuring collections and indexes...");

    await db.collection("users").createIndex({ githubId: 1 }, { unique: true });
    console.log(" - users: { githubId: 1 } (unique)");

    await db.collection("githubFacts").createIndex({ login: 1 }, { unique: true });
    await db.collection("githubFacts").createIndex({ fetchedAt: 1 }, { expireAfterSeconds: 3600 });
    console.log(" - githubFacts: { login: 1 } (unique), { fetchedAt: 1 } (TTL 3600s)");

    await db.collection("readmes").createIndex({ ownerId: 1, updatedAt: -1 });
    console.log(" - readmes: { ownerId: 1, updatedAt: -1 }");

    await db.collection("llmCache").createIndex({ key: 1 }, { unique: true });
    await db.collection("llmCache").createIndex({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });
    console.log(" - llmCache: { key: 1 } (unique), { createdAt: 1 } (TTL 7 days)");

    await db.collection("usage").createIndex({ subjectId: 1, day: 1 }, { unique: true });
    await db.collection("usage").createIndex({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 3600 });
    console.log(" - usage: { subjectId: 1, day: 1 } (unique), { createdAt: 1 } (TTL 2 days)");

    await db.collection("providerState").createIndex({ provider: 1, model: 1 }, { unique: true });
    console.log(" - providerState: { provider: 1, model: 1 } (unique)");

    await db.collection("templates").createIndex({ isPublic: 1, name: 1 });
    console.log(" - templates: { isPublic: 1, name: 1 }");

    console.log("All indexes ensured successfully!");
  } catch (error) {
    console.error("Failed to ensure indexes:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
