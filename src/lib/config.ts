export const APP_CONFIG = {
  name: "Hello-md",
  description: "Developer Tool Precision GitHub Profile README Generator",
  version: "1.0.0",
  dailyGenerationsLimit: 3,
  sectionRegenCost: 0.25,
  aiTimeoutMs: 20000,
  promptVersion: "v1.0",
} as const;

export const SECTION_KEYS = [
  "intro",
  "about",
  "skills",
  "projects",
  "stats",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const TONES = [
  "professional",
  "playful",
  "minimal",
  "hacker",
] as const;

export type Tone = (typeof TONES)[number];
