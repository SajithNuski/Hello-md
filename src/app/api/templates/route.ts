import { NextRequest, NextResponse } from "next/server";
import { PRESET_TEMPLATES, PresetTemplate, renderTemplateMarkdown } from "@/lib/templates/presetTemplates";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const persona = searchParams.get("persona")?.toLowerCase();
  const theme = searchParams.get("theme")?.toLowerCase();
  const search = searchParams.get("search")?.toLowerCase();

  // Always use the deterministic single-source-of-truth templates config
  let templates: PresetTemplate[] = PRESET_TEMPLATES.map((t) => ({
    ...t,
    previewMarkdown: renderTemplateMarkdown(t),
  }));

  // Apply filters if query params supplied
  if (persona && persona !== "all") {
    templates = templates.filter((t) => t.persona.toLowerCase() === persona);
  }

  if (theme && theme !== "all") {
    templates = templates.filter((t) => t.theme.toLowerCase() === theme);
  }

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
