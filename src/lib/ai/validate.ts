import { Facts } from "@/lib/github/types";
import {
  SectionsSchema,
  SectionsOutput,
  IntroSectionSchema,
  AboutSectionSchema,
  SkillsSectionSchema,
  ProjectsSectionSchema,
  ContactSectionSchema,
} from "./schema";
import { SectionKey } from "@/lib/config";

/**
 * Remove markdown syntax and markdown links, returning clean plain prose
 */
export function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    // Replace markdown links [text](url) with text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Strip raw URLs
    .replace(/https?:\/\/[^\s)]+/g, "")
    // Strip markdown formatting symbols like **, *, _, `, #, ~
    .replace(/[*_`#~]/g, "")
    // Normalize extra whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract all legitimate numbers present in Facts
 */
export function extractAllowedNumbers(facts: Facts): Set<string> {
  const allowed = new Set<string>();

  // Helper to add numbers found in any string or number
  const addNumbersFromString = (str: string | null | undefined) => {
    if (!str) return;
    const matches = str.match(/\d+/g);
    if (matches) {
      matches.forEach((m) => allowed.add(m));
    }
  };

  allowed.add(String(facts.followers));
  allowed.add(String(facts.contributions.commits));
  allowed.add(String(facts.contributions.pullRequests));
  allowed.add(String(facts.topRepos.length));

  addNumbersFromString(facts.bio);
  addNumbersFromString(facts.name);
  addNumbersFromString(facts.websiteUrl);

  for (const lang of facts.topLanguages) {
    allowed.add(String(Math.round(lang.percent)));
    allowed.add(String(Math.floor(lang.percent)));
    addNumbersFromString(lang.name);
  }

  for (const repo of facts.topRepos) {
    allowed.add(String(repo.stars));
    addNumbersFromString(repo.name);
    addNumbersFromString(repo.description);
    addNumbersFromString(repo.pushedAt); // captures year e.g. 2024, month, day
  }

  return allowed;
}

/**
 * Strip or sanitize ungrounded digit sequences from prose
 */
export function sanitizeUngroundedNumbers(text: string, allowedNumbers: Set<string>): string {
  if (!text) return "";
  // Find all standalone digit sequences
  return text.replace(/\b\d+\b/g, (num) => {
    if (allowedNumbers.has(num)) {
      return num;
    }
    // If number was hallucinated (e.g. "10 years"), blank it
    return "";
  }).replace(/\s+/g, " ").trim();
}

/**
 * Clean and ground prose string
 */
function cleanProse(text: string, allowedNumbers: Set<string>, maxLength?: number): string {
  let cleaned = stripMarkdown(text);
  cleaned = sanitizeUngroundedNumbers(cleaned, allowedNumbers);
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim();
  }
  return cleaned;
}

/**
 * Normalize text to JSON string by stripping any markdown code fences
 */
export function extractCleanJson(raw: string): string {
  let text = raw.trim();
  // Strip ```json ... ``` or ``` ... ```
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/, "");
  }
  return text.trim();
}

/**
 * Full Grounding & Validation Pipeline for batched AI output
 */
export function validateSections(
  rawText: string,
  facts: Facts
): { success: true; data: SectionsOutput } | { success: false; error: string } {
  let parsedJson: unknown;
  try {
    const cleanJson = extractCleanJson(rawText);
    parsedJson = JSON.parse(cleanJson);
  } catch (err: unknown) {
    return { success: false, error: `Invalid JSON format: ${(err as Error).message}` };
  }

  const parseResult = SectionsSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    return {
      success: false,
      error: `Schema validation failed: ${parseResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")}`,
    };
  }

  const raw = parseResult.data;
  const allowedNumbers = extractAllowedNumbers(facts);

  // 1. Ground and clean Intro
  const intro = {
    headline: cleanProse(raw.intro.headline, allowedNumbers, 80),
    tagline: cleanProse(raw.intro.tagline, allowedNumbers, 140),
  };

  // 2. Ground and clean About
  const about = {
    paragraphs: raw.about.paragraphs
      .map((p) => cleanProse(p, allowedNumbers, 300))
      .filter((p) => p.length > 0)
      .slice(0, 2),
  };
  if (about.paragraphs.length === 0) {
    about.paragraphs = [facts.bio ? cleanProse(facts.bio, allowedNumbers, 300) : "Passionate developer building open source software."];
  }

  // 3. Ground Skills: must exist in facts.topLanguages or repo topics
  const validSkillNames = new Set<string>();
  facts.topLanguages.forEach((l) => validSkillNames.add(l.name.toLowerCase()));
  facts.topRepos.forEach((r) => {
    if (r.language) validSkillNames.add(r.language.toLowerCase());
    r.topics.forEach((t) => validSkillNames.add(t.toLowerCase()));
  });

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

  const isSkillGrounded = (item: string) => {
    const lower = item.toLowerCase().trim();
    if (validSkillNames.has(lower)) return true;

    const synonyms = TECH_SYNONYMS[lower] || [];
    if (synonyms.some((s) => validSkillNames.has(s))) return true;

    const reverseMatch = Array.from(validSkillNames).some((valid) => {
      const validSynonyms = TECH_SYNONYMS[valid] || [];
      return validSynonyms.includes(lower);
    });
    if (reverseMatch) return true;

    return false;
  };

  const skills = {
    groups: raw.skills.groups
      .map((g) => {
        const title = cleanProse(g.title, allowedNumbers, 40);
        const groundedItems = g.items
          .map((item) => stripMarkdown(item).trim())
          .filter((item) => isSkillGrounded(item))
          .slice(0, 12);

        return {
          title: title || "Technologies",
          items: groundedItems,
        };
      })
      .filter((g) => g.items.length > 0)
      .slice(0, 5),
  };

  // If skills was completely emptied due to over-filtering, provide facts fallback
  if (skills.groups.length === 0 && facts.topLanguages.length > 0) {
    skills.groups = [
      {
        title: "Languages & Technologies",
        items: facts.topLanguages.map((l) => l.name),
      },
    ];
  }

  // 4. Ground Projects: repo MUST exist in facts.topRepos
  const repoMap = new Map<string, (typeof facts.topRepos)[0]>();
  facts.topRepos.forEach((r) => repoMap.set(r.name.toLowerCase(), r));

  const projects = raw.projects
    .filter((p) => repoMap.has(p.repo.toLowerCase()))
    .map((p) => {
      const canonical = repoMap.get(p.repo.toLowerCase())!;
      return {
        repo: canonical.name,
        pitch: cleanProse(p.pitch, allowedNumbers, 140),
      };
    })
    .slice(0, 6);

  // 5. Ground and clean Contact
  const contact = {
    closing: cleanProse(raw.contact.closing, allowedNumbers, 120),
  };

  return {
    success: true,
    data: {
      intro,
      about,
      skills,
      projects,
      contact,
    },
  };
}

/**
 * Validation for single section regeneration
 */
export function validateSingleSection(
  sectionKey: SectionKey,
  rawText: string,
  facts: Facts
): { success: true; data: unknown } | { success: false; error: string } {
  let parsedJson: unknown;
  try {
    const cleanJson = extractCleanJson(rawText);
    parsedJson = JSON.parse(cleanJson);
  } catch (err: unknown) {
    return { success: false, error: `Invalid JSON format: ${(err as Error).message}` };
  }

  const allowedNumbers = extractAllowedNumbers(facts);

  if (sectionKey === "intro") {
    const res = IntroSectionSchema.safeParse(parsedJson);
    if (!res.success) return { success: false, error: res.error.message };
    return {
      success: true,
      data: {
        headline: cleanProse(res.data.headline, allowedNumbers, 80),
        tagline: cleanProse(res.data.tagline, allowedNumbers, 140),
      },
    };
  }

  if (sectionKey === "about") {
    const res = AboutSectionSchema.safeParse(parsedJson);
    if (!res.success) return { success: false, error: res.error.message };
    return {
      success: true,
      data: {
        paragraphs: res.data.paragraphs.map((p) => cleanProse(p, allowedNumbers, 300)).slice(0, 2),
      },
    };
  }

  if (sectionKey === "skills") {
    const res = SkillsSectionSchema.safeParse(parsedJson);
    if (!res.success) return { success: false, error: res.error.message };
    return { success: true, data: res.data };
  }

  if (sectionKey === "projects") {
    const res = ProjectsSectionSchema.safeParse(parsedJson);
    if (!res.success) return { success: false, error: res.error.message };
    const validNames = new Set(facts.topRepos.map((r) => r.name.toLowerCase()));
    return {
      success: true,
      data: res.data
        .filter((p) => validNames.has(p.repo.toLowerCase()))
        .map((p) => ({
          repo: p.repo,
          pitch: cleanProse(p.pitch, allowedNumbers, 140),
        })),
    };
  }

  if (sectionKey === "contact") {
    const res = ContactSectionSchema.safeParse(parsedJson);
    if (!res.success) return { success: false, error: res.error.message };
    return {
      success: true,
      data: {
        closing: cleanProse(res.data.closing, allowedNumbers, 120),
      },
    };
  }

  return { success: false, error: `Unknown section key: ${sectionKey}` };
}
