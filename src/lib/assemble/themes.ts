// src/lib/assemble/themes.ts

export type HeaderStyle = "wave" | "terminal" | "minimal";

export interface Theme {
  label: string;
  accent: string; // hex without #
  from: string; // gradient start for wave header
  to: string; // gradient end for wave header
  font: string; // readme-typing-svg font (use + for spaces)
  header: HeaderStyle;
}

export const THEMES = {
  violet: { label: "Violet", accent: "a78bfa", from: "0f172a", to: "7c3aed", font: "Fira+Code", header: "wave" },
  cyan: { label: "Cyan", accent: "22d3ee", from: "0f172a", to: "0891b2", font: "JetBrains+Mono", header: "wave" },
  amber: { label: "Amber", accent: "f59e0b", from: "1c1917", to: "d97706", font: "Fira+Code", header: "wave" },
  pink: { label: "Pink", accent: "f472b6", from: "ec4899", to: "f97316", font: "Poppins", header: "wave" },
  indigo: { label: "Indigo", accent: "818cf8", from: "0ea5e9", to: "6366f1", font: "Fira+Code", header: "wave" },
  red: { label: "Red", accent: "f87171", from: "111827", to: "dc2626", font: "JetBrains+Mono", header: "wave" },
  green: { label: "Terminal Green", accent: "22c55e", from: "052e16", to: "16a34a", font: "JetBrains+Mono", header: "terminal" },
  mono: { label: "Minimal Mono", accent: "e6edf3", from: "24292f", to: "24292f", font: "Fira+Code", header: "minimal" },
} as const satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;

// Sensible defaults when the user picks a persona in your UI.
export const PERSONA_PRESETS: Record<string, { theme: ThemeId }> = {
  fullstack: { theme: "violet" },
  ai: { theme: "cyan" },
  cloud: { theme: "amber" },
  devops: { theme: "green" },
  frontend: { theme: "indigo" },
  backend: { theme: "indigo" },
  data: { theme: "amber" },
  security: { theme: "red" },
  student: { theme: "cyan" },
  opensource: { theme: "mono" },
  freelancer: { theme: "green" },
  designer: { theme: "pink" },
};
