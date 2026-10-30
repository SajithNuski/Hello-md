import type { Facts } from "./github/types";
import { Tone, handleTone } from "./toneConfig";

export type AboutStyle = Tone;
export type GifPlacement = "left" | "center" | "right";

export interface GifPreset {
  id: string;
  name: string;
  gender: "male" | "female";
  url: string;
}

export const GIF_PRESETS: Record<"male" | "female", GifPreset[]> = {
  male: [
    {
      id: "male-workspace",
      name: "Multi-Monitor Desk",
      gender: "male",
      url: "https://user-images.githubusercontent.com/74038190/212750147-854a394f-fee9-4080-9770-78a4b7ece53f.gif",
    },
    {
      id: "male-pro",
      name: "Software Engineer",
      gender: "male",
      url: "https://user-images.githubusercontent.com/74038190/212751818-13da6fd2-27ca-45c4-9c64-3940ccfa6fd3.gif",
    },
    {
      id: "male-office",
      name: "Tech Workstation",
      gender: "male",
      url: "https://user-images.githubusercontent.com/74038190/212897707-026174ef-f09d-4d41-a4bb-c7266f5420b0.gif",
    },
    {
      id: "male-dev",
      name: "Developer Workspace",
      gender: "male",
      url: "https://user-images.githubusercontent.com/74038190/212750155-3ceddfbd-19d3-40a3-87af-8d329c8323c4.gif",
    },
  ],
  female: [
    {
      id: "female-dev",
      name: "Software Engineer",
      gender: "female",
      url: "https://user-images.githubusercontent.com/74038190/213760677-e45ca5f7-d1aa-4c2c-91e0-573819287304.gif",
    },
    {
      id: "female-laptop",
      name: "Laptop Workstation",
      gender: "female",
      url: "https://user-images.githubusercontent.com/74038190/212900420-11d6daeb-4bcd-474f-ad58-86c47d25b541.gif",
    },
    {
      id: "female-pro",
      name: "Professional Coder",
      gender: "female",
      url: "https://user-images.githubusercontent.com/74038190/216644497-1951db19-8f3d-4e44-ac08-8e9d7e0d94a7.gif",
    },
    {
      id: "female-workspace",
      name: "Modern Tech Desk",
      gender: "female",
      url: "https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif",
    },
  ],
};

export interface AboutConfig {
  name: string;
  role: string;
  education: string;
  freelance: string;
  stack: string[];
  focus: string[];
  portfolio: string;
  linkedin: string;
  status: string;
  currentlyLearning: string;
  gifEnabled: boolean;
  gifUrl: string;
  gifWidth: number;
  gifPlacement?: GifPlacement;
  style: AboutStyle;
  emoji: boolean;
}

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  name: "Sajith Nuski",
  role: "Full-Stack Developer → AI & Cloud Engineer",
  education: "Industrial Information Technology @ Uva Wellassa University",
  freelance: "Fiverr Level 2 Seller ⭐",
  stack: ["React", "Node.js", "Python", "MongoDB", "Firebase"],
  // Fixed typo: "AI Engineer" instead of "AI Ingineer"
  focus: ["AI Engineer", "Cloud Deployment", "Scalable Systems", "SaaS Applications"],
  portfolio: "https://sajithnuski.is-a.dev",
  linkedin: "https://linkedin.com/in/sajithnuski",
  status: "Open to internship opportunities 🎯",
  currentlyLearning: "AI + Cloud Engineering",
  gifEnabled: false,
  gifUrl: "https://user-images.githubusercontent.com/74038190/212750147-854a394f-fee9-4080-9770-78a4b7ece53f.gif",
  gifWidth: 300,
  gifPlacement: "right",
  style: "hacker",
  emoji: true,
};

/**
 * Returns a clean, dynamically generated AboutConfig for a given username or facts object.
 * Does not fabricate or inherit personal details from the app author.
 */
export function getDefaultAboutConfig(
  username: string = "",
  facts?: Partial<Facts> | null,
  tone?: unknown
): AboutConfig {
  const cleanUsername = (username || "").trim().replace(/^@/, "");
  const name = facts?.name || cleanUsername || "Your Name";
  const { tone: validTone, defaultEmoji } = handleTone(tone);

  let role = "Software Developer";
  if (facts?.bio) {
    const firstLine = facts.bio.split(/[\r\n]+/)[0]?.trim();
    if (firstLine && firstLine.length <= 80) {
      role = firstLine;
    }
  } else if (facts?.topLanguages && facts.topLanguages.length > 0) {
    const langs = facts.topLanguages.slice(0, 3).map((l) => l.name);
    role = `${langs.join(" | ")} Developer`;
  }

  const stack =
    facts?.topLanguages && facts.topLanguages.length > 0
      ? facts.topLanguages.slice(0, 6).map((l) => l.name)
      : ["JavaScript", "TypeScript", "React", "Node.js"];

  const focus =
    facts?.topRepos && facts.topRepos.length > 0
      ? facts.topRepos.slice(0, 4).map((r) => r.name)
      : ["Web Applications", "Open Source"];

  const portfolio = facts?.websiteUrl || "";

  return {
    name,
    role,
    education: "",
    freelance: "",
    stack,
    focus,
    portfolio,
    linkedin: "",
    status: "Open to opportunities 🎯",
    currentlyLearning: "",
    gifEnabled: false,
    gifUrl: "https://user-images.githubusercontent.com/74038190/212750147-854a394f-fee9-4080-9770-78a4b7ece53f.gif",
    gifWidth: 300,
    gifPlacement: "right",
    style: validTone,
    emoji: defaultEmoji,
  };
}

/**
 * Shared sanitizer helper.
 * - In "markdown" mode: escapes characters that break Markdown formatting in plain text (|, *, _, `, <).
 * - In "code" mode: escapes double quotes and backslashes for TS/JS string literals.
 * - In "url" mode: trims and ensures valid http(s) protocols.
 */
export function sanitize(str: string | null | undefined, mode: "markdown" | "code" | "url" = "markdown"): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (!trimmed) return "";

  if (mode === "code") {
    // Escape backslashes and double quotes inside TS code blocks
    return trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  if (mode === "url") {
    // Only allow http/https URLs to avoid javascript: injection
    try {
      const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return trimmed;
      }
    } catch {
      return "";
    }
    return "";
  }

  // Markdown mode: escape characters that break Markdown tables, emphasis, backticks, or HTML tags
  return trimmed
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/`/g, "\\`")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Helper to get first name from full name for friendly variable and greeting names.
 */
export function getFirstName(fullName: string): string {
  const parts = (fullName || "").trim().split(/\s+/);
  return parts[0] || "dev";
}

/**
 * Renders the GIF element if enabled and non-empty with placement options (left, center, right).
 */
export function renderGif(data: AboutConfig): string {
  if (!data.gifEnabled || !data.gifUrl?.trim()) return "";
  const w = data.gifWidth || 300;
  const url = data.gifUrl.trim();
  const placement = data.gifPlacement || "right";

  if (placement === "center") {
    return `<div align="center">\n  <img width="${w}" src="${url}"/>\n</div>`;
  }
  return `<img align="${placement}" width="${w}" src="${url}"/>`;
}

// -------------------------------------------------------------
// 1. Hacker Style Generator
// -------------------------------------------------------------
export function generateHacker(data: AboutConfig): string {
  const headingEmoji = data.emoji !== false ? "🧬 " : "";
  const heading = `## ${headingEmoji}About Me`;

  const varName = getFirstName(data.name).toLowerCase() || "dev";

  // Build key-value pairs for the TS object with padded colons
  interface KvItem {
    key: string;
    valueStr: string;
  }
  const items: KvItem[] = [];

  if (data.name?.trim()) {
    items.push({ key: "name", valueStr: `"${sanitize(data.name, "code")}"` });
  }
  if (data.role?.trim()) {
    items.push({ key: "role", valueStr: `"${sanitize(data.role, "code")}"` });
  }
  if (data.education?.trim()) {
    items.push({ key: "edu", valueStr: `"${sanitize(data.education, "code")}"` });
  }
  if (data.freelance?.trim()) {
    items.push({ key: "freelance", valueStr: `"${sanitize(data.freelance, "code")}"` });
  }
  if (data.stack?.length > 0) {
    const validStack = data.stack.filter((s) => s.trim().length > 0);
    if (validStack.length > 0) {
      const arr = validStack.map((s) => `"${sanitize(s, "code")}"`).join(", ");
      items.push({ key: "stack", valueStr: `[${arr}]` });
    }
  }
  if (data.focus?.length > 0) {
    const validFocus = data.focus.filter((f) => f.trim().length > 0);
    if (validFocus.length > 0) {
      const arr = validFocus.map((f) => `"${sanitize(f, "code")}"`).join(", ");
      items.push({ key: "focus", valueStr: `[${arr}]` });
    }
  }
  if (data.portfolio?.trim()) {
    items.push({ key: "portfolio", valueStr: `"${sanitize(data.portfolio, "code")}"` });
  }
  if (data.status?.trim()) {
    items.push({ key: "status", valueStr: `"${sanitize(data.status, "code")}"` });
  }

  // Determine max key length for colon alignment
  const maxKeyLen = items.reduce((max, item) => Math.max(max, item.key.length), 0);
  const objectLines = items.map((item) => {
    const padding = " ".repeat(maxKeyLen - item.key.length);
    return `  ${item.key}${padding}: ${item.valueStr},`;
  });

  const codeBlock = `\`\`\`ts\nconst ${varName} = {\n${objectLines.join("\n")}\n};\n\`\`\``;

  // Bullets
  const bullets: string[] = [];
  const e = (emojiStr: string) => (data.emoji !== false ? `${emojiStr}&nbsp; ` : "");

  const safePortfolio = sanitize(data.portfolio, "url");
  if (safePortfolio) {
    bullets.push(`- ${e("🔭")}Check out my [Portfolio](${safePortfolio})`);
  }

  if (data.currentlyLearning?.trim()) {
    bullets.push(`- ${e("🌱")}Currently mastering ${sanitize(data.currentlyLearning)}`);
  }

  if (data.freelance?.trim()) {
    bullets.push(`- ${e("💼")}${sanitize(data.freelance)}`);
  }

  if (data.education?.trim()) {
    bullets.push(`- ${e("🎓")}${sanitize(data.education)}`);
  }

  if (data.role?.trim()) {
    bullets.push(`- ${e("⚡")}Building scalable, intelligent web applications`);
  }

  const safeLinkedin = sanitize(data.linkedin, "url");
  if (safeLinkedin) {
    bullets.push(`- ${e("📫")}Let's connect on [LinkedIn](${safeLinkedin})`);
  }

  const gif = renderGif(data);

  // Layout: Heading \n\n codeBlock [\n\n gif] \n\n bullets
  const parts = [heading, codeBlock];
  if (gif) {
    parts.push(gif);
  }
  if (bullets.length > 0) {
    parts.push(bullets.join("\n"));
  }

  return parts.join("\n\n");
}

// -------------------------------------------------------------
// 2. Playful Style Generator
// -------------------------------------------------------------
export function generatePlayful(data: AboutConfig): string {
  const firstName = getFirstName(data.name) || "there";
  const wave = data.emoji !== false ? "👋 " : "";
  const heading = `## ${wave}Hey, I'm ${firstName}!`;

  const gif = renderGif(data);

  // Friendly intro sentence
  const roleText = data.role?.trim() ? sanitize(data.role) : "developer";
  const eduText = data.education?.trim() ? ` with skills forged at ${sanitize(data.education)}` : "";
  const introSentence = `I'm a ${roleText}${eduText}. I love turning ambitious ideas into delightful, interactive software!`;

  // Bullets
  const bullets: string[] = [];
  const e = (emojiStr: string) => (data.emoji !== false ? `${emojiStr}&nbsp; ` : "");

  const safePortfolio = sanitize(data.portfolio, "url");
  if (safePortfolio) {
    bullets.push(`- ${e("🔭")}Exploring the digital cosmos at [my Portfolio](${safePortfolio})`);
  }

  if (data.currentlyLearning?.trim()) {
    bullets.push(`- ${e("🌱")}Leveling up my knowledge in **${sanitize(data.currentlyLearning)}**`);
  }

  if (data.freelance?.trim()) {
    bullets.push(`- ${e("💼")}${sanitize(data.freelance)}`);
  }

  if (data.education?.trim()) {
    bullets.push(`- ${e("🎓")}Studied at ${sanitize(data.education)}`);
  }

  const safeLinkedin = sanitize(data.linkedin, "url");
  if (safeLinkedin) {
    bullets.push(`- ${e("📫")}Say hi and connect on [LinkedIn](${safeLinkedin})`);
  }

  // Tech stack & Focus chips
  const chipsBlocks: string[] = [];
  const validStack = (data.stack || []).filter((s) => s.trim().length > 0);
  if (validStack.length > 0) {
    const chips = validStack.map((s) => `\`${s.trim().replace(/`/g, "")}\``).join(" ");
    chipsBlocks.push(`**Tech Arsenal:**\n${chips}`);
  }

  const validFocus = (data.focus || []).filter((f) => f.trim().length > 0);
  if (validFocus.length > 0) {
    const chips = validFocus.map((f) => `\`${f.trim().replace(/`/g, "")}\``).join(" ");
    chipsBlocks.push(`**Focus Areas:**\n${chips}`);
  }

  // Status with playful call to action
  let statusLine = "";
  if (data.status?.trim()) {
    const icon = data.emoji !== false ? "⚡&nbsp; " : "";
    statusLine = `> ${icon}**Status:** ${sanitize(data.status)} — let's build something epic together!`;
  }

  const parts = [heading];
  if (gif) parts.push(gif);
  parts.push(introSentence);
  if (bullets.length > 0) parts.push(bullets.join("\n"));
  if (chipsBlocks.length > 0) parts.push(chipsBlocks.join("\n\n"));
  if (statusLine) parts.push(statusLine);

  return parts.join("\n\n");
}

// -------------------------------------------------------------
// 3. Professional Style Generator
// -------------------------------------------------------------
export function generateProfessional(data: AboutConfig): string {
  // Forced off unless user explicitly turns on
  const headingEmoji = data.emoji === true ? "🧬 " : "";
  const heading = `## ${headingEmoji}About Me`;

  const gif = renderGif(data);

  // 2-3 sentence summary paragraph
  const rolePart = data.role?.trim() ? `I am a ${sanitize(data.role)}` : "I am a software engineer";
  const eduPart = data.education?.trim() ? `, with an educational foundation in ${sanitize(data.education)}` : "";
  const focusPart = data.focus?.length
    ? ` My core competencies focus on ${data.focus.map((f) => sanitize(f)).join(", ")}.`
    : "";
  const learningPart = data.currentlyLearning?.trim()
    ? ` Currently, I am expanding my technical scope in ${sanitize(data.currentlyLearning)}.`
    : "";

  const paragraph = `${rolePart}${eduPart}.${focusPart}${learningPart}`.trim();

  // Two-column Markdown table
  interface Row {
    label: string;
    value: string;
  }
  const rows: Row[] = [];

  if (data.role?.trim()) {
    rows.push({ label: "Role", value: sanitize(data.role) });
  }
  if (data.education?.trim()) {
    rows.push({ label: "Education", value: sanitize(data.education) });
  }
  if (data.freelance?.trim()) {
    rows.push({ label: "Freelance", value: sanitize(data.freelance) });
  }
  if (data.stack?.length > 0) {
    const validStack = data.stack.filter((s) => s.trim().length > 0);
    if (validStack.length > 0) {
      rows.push({ label: "Tech Stack", value: validStack.map((s) => sanitize(s)).join(", ") });
    }
  }
  if (data.focus?.length > 0) {
    const validFocus = data.focus.filter((f) => f.trim().length > 0);
    if (validFocus.length > 0) {
      rows.push({ label: "Focus Areas", value: validFocus.map((f) => sanitize(f)).join(", ") });
    }
  }
  if (data.status?.trim()) {
    rows.push({ label: "Status", value: sanitize(data.status) });
  }

  let tableBlock = "";
  if (rows.length > 0) {
    const tableHeader = "| Attribute | Details |\n| :--- | :--- |";
    const tableRows = rows.map((r) => `| **${r.label}** | ${r.value} |`).join("\n");
    tableBlock = `${tableHeader}\n${tableRows}`;
  }

  // Links at the end: [Portfolio](url) · [LinkedIn](url)
  const links: string[] = [];
  const safePortfolio = sanitize(data.portfolio, "url");
  if (safePortfolio) {
    links.push(`[Portfolio](${safePortfolio})`);
  }
  const safeLinkedin = sanitize(data.linkedin, "url");
  if (safeLinkedin) {
    links.push(`[LinkedIn](${safeLinkedin})`);
  }
  const linksLine = links.join(" · ");

  const parts = [heading];
  if (gif) parts.push(gif);
  if (paragraph) parts.push(paragraph);
  if (tableBlock) parts.push(tableBlock);
  if (linksLine) parts.push(linksLine);

  return parts.join("\n\n");
}

// -------------------------------------------------------------
// 4. Minimal Style Generator
// -------------------------------------------------------------
export function generateMinimal(data: AboutConfig): string {
  // Forced off unless user explicitly turns on
  const headingEmoji = data.emoji === true ? "🧬 " : "";
  const heading = `## ${headingEmoji}About`;

  // No code blocks, tables, GIF, or badges.
  const bullets: string[] = [];
  const e = (emojiStr: string) => (data.emoji === true ? `${emojiStr}&nbsp; ` : "");

  if (data.role?.trim()) {
    bullets.push(`- ${e("⚡")}${sanitize(data.role)}`);
  }

  if (data.education?.trim()) {
    bullets.push(`- ${e("🎓")}${sanitize(data.education)}`);
  }

  if (data.stack?.length > 0) {
    const validStack = data.stack.filter((s) => s.trim().length > 0);
    if (validStack.length > 0) {
      bullets.push(`- ${e("🛠️")}Stack: ${validStack.map((s) => sanitize(s)).join(", ")}`);
    }
  }

  const safePortfolio = sanitize(data.portfolio, "url");
  if (safePortfolio) {
    bullets.push(`- ${e("🔭")}Portfolio: [${safePortfolio}](${safePortfolio})`);
  }

  if (data.status?.trim()) {
    bullets.push(`- ${e("🎯")}Status: ${sanitize(data.status)}`);
  }

  const parts = [heading];
  if (bullets.length > 0) {
    parts.push(bullets.join("\n"));
  }

  return parts.join("\n\n");
}

// -------------------------------------------------------------
// Unified Dispatcher
// -------------------------------------------------------------
export function generateAboutMarkdown(data: AboutConfig): string {
  switch (data.style) {
    case "hacker":
      return generateHacker(data);
    case "playful":
      return generatePlayful(data);
    case "professional":
      return generateProfessional(data);
    case "minimal":
      return generateMinimal(data);
    default:
      return generateHacker(data);
  }
}
