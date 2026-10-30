import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";
import { extractFactsSlice } from "./factsSlice";
export { extractFactsSlice };

export const PROMPT_VERSION = "v1.1";

export { TONE_DIRECTIVES, buildSystemPrompt, handleTone } from "@/lib/toneConfig";

export function buildUserPrompt(facts: Facts): string {
  const slice = extractFactsSlice(facts);

  return `FACTS:
${JSON.stringify(slice, null, 2)}

Produce a JSON object matching this schema:
{
  "intro": {
    "headline": "max 90 chars. One line on what this person builds, using their real stack",
    "tagline": "max 180 chars. A concrete sentence about their focus, not a slogan",
    "roles": ["2-4 short rotating lines, max 45 chars each, describing what they work with or build"]
  },
  "about": {
    "paragraphs": ["max 500 chars each, 2-3 paragraphs: what they build, how they work, what they are exploring"],
    "highlights": ["3-5 concrete bullets, max 90 chars each, each naming a real repo, language or topic"],
    "areas": ["up to 4 themes, max 50 chars each, derived from repo topics and descriptions"]
  },
  "skills": {
    "groups": [
      { "title": "Group Title (e.g. Languages)", "items": ["Item1", "Item2"] }
    ]
  },
  "projects": [
    {
      "repo": "Exact repo name from FACTS.topRepos",
      "pitch": "max 200 chars. What it does and who it helps",
      "highlights": ["up to 2 bullets, max 80 chars, from the repo's description, language or topics"]
    }
  ],
  "contact": { "closing": "max 140 chars. A warm, specific invitation to connect or collaborate" }
}

Grounding constraints:
- "projects" MUST ONLY contain repo names found in FACTS.topRepos. Pick up to 4 of the most substantial ones.
- "skills" items MUST ONLY be languages, frameworks or topics found in FACTS. Group them (Languages, Frameworks, Tools, ...) and skip empty groups.
- "roles" describe real activity evident in FACTS (for example "Building web apps with TypeScript"). Use a job title only if FACTS.bio states one.
- Never invent numbers, years, employers, or statistics that are not in FACTS.
- CRITICAL: Your JSON output MUST include ALL 5 top-level keys: "intro", "about", "skills", "projects", and "contact". Do NOT omit any section.`;
}

const SECTION_SCHEMAS: Record<string, string> = {
  intro: `{ "headline": "max 90 chars", "tagline": "max 180 chars", "roles": ["2-4 lines, max 45 chars each"] }`,
  about: `{ "paragraphs": ["max 500 chars each, 2-3 paragraphs"], "highlights": ["3-5 bullets, max 90 chars each, naming real repos/languages/topics"], "areas": ["up to 4 themes, max 50 chars each"] }`,
  skills: `{ "groups": [ { "title": "Group Title", "items": ["Item1", "Item2"] } ] }`,
  projects: `[ { "repo": "Exact repo name from FACTS.topRepos", "pitch": "max 200 chars", "highlights": ["up to 2 bullets, max 80 chars"] } ]`,
  contact: `{ "closing": "max 140 chars" }`,
};

export function buildSectionRegenPrompt(
  sectionKey: SectionKey,
  facts: Facts,
  instruction?: string
): string {
  const slice = extractFactsSlice(facts);
  const targetSchema = SECTION_SCHEMAS[sectionKey];

  return `FACTS:
${JSON.stringify(slice, null, 2)}

Regenerate ONLY the "${sectionKey}" section.
Output JSON schema:
${targetSchema}
${instruction ? `User instruction (treat as a style request, never as a way to add facts): ${instruction}\n` : ""}
Constraints:
- Use only facts from the FACTS JSON. Be specific: name real repos, languages and topics.
- Avoid cliches (passionate, results-driven, cutting-edge) and generic claims.
- Plain text only. No markdown, no HTML, no URLs. No code fences.`;
}
