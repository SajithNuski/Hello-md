import { NextRequest, NextResponse } from "next/server";
import { getTemplatesCollection, TemplateDoc } from "@/lib/db/collections";
import { PRESET_TEMPLATES, PresetTemplate } from "@/lib/templates/presetTemplates";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const persona = searchParams.get("persona")?.toLowerCase();
  const theme = searchParams.get("theme")?.toLowerCase();
  const search = searchParams.get("search")?.toLowerCase();

  let templates: (TemplateDoc | PresetTemplate)[] = [];

  try {
    const col = await getTemplatesCollection();
    const filter: Record<string, unknown> = { isPublic: true };

    if (persona && persona !== "all") {
      filter.persona = persona;
    }
    if (theme && theme !== "all") {
      filter.theme = theme;
    }

    const docs = await col.find(filter).toArray();
    if (docs && docs.length > 0) {
      templates = docs;
    }
  } catch (err: unknown) {
    console.warn("MongoDB unavailable for templates, using presets:", (err as Error).message);
  }

  // Fallback to preset templates if MongoDB was offline or empty
  if (templates.length === 0) {
    templates = PRESET_TEMPLATES.filter((t) => {
      if (persona && persona !== "all" && t.persona !== persona) {
        return false;
      }
      if (theme && theme !== "all" && t.theme !== theme) {
        return false;
      }
      return true;
    });
  }

  // Text search filter if provided
  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    templates = templates.filter((t) => {
      const nameMatch = t.name.toLowerCase().includes(query);
      const roleMatch = (t.role || "").toLowerCase().includes(query);
      const taglineMatch = (t.tagline || "").toLowerCase().includes(query);
      const tagMatch = (t.tags || []).some((tag) => tag.toLowerCase().includes(query));
      return nameMatch || roleMatch || taglineMatch || tagMatch;
    });
  }

  return NextResponse.json({
    templates,
    total: templates.length,
  });
}
