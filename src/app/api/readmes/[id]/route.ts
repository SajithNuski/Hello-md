import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getReadmesCollection, SectionItemSchema } from "@/lib/db/collections";

export const runtime = "nodejs";

const PatchReadmeSchema = z.object({
  sections: z.array(SectionItemSchema).optional(),
  theme: z.string().optional(),
  tone: z.enum(["professional", "playful", "minimal", "hacker"]).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    if (ObjectId.isValid(id)) {
      const col = await getReadmesCollection();
      const doc = await col.findOne({ _id: new ObjectId(id) });
      if (doc) {
        return new Response(
          JSON.stringify({
            readme: {
              id: doc._id.toString(),
              login: doc.login,
              tone: doc.tone,
              theme: doc.theme,
              sections: doc.sections,
              updatedAt: doc.updatedAt,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  } catch (err: unknown) {
    console.warn("MongoDB read failed, checking in-memory drafts:", (err as Error).message);
  }

  // Check in-memory draft fallback
  const { memoryDrafts } = await import("@/lib/db/draftStore");
  const memDoc = memoryDrafts.get(id);
  if (memDoc) {
    return new Response(
      JSON.stringify({
        readme: {
          id: memDoc._id || id,
          login: memDoc.login,
          tone: memDoc.tone,
          theme: memDoc.theme,
          sections: memDoc.sections,
          updatedAt: memDoc.updatedAt,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: { code: "NOT_FOUND", message: "Draft not found" } }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let bodyJson: unknown;
  try {
    bodyJson = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: { code: "INVALID_JSON", message: "Invalid JSON body" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const parsed = PatchReadmeSchema.safeParse(bodyJson);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues.map((i) => i.message).join(", ") },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const updates: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (parsed.data.sections) {
    updates.sections = parsed.data.sections;
  }
  if (parsed.data.theme) {
    updates.theme = parsed.data.theme;
  }
  if (parsed.data.tone) {
    updates.tone = parsed.data.tone;
  }

  try {
    if (ObjectId.isValid(id)) {
      const col = await getReadmesCollection();
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );

      if (result) {
        return new Response(
          JSON.stringify({
            readme: {
              id: result._id.toString(),
              login: result.login,
              tone: result.tone,
              theme: result.theme,
              sections: result.sections,
              updatedAt: result.updatedAt,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  } catch (err: unknown) {
    console.warn("MongoDB update failed, updating in-memory drafts:", (err as Error).message);
  }

  // Update in memoryDrafts fallback
  const { memoryDrafts } = await import("@/lib/db/draftStore");
  const existing = memoryDrafts.get(id);
  if (existing) {
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    memoryDrafts.set(id, updated);
    return new Response(
      JSON.stringify({
        readme: {
          id: updated._id || id,
          login: updated.login,
          tone: updated.tone,
          theme: updated.theme,
          sections: updated.sections,
          updatedAt: updated.updatedAt,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: { code: "NOT_FOUND", message: "Draft not found" } }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}
