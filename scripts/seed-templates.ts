import "./mock-server-only";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { MongoClient } from "mongodb";
import { PRESET_TEMPLATES } from "../src/lib/templates/presetTemplates";

export async function seedTemplates() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hellomd";
  console.log("Connecting to MongoDB to seed public templates...");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });

  try {
    await client.connect();
    const db = client.db("hellomd");
    const templatesCol = db.collection("templates");

    console.log(`Ensuring index on { slug: 1 }...`);
    await templatesCol.createIndex({ slug: 1 }, { unique: true });
    await templatesCol.createIndex({ isPublic: 1, name: 1 });

    console.log(`Seeding ${PRESET_TEMPLATES.length} preset developer templates...`);

    let upsertedCount = 0;
    for (const t of PRESET_TEMPLATES) {
      const doc = {
        name: t.name,
        slug: t.slug,
        role: t.role,
        tagline: t.tagline,
        persona: t.persona,
        theme: t.theme,
        accentColor: t.accentColor,
        sectionOrder: t.sectionOrder,
        badgeStyle: t.badgeStyle,
        previewMarkdown: t.previewMarkdown,
        isPublic: t.isPublic,
        tags: t.tags,
        updatedAt: new Date(),
      };

      const res = await templatesCol.updateOne(
        { slug: t.slug },
        {
          $set: doc,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      if (res.upsertedCount > 0 || res.modifiedCount > 0 || res.matchedCount > 0) {
        upsertedCount++;
        console.log(`  ✓ [${t.role}] ${t.name} (${t.theme} theme)`);
      }
    }

    console.log(`\n🎉 Successfully seeded ${upsertedCount} templates into MongoDB 'templates' collection!\n`);
  } catch (err: unknown) {
    console.warn(
      `⚠️ Note: MongoDB offline or unreachable (${(err as Error).message}). In-memory preset templates will be used.`
    );
  } finally {
    await client.close().catch(() => {});
  }
}

if (require.main === module) {
  seedTemplates().then(() => process.exit(0));
}
