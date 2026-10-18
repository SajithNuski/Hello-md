import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getReadmesCollection, SectionItem } from "@/lib/db/collections";
import { fetchFacts } from "@/lib/github/fetchFacts";
import { buildSectionRegenPrompt, buildSystemPrompt } from "@/lib/ai/prompt";
import { routeLLMRequest } from "@/lib/ai/router";
import { validateSingleSection } from "@/lib/ai/validate";
import { formatSection } from "@/lib/assemble/formatSection";
import { SectionKey, SECTION_KEYS, TONES, Tone } from "@/lib/config";
import { AIError } from "@/lib/ai/types";

export const runtime = "nodejs";

const RegenerateBodySchema = z.object({
  tone: z.enum(TONES).optional(),
  instruction: z.string().max(200).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; key: string } }
) {
  const { id, key } = params;

  if (!SECTION_KEYS.includes(key as SectionKey)) {
    return new Response(
      JSON.stringify({ error: { code: "INVALID_SECTION_KEY", message: `Invalid section key: ${key}` } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const sectionKey = key as SectionKey;

  let bodyJson: unknown = {};
  try {
    bodyJson = await req.json();
  } catch {
    // optional body
  }

  const parsed = RegenerateBodySchema.safeParse(bodyJson);
  const userTone = parsed.success ? parsed.data.tone : undefined;
  const instruction = parsed.success ? parsed.data.instruction : undefined;

  let doc: any = null;
  let col: any = null;
  let query: Record<string, unknown> = {};

  try {
    col = await getReadmesCollection();
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }
    doc = await col.findOne(query);
  } catch (err: unknown) {
    console.warn("MongoDB unavailable for regenerate:", (err as Error).message);
  }

  if (!doc) {
    const { memoryDrafts } = await import("@/lib/db/draftStore");
    doc = memoryDrafts.get(id);
  }

  if (!doc) {
    return new Response(
      JSON.stringify({ error: { code: "NOT_FOUND", message: "Draft not found" } }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const facts = await fetchFacts(doc.login);
    const activeTone: Tone = (userTone || doc.tone || "professional") as Tone;

    const systemPrompt = buildSystemPrompt(activeTone);
    const userPrompt = buildSectionRegenPrompt(sectionKey, facts, instruction);

    const temperature = sectionKey === "intro" || sectionKey === "about" ? 0.8 : 0.4;
    const aiResult = await routeLLMRequest({
      system: systemPrompt,
      user: userPrompt,
      temperature,
      maxOutputTokens: 1000,
    });

    const validation = validateSingleSection(sectionKey, aiResult.text, facts);
    if (!validation.success) {
      throw new AIError(
        `Section output failed validation: ${validation.error}`,
        "INVALID_AI_OUTPUT",
        { status: 502 }
      );
    }

    const newMarkdown = formatSection(sectionKey, validation.data, facts, doc.theme || "minimal");

    // Update section in document
    const updatedSections: SectionItem[] = doc.sections.map((s: SectionItem) => {
      if (s.key === sectionKey) {
        return {
          ...s,
          markdown: newMarkdown,
          source: "ai",
        };
      }
      return s;
    });

    if (col && query) {
      try {
        await col.updateOne(
          query,
          {
            $set: {
              sections: updatedSections,
              updatedAt: new Date(),
            },
          }
        );
      } catch (err: unknown) {
        console.warn("Could not persist regenerated section to MongoDB:", (err as Error).message);
      }
    }

    const { memoryDrafts } = await import("@/lib/db/draftStore");
    memoryDrafts.set(id, {
      ...doc,
      sections: updatedSections,
      updatedAt: new Date(),
    });

    const updatedSection = updatedSections.find((s) => s.key === sectionKey);

    return new Response(
      JSON.stringify({ section: updatedSection }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    if (err instanceof AIError) {
      return new Response(
        JSON.stringify({
          error: { code: err.code, message: err.message, retryAfter: err.retryAfter },
        }),
        { status: err.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        error: { code: "INTERNAL_ERROR", message: (err as Error).message },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
