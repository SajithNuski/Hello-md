import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";
import {
  IntroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ContactSection,
} from "../ai/schema";
import { THEMES, type Theme, type ThemeId } from "./themes";
import { StatsConfig, generateStatsMarkdown } from "../statsConfig";
import { TechStackConfig, generateSkillsMarkdown } from "../techStackConfig";
import {
  SocialConfig,
  generateContactMarkdown,
  normalizeSocialUrl,
} from "../socialConfig";

/**
 * Deterministic Markdown/HTML builder. The AI supplies plain text only; every
 * URL, badge, card and layout decision is made here.
 * GitHub strips inline `style` attributes, so only align / width / height /
 * valign are used.
 */

export type WidgetKey = "stats" | "languages" | "streak" | "activity" | "trophies";

export interface FormatOptions {
  /** Emoji in section headings. Defaults to true, except for the minimal theme. */
  emoji?: boolean;
  /** Self-host github-readme-stats and pass your domain (or set NEXT_PUBLIC_STATS_HOST). */
  statsHost?: string;
  /** Extra links the user typed in the form. facts has no LinkedIn or email. */
  links?: { email?: string; linkedin?: string; twitter?: string; fiverr?: string };
  widgets?: Partial<Record<WidgetKey, boolean>>;
}

const DEFAULT_WIDGETS: Record<WidgetKey, boolean> = {
  stats: true,
  languages: true,
  streak: true,
  activity: false,
  trophies: false,
};

const CARD_BG = "0d1117";
const TEXT = "c9d1d9";

// Map your existing theme names onto the new ones. Add yours here.
const THEME_ALIASES: Record<string, ThemeId> = { minimal: "mono", default: "violet" };

export function resolveTheme(theme: string): ThemeId {
  if (theme in THEMES) return theme as ThemeId;
  return THEME_ALIASES[theme] ?? "violet";
}

// skillicons.dev ids. Spot-check against https://skillicons.dev before shipping.
const ICONS: Record<string, string> = {
  javascript: "js", typescript: "ts", python: "py", java: "java", "c++": "cpp",
  "c#": "cs", c: "c", go: "go", golang: "go", rust: "rust", php: "php", ruby: "ruby",
  kotlin: "kotlin", swift: "swift", dart: "dart", html: "html", css: "css",
  shell: "bash", bash: "bash", powershell: "powershell", vue: "vue",
  react: "react", nextjs: "nextjs", nodejs: "nodejs", node: "nodejs",
  express: "express", mongodb: "mongodb", mysql: "mysql", postgresql: "postgres",
  postgres: "postgres", docker: "docker", dockerfile: "docker",
  tailwindcss: "tailwind", tailwind: "tailwind", firebase: "firebase",
  flutter: "flutter", git: "git", github: "github", figma: "figma",
  linux: "linux", aws: "aws", azure: "azure", gcp: "gcp",
  kubernetes: "kubernetes", terraform: "terraform", redis: "redis",
  graphql: "graphql", django: "django", flask: "flask", fastapi: "fastapi",
  spring: "spring", svelte: "svelte", angular: "angular", laravel: "laravel",
  jupyternotebook: "jupyter", r: "r", scala: "scala", lua: "lua",
  vite: "vite", sass: "sass", scss: "sass", nginx: "nginx", vercel: "vercel",
  netlify: "netlify",
};

// ---------- helpers ----------

/** URL-encode for query strings, spaces as "+" (what readme-typing-svg expects). */
const enc = (s: string) => encodeURIComponent(s).replace(/%20/g, "+");

/** Escape text before it goes into Markdown/HTML. Facts come from GitHub: untrusted. */
const safe = (s: string | null | undefined) =>
  (s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

/** Only http(s) URLs. websiteUrl is user-controlled and could be "javascript:...". */
function httpUrl(u: string | null | undefined): string | undefined {
  if (!u) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(u) ? u : `https://${u}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const emailOk = (e?: string) => (e && /^[^\s@<>"]+@[^\s@<>"]+$/.test(e) ? e : undefined);

const iconId = (item: string) => ICONS[item.toLowerCase().replace(/[\s.]+/g, "")];

const shield = (item: string, accent: string) => {
  const label = encodeURIComponent(item.replace(/-/g, "--").replace(/_/g, "__"));
  return `<img src="https://img.shields.io/badge/${label}-${accent}?style=flat-square&labelColor=${CARD_BG}" alt="${safe(item)}"/>`;
};

interface Ctx {
  facts: Facts;
  t: Theme;
  emoji: boolean;
  opts: FormatOptions;
  user: string; // url-encoded login
}

function host(o: FormatOptions) {
  return (
    o.statsHost ??
    process.env.NEXT_PUBLIC_STATS_HOST ??
    "https://github-readme-stats.vercel.app"
  ).replace(/\/$/, "");
}

const heading = (c: Ctx, emoji: string, text: string) =>
  `## ${c.emoji ? emoji + " " : ""}${text}`;

// ---------- section renderers ----------

function renderIntro(d: IntroSection, c: Ctx): string {
  const { t, facts } = c;
  const name = safe(facts.name || facts.login);
  const roles = (d.roles?.length ? d.roles : [d.headline])
    .slice(0, 4)
    .map(enc)
    .join(";");

  const typing = `[![Typing SVG](https://readme-typing-svg.demolab.com?font=${t.font}&weight=600&size=21&pause=1100&color=${t.accent}&center=true&vCenter=true&width=700&lines=${roles})](https://git.io/typing-svg)`;

  const badges = [
    `<img src="https://img.shields.io/github/followers/${c.user}?style=for-the-badge&logo=github&color=${t.accent}&labelColor=${CARD_BG}" alt="Followers"/>`,
    `<img src="https://komarev.com/ghpvc/?username=${c.user}&color=${t.accent}&style=for-the-badge&label=PROFILE+VIEWS" alt="Profile views"/>`,
  ].join("\n  ");

  const headline = safe(d.headline);
  const tagline = safe(d.tagline);

  if (t.header === "minimal") {
    return `# ${name}

**${headline}**${tagline ? `\n\n${tagline}` : ""}

<p>
  ${badges}
</p>`;
  }

  if (t.header === "terminal") {
    return `<div align="center">

\`\`\`
 ┌──────────────────────────────────────────────┐
 │  $ whoami                                    │
 │  > ${name}
 └──────────────────────────────────────────────┘
\`\`\`

${typing}

**${headline}**${tagline ? `\n\n${tagline}` : ""}

<p>
  ${badges}
</p>

</div>`;
  }

  return `<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:${t.from},100:${t.to}&height=190&section=header&text=${enc(name)}&fontSize=46&fontColor=ffffff&fontAlignY=40" width="100%" alt="${name}"/>

${typing}

### ${headline}
${tagline ? `\n${tagline}\n` : ""}
<p>
  ${badges}
</p>

</div>`;
}

function renderAbout(d: AboutSection, c: Ctx): string {
  const parts: string[] = [heading(c, "🧬", "About Me")];

  const paragraphs = d.paragraphs?.length
    ? d.paragraphs.map(safe)
    : c.facts.bio
      ? [safe(c.facts.bio)]
      : [];
  if (paragraphs.length) parts.push(paragraphs.join("\n\n"));

  if (d.highlights?.length) parts.push(d.highlights.map((h) => `- ${safe(h)}`).join("\n"));

  if (d.areas?.length) {
    parts.push(`**What I work on**\n\n<p>\n  ${d.areas.map((a) => shield(a, c.t.accent)).join("\n  ")}\n</p>`);
  }
  return parts.join("\n\n");
}

function renderSkills(data: unknown, c: Ctx): string {
  const isTechStackConfig =
    data &&
    typeof data === "object" &&
    ("selected" in data || "style" in data);

  if (isTechStackConfig) {
    return generateSkillsMarkdown(data as TechStackConfig);
  }

  const d = data as SkillsSection;
  // If AI generated groups, extract skill ids and generate via generateSkillsMarkdown
  if (d?.groups?.length) {
    const ids: string[] = [];
    for (const group of d.groups) {
      for (const item of group.items) {
        const id = iconId(item);
        if (id && !ids.includes(id)) {
          ids.push(id);
        }
      }
    }
    if (ids.length > 0) {
      return generateSkillsMarkdown({ selected: ids, style: "icons" });
    }
  }

  // Fallback to topLanguages from facts
  if (c.facts.topLanguages && c.facts.topLanguages.length > 0) {
    const ids: string[] = [];
    for (const l of c.facts.topLanguages) {
      const id = iconId(l.name);
      if (id && !ids.includes(id)) {
        ids.push(id);
      }
    }
    if (ids.length > 0) {
      return generateSkillsMarkdown({ selected: ids, style: "icons" });
    }
  }

  // If nothing is selected or detected, generate default sample
  return generateSkillsMarkdown({ selected: [], style: "icons" });
}

function renderProjects(d: ProjectsSection, c: Ctx): string {
  const { facts, t } = c;
  const items: ProjectsSection = d?.length
    ? d
    : facts.topRepos.slice(0, 4).map((r) => ({
        repo: r.name,
        pitch: r.description ?? "",
        highlights: [],
      }));
  if (!items.length) return "";

  const lookup = new Map(facts.topRepos.map((r) => [r.name.toLowerCase(), r]));

  const cell = (p: ProjectsSection[number]) => {
    const repo = lookup.get(p.repo.toLowerCase());
    const name = repo ? repo.name : p.repo;
    const href = httpUrl(repo?.url) ?? `https://github.com/${c.user}/${encodeURIComponent(name)}`;
    const card = `${host(c.opts)}/api/pin/?username=${c.user}&repo=${encodeURIComponent(name)}&hide_border=true&bg_color=${CARD_BG}&title_color=${t.accent}&icon_color=${t.accent}&text_color=${TEXT}`;
    const bullets = (p.highlights ?? []).map((h) => `• ${safe(h)}`).join("<br/>");
    const text = [safe(p.pitch), bullets].filter(Boolean).join("<br/>");
    return `    <td width="50%" valign="top">
      <a href="${href}"><img src="${card}" width="100%" alt="${safe(name)}"/></a>${text ? `\n      <br/>${text}` : ""}
    </td>`;
  };

  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const [a, b] = [items[i], items[i + 1]];
    rows.push(`  <tr>\n${cell(a)}\n${b ? cell(b) : `    <td width="50%"></td>`}\n  </tr>`);
  }

  return `${heading(c, "🚀", "Featured Projects")}\n\n<table>\n${rows.join("\n")}\n</table>`;
}

function renderStats(data: unknown, c: Ctx): string {
  const isStatsConfig =
    data &&
    typeof data === "object" &&
    ("showStats" in data || "showLangs" in data || "showStreak" in data);

  if (isStatsConfig) {
    return generateStatsMarkdown(data as StatsConfig, c.facts.login);
  }

  // Derive from opts.widgets or defaults
  const w = { ...DEFAULT_WIDGETS, ...(c.opts.widgets ?? {}) };
  const statsConfig: StatsConfig = {
    showStats: Boolean(w.stats),
    showLangs: Boolean(w.languages),
    showStreak: Boolean(w.streak),
    theme: "dark",
  };
  return generateStatsMarkdown(statsConfig, c.facts.login);
}

function renderContact(data: unknown, c: Ctx): string {
  const isSocialConfig =
    data &&
    typeof data === "object" &&
    ("linkedin" in data || "x" in data || "portfolio" in data || "email" in data || "extra" in data);

  if (isSocialConfig) {
    return generateContactMarkdown(data as SocialConfig);
  }

  const l = c.opts.links ?? {};
  const cfg: SocialConfig = {
    linkedin: l.linkedin ? normalizeSocialUrl("linkedin", l.linkedin) : "",
    x: l.twitter ? normalizeSocialUrl("x", l.twitter) : "",
    portfolio: c.facts.websiteUrl ? normalizeSocialUrl("portfolio", c.facts.websiteUrl) : "",
    email: l.email && emailOk(l.email) ? l.email : "",
    extra: [],
  };

  return generateContactMarkdown(cfg);
}

/**
 * Format a single section's validated data into deterministic Markdown.
 * Same signature as before, plus an optional `opts` argument.
 */
export function formatSection(
  key: SectionKey,
  data: unknown,
  facts: Facts,
  theme: string = "minimal",
  opts: FormatOptions = {}
): string {
  const id = resolveTheme(theme);
  const c: Ctx = {
    facts,
    t: THEMES[id] as Theme,
    emoji: opts.emoji ?? id !== "mono",
    opts,
    user: encodeURIComponent(facts.login),
  };

  switch (key as string) {
    case "intro":
      return renderIntro(data as IntroSection, c);
    case "about":
      return renderAbout(data as AboutSection, c);
    case "skills":
      return renderSkills(data, c);
    case "projects":
      return renderProjects(data as ProjectsSection, c);
    case "stats":
      return renderStats(data, c);
    case "contact":
      return renderContact(data, c);
    default:
      return "";
  }
}
