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

function renderSkills(d: SkillsSection, c: Ctx): string {
  const groups = d.groups?.length
    ? d.groups
    : c.facts.topLanguages.length
      ? [{ title: "Languages", items: c.facts.topLanguages.map((l) => l.name) }]
      : [];

  const blocks = groups
    .filter((g) => g.items.length)
    .map((g) => {
      const icons = Array.from(new Set(g.items.map(iconId).filter(Boolean) as string[]));
      const rest = g.items.filter((i) => !iconId(i));
      // No blank lines inside the <p>: a blank line ends the HTML block on GitHub.
      const inner = [
        icons.length
          ? `<img src="https://skillicons.dev/icons?i=${icons.join(",")}&theme=dark" alt="${safe(g.title)}"/>`
          : "",
        ...rest.map((i) => shield(i, c.t.accent)),
      ]
        .filter(Boolean)
        .join("\n  ");
      return `**${safe(g.title)}**\n\n<p>\n  ${inner}\n</p>`;
    });

  if (!blocks.length) return "";
  return `${heading(c, "🛠️", "Tech Stack")}\n\n${blocks.join("\n\n")}`;
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

function renderStats(c: Ctx): string {
  const { t, opts } = c;
  const w = { ...DEFAULT_WIDGETS, ...(opts.widgets ?? {}) };
  const colors = `hide_border=true&bg_color=${CARD_BG}&title_color=${t.accent}&icon_color=${t.accent}&text_color=${TEXT}&ring_color=${t.accent}`;
  const parts: string[] = [];

  const row: string[] = [];
  if (w.stats) row.push(`<img height="170" src="${host(opts)}/api?username=${c.user}&show_icons=true&${colors}" alt="GitHub stats"/>`);
  if (w.languages) row.push(`<img height="170" src="${host(opts)}/api/top-langs/?username=${c.user}&layout=compact&${colors}" alt="Top languages"/>`);
  if (row.length) parts.push(`<p align="center">\n  ${row.join("\n  ")}\n</p>`);

  if (w.streak)
    parts.push(`<p align="center">\n  <img src="https://streak-stats.demolab.com/?user=${c.user}&theme=dark&hide_border=true&background=${CARD_BG}&ring=${t.accent}&fire=${t.accent}&currStreakLabel=${t.accent}" alt="Streak"/>\n</p>`);
  if (w.activity)
    parts.push(`<p align="center">\n  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${c.user}&bg_color=${CARD_BG}&color=${t.accent}&line=${t.accent}&point=ffffff&area=true&hide_border=true" width="100%" alt="Contribution graph"/>\n</p>`);
  if (w.trophies)
    parts.push(`<p align="center">\n  <img src="https://github-profile-trophy.vercel.app/?username=${c.user}&theme=darkhub&no-frame=true&no-bg=true&margin-w=8&column=7" alt="Trophies"/>\n</p>`);

  if (!parts.length) return "";
  return `${heading(c, "📊", "GitHub Analytics")}\n\n${parts.join("\n\n")}`;
}

function renderContact(d: ContactSection, c: Ctx): string {
  const { facts, t, opts } = c;
  const l = opts.links ?? {};
  const btn = (label: string, href: string, logo: string, color: string) =>
    `  <a href="${href}"><img src="https://img.shields.io/badge/${label}-${color}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${label}"/></a>`;

  const site = httpUrl(facts.websiteUrl);
  const linkedin = httpUrl(l.linkedin);
  const twitter = httpUrl(l.twitter);
  const fiverr = httpUrl(l.fiverr);
  const email = emailOk(l.email);

  const buttons = [
    btn("GitHub", `https://github.com/${c.user}`, "github", "181717"),
    site && btn("Website", site, "googlechrome", t.accent),
    linkedin && btn("LinkedIn", linkedin, "linkedin", "0A66C2"),
    fiverr && btn("Fiverr", fiverr, "fiverr", "1DBF73"),
    twitter && btn("X", twitter, "x", "000000"),
    email && btn("Email", `mailto:${email}`, "gmail", "EA4335"),
  ].filter(Boolean);

  const closing = safe(d.closing);
  const location = facts.location
    ? `${c.emoji ? "📍 " : "Location: "}${safe(facts.location)}`
    : "";
  const footerImg =
    t.header === "wave"
      ? `<img src="https://capsule-render.vercel.app/api?type=waving&color=0:${t.to},100:${t.from}&height=90&section=footer" width="100%" alt=""/>`
      : "";
  const extras = [location, footerImg].filter(Boolean).join("\n\n");

  return `${heading(c, "🤝", "Connect With Me")}

<div align="center">
${closing ? `\n${closing}\n` : ""}
<p>
${buttons.join("\n")}
</p>
${extras ? `\n${extras}\n` : ""}
</div>`;
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
      return renderSkills(data as SkillsSection, c);
    case "projects":
      return renderProjects(data as ProjectsSection, c);
    case "stats":
      return renderStats(c);
    case "contact":
      return renderContact(data as ContactSection, c);
    default:
      return "";
  }
}
