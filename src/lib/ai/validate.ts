import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";
import {
  SectionsSchema,
  SectionsOutput,
  IntroSectionSchema,
  IntroSection,
  AboutSectionSchema,
  AboutSection,
  SkillsSectionSchema,
  SkillsSection,
  ProjectsSectionSchema,
  ProjectsSection,
  ContactSectionSchema,
  ContactSection,
} from "./schema";

/** Final field limits. The zod schema is looser; we clamp here. */
export const LIMITS = {
  headline: 90,
  tagline: 180,
  role: 45,
  paragraph: 500,
  highlight: 90,
  area: 50,
  groupTitle: 40,
  pitch: 200,
  projectHighlight: 80,
  closing: 140,
} as const;

type Repo = Facts["topRepos"][number];

/**
 * Remove markdown/HTML syntax and links, returning clean plain text.
 * Keeps "C#", "my_repo" and "Node.js" intact (the old version stripped # and _).
 */
export function stripMarkdown(text: string): string {
  if (!text) return "";
  return (
    text
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "") // script/style blocks incl. contents
      .replace(/<[^>]*>/g, "") // remaining HTML tags
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
      .replace(/(?:https?:\/\/|www\.)[^\s)]+/gi, "") // raw URLs
      .replace(/```+/g, "")
      .replace(/[*`~]/g, "")
      // _emphasis_ only when wrapped around a word, so snake_case survives
      .replace(/(^|\s)_+([^_\s][^_]*?)_+(?=\s|[.,;:!?]|$)/g, "$1$2")
      .replace(/^#+\s*/gm, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Extract all legitimate numbers present in Facts.
 * Change from before: pushedAt contributes only its YEAR. Adding the month and
 * day let invented numbers like "10 years" pass whenever a repo was pushed on
 * the 10th.
 */
export function extractAllowedNumbers(facts: Facts): Set<string> {
  const allowed = new Set<string>();
  const add = (n: number | string | null | undefined) => {
    if (n === null || n === undefined) return;
    allowed.add(String(n));
  };
  const addFrom = (s: string | null | undefined) => {
    s?.match(/\d+/g)?.forEach((m) => allowed.add(m));
  };

  add(facts.followers);
  add(facts.contributions.commits);
  add(facts.contributions.pullRequests);
  add(facts.topRepos.length);
  add(facts.topLanguages.length);

  addFrom(facts.bio);
  addFrom(facts.name);
  addFrom(facts.websiteUrl);
  addFrom(facts.location);

  for (const lang of facts.topLanguages) {
    add(Math.round(lang.percent));
    add(Math.floor(lang.percent));
    addFrom(lang.name);
  }

  for (const repo of facts.topRepos) {
    add(repo.stars);
    addFrom(repo.name);
    addFrom(repo.description);
    repo.topics.forEach(addFrom);
    const year = repo.pushedAt?.slice(0, 4);
    if (year && /^\d{4}$/.test(year)) add(year);
  }

  return allowed;
}

const NUMBER_RE = /\b\d[\d,]*\b/g;

export function hasUngroundedNumber(text: string, allowed: Set<string>): boolean {
  const found = text.match(NUMBER_RE);
  if (!found) return false;
  return found.some((n) => !allowed.has(n) && !allowed.has(n.replace(/,/g, "")));
}

/**
 * Kept for compatibility. Blanks ungrounded numbers.
 * Prefer cleanProse/cleanLine, which drop the whole sentence/line instead,
 * because blanking leaves broken text like "Over  years of experience".
 */
export function sanitizeUngroundedNumbers(text: string, allowedNumbers: Set<string>): string {
  if (!text) return "";
  return text
    .replace(/\b\d+\b/g, (num) => (allowedNumbers.has(num) ? num : ""))
    .replace(/\s+/g, " ")
    .trim();
}

/** Clamp at a sentence or word boundary, never mid-word. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? ")
  );
  if (sentenceEnd > max * 0.5) return slice.slice(0, sentenceEnd + 1).trim();
  const space = slice.lastIndexOf(" ");
  const cut = space > max * 0.5 ? slice.slice(0, space) : slice;
  return cut.replace(/[,;:\-–]+$/, "").trim();
}

/** Multi-sentence prose: drop any sentence that contains an ungrounded number. */
function cleanProse(text: string, allowed: Set<string>, max: number): string {
  const stripped = stripMarkdown(text);
  if (!stripped) return "";
  const kept = stripped
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !hasUngroundedNumber(s, allowed));
  return clamp(kept.join(" ").trim(), max);
}

/** Single-line field: drop the whole line if it contains an ungrounded number. */
function cleanLine(text: string, allowed: Set<string>, max: number): string {
  const stripped = stripMarkdown(text);
  if (!stripped || hasUngroundedNumber(stripped, allowed)) return "";
  return clamp(stripped, max);
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = i.toLowerCase();
    if (!i || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Normalize text to JSON string by stripping any markdown code fences
 */
export function extractCleanJson(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/, "");
  }
  return text.trim();
}

// ---------- grounding context (built once per request) ----------

const TECH_SYNONYMS: Record<string, string[]> = {
  javascript: ["js", "ecmascript"],
  typescript: ["ts"],
  python: ["py"],
  golang: ["go"],
  go: ["golang"],
  "c++": ["cpp"],
  cpp: ["c++"],
  "c#": ["csharp"],
  csharp: ["c#"],
  nodejs: ["node", "node.js"],
  "node.js": ["node", "nodejs"],
  react: ["reactjs", "react.js"],
  nextjs: ["next", "next.js"],
  "next.js": ["next", "nextjs"],
};

interface Ctx {
  facts: Facts;
  allowed: Set<string>;
  isSkillGrounded: (item: string) => boolean;
  repoMap: Map<string, Repo>;
  knownTerms: Set<string>;
}

function buildCtx(facts: Facts): Ctx {
  const validSkillNames = new Set<string>();
  facts.topLanguages.forEach((l) => validSkillNames.add(l.name.toLowerCase()));
  facts.topRepos.forEach((r) => {
    if (r.language) validSkillNames.add(r.language.toLowerCase());
    r.topics.forEach((t) => validSkillNames.add(t.toLowerCase()));
  });

  const isSkillGrounded = (item: string) => {
    const lower = item.toLowerCase().trim();
    if (validSkillNames.has(lower)) return true;
    const synonyms = TECH_SYNONYMS[lower] || [];
    if (synonyms.some((s) => validSkillNames.has(s))) return true;
    return Array.from(validSkillNames).some((valid) =>
      (TECH_SYNONYMS[valid] || []).includes(lower)
    );
  };

  const repoMap = new Map<string, Repo>();
  facts.topRepos.forEach((r) => repoMap.set(r.name.toLowerCase(), r));

  const knownTerms = new Set<string>(validSkillNames);
  facts.topRepos.forEach((r) => knownTerms.add(r.name.toLowerCase()));

  return { facts, allowed: extractAllowedNumbers(facts), isSkillGrounded, repoMap, knownTerms };
}

/** True when the text names a real repo, language or topic from Facts. */
function mentionsKnownTerm(text: string, terms: Set<string>): boolean {
  const lower = text.toLowerCase();
  const tokens = lower.match(/[a-z0-9+#._-]+/g) ?? [];
  if (tokens.some((t) => terms.has(t.replace(/[.]+$/, "")))) return true;
  for (const term of Array.from(terms)) if (term.includes(" ") && lower.includes(term)) return true;
  return false;
}

// ---------- fallbacks built only from Facts ----------

function fallbackHeadline(facts: Facts): string {
  const langs = facts.topLanguages.slice(0, 2).map((l) => l.name);
  if (langs.length === 2) return `Developer building with ${langs[0]} and ${langs[1]}`;
  if (langs.length === 1) return `Developer building with ${langs[0]}`;
  return facts.name || facts.login;
}

function fallbackAbout(facts: Facts, c: Ctx): string {
  const fromBio = facts.bio ? cleanProse(facts.bio, c.allowed, LIMITS.paragraph) : "";
  if (fromBio) return fromBio;
  const langs = facts.topLanguages.slice(0, 3).map((l) => l.name);
  const repos = facts.topRepos.slice(0, 2).map((r) => r.name);
  const a = langs.length ? `My work is mostly in ${langs.join(", ")}.` : "";
  const b = repos.length ? ` Recent projects include ${repos.join(" and ")}.` : "";
  return (a + b).trim();
}

// ---------- per-section cleaners (shared by batch and single regeneration) ----------

function cleanIntro(d: IntroSection, c: Ctx): IntroSection {
  return {
    headline:
      cleanLine(d.headline, c.allowed, LIMITS.headline) || fallbackHeadline(c.facts),
    tagline: cleanProse(d.tagline, c.allowed, LIMITS.tagline),
    roles: dedupe(d.roles.map((r) => cleanLine(r, c.allowed, LIMITS.role))).slice(0, 4),
  };
}

function cleanAbout(d: AboutSection, c: Ctx): AboutSection {
  let paragraphs = d.paragraphs
    .map((p) => cleanProse(p, c.allowed, LIMITS.paragraph))
    .filter((p) => p.length > 0)
    .slice(0, 3);
  if (paragraphs.length === 0) {
    const fb = fallbackAbout(c.facts, c);
    paragraphs = fb ? [fb] : [];
  }
  return {
    paragraphs,
    // A highlight must name a real repo, language or topic.
    highlights: dedupe(
      d.highlights
        .map((h) => cleanLine(h, c.allowed, LIMITS.highlight))
        .filter((h) => h && mentionsKnownTerm(h, c.knownTerms))
    ).slice(0, 5),
    areas: dedupe(d.areas.map((a) => cleanLine(a, c.allowed, LIMITS.area))).slice(0, 4),
  };
}

function cleanSkills(d: SkillsSection, c: Ctx): SkillsSection {
  const seen = new Set<string>();
  const groups = d.groups
    .map((g) => {
      const items = g.items
        .map((item) => item.replace(/[*`]/g, "").trim()) // keep "C#", "Node.js"
        .filter((item) => item && c.isSkillGrounded(item))
        .filter((item) => {
          const k = item.toLowerCase();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .slice(0, 12);
      return {
        title: cleanLine(g.title, c.allowed, LIMITS.groupTitle) || "Technologies",
        items,
      };
    })
    .filter((g) => g.items.length > 0)
    .slice(0, 5);

  if (groups.length === 0 && c.facts.topLanguages.length > 0) {
    return {
      groups: [
        {
          title: "Languages & Technologies",
          items: c.facts.topLanguages.map((l) => l.name),
        },
      ],
    };
  }
  return { groups };
}

function cleanProjects(d: ProjectsSection, c: Ctx): ProjectsSection {
  const used = new Set<string>();
  return d
    .filter((p) => c.repoMap.has(p.repo.toLowerCase()))
    .filter((p) => {
      const k = p.repo.toLowerCase();
      if (used.has(k)) return false;
      used.add(k);
      return true;
    })
    .map((p) => {
      const repo = c.repoMap.get(p.repo.toLowerCase())!;
      return {
        repo: repo.name,
        pitch:
          cleanProse(p.pitch, c.allowed, LIMITS.pitch) ||
          cleanProse(repo.description ?? "", c.allowed, LIMITS.pitch),
        highlights: dedupe(
          p.highlights.map((h) => cleanLine(h, c.allowed, LIMITS.projectHighlight))
        ).slice(0, 2),
      };
    })
    .slice(0, 6);
}

function cleanContact(d: ContactSection, c: Ctx): ContactSection {
  return { closing: cleanProse(d.closing, c.allowed, LIMITS.closing) };
}

// ---------- public API (same signatures as before) ----------

export function validateSections(
  rawText: string,
  facts: Facts
): { success: true; data: SectionsOutput } | { success: false; error: string } {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractCleanJson(rawText));
  } catch (err: unknown) {
    return { success: false, error: `Invalid JSON format: ${(err as Error).message}` };
  }

  const parseResult = SectionsSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    return {
      success: false,
      error: `Schema validation failed: ${parseResult.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`,
    };
  }

  const raw = parseResult.data;
  const c = buildCtx(facts);

  return {
    success: true,
    data: {
      intro: cleanIntro(raw.intro, c),
      about: cleanAbout(raw.about, c),
      skills: cleanSkills(raw.skills, c),
      projects: cleanProjects(raw.projects, c),
      contact: cleanContact(raw.contact, c),
    },
  };
}

/**
 * Validation for single section regeneration.
 * Now runs the SAME cleaners as the batch path. Before, regenerated skills
 * skipped grounding entirely and regenerated projects skipped canonical names.
 */
export function validateSingleSection(
  sectionKey: SectionKey,
  rawText: string,
  facts: Facts
): { success: true; data: unknown } | { success: false; error: string } {
  // "stats" is built by code from the username only; there is no AI data.
  if ((sectionKey as string) === "stats") return { success: true, data: {} };

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractCleanJson(rawText));
  } catch (err: unknown) {
    return { success: false, error: `Invalid JSON format: ${(err as Error).message}` };
  }

  const c = buildCtx(facts);

  switch (sectionKey) {
    case "intro": {
      const res = IntroSectionSchema.safeParse(parsedJson);
      if (!res.success) return { success: false, error: res.error.message };
      return { success: true, data: cleanIntro(res.data, c) };
    }
    case "about": {
      const res = AboutSectionSchema.safeParse(parsedJson);
      if (!res.success) return { success: false, error: res.error.message };
      return { success: true, data: cleanAbout(res.data, c) };
    }
    case "skills": {
      const res = SkillsSectionSchema.safeParse(parsedJson);
      if (!res.success) return { success: false, error: res.error.message };
      return { success: true, data: cleanSkills(res.data, c) };
    }
    case "projects": {
      const res = ProjectsSectionSchema.safeParse(parsedJson);
      if (!res.success) return { success: false, error: res.error.message };
      return { success: true, data: cleanProjects(res.data, c) };
    }
    case "contact": {
      const res = ContactSectionSchema.safeParse(parsedJson);
      if (!res.success) return { success: false, error: res.error.message };
      return { success: true, data: cleanContact(res.data, c) };
    }
    default:
      return { success: false, error: `Unknown section key: ${sectionKey}` };
  }
}
