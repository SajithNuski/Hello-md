import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";
import {
  IntroSection,
  AboutSection,
  ProjectsSection,
} from "../ai/schema";
import { THEMES, type Theme, type ThemeId } from "./themes";
import { StatsConfig, generateStatsMarkdown } from "../statsConfig";
import {
  SocialConfig,
  generateContactMarkdown,
  normalizeSocialUrl,
} from "../socialConfig";
import {
  TechStackConfig,
  generateSkillsMarkdown,
  getDefaultSkillsConfig,
  TECH_CATALOG,
} from "../techStackConfig";
import {
  AboutConfig,
  generateAboutMarkdown,
  getDefaultAboutConfig,
} from "../aboutConfig";
import { Tone, resolveTone } from "../toneConfig";

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
  tone?: Tone;
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

export const shield = (item: string, accent: string) => {
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

function renderAbout(data: unknown, c: Ctx): string {
  if (data && typeof data === "object" && "style" in data) {
    return generateAboutMarkdown(data as AboutConfig);
  }

  const tone = resolveTone(c.opts.tone);
  const cfg = getDefaultAboutConfig(c.facts.login, c.facts, tone);

  const aboutSec = data as AboutSection | null;
  if (aboutSec && typeof aboutSec === "object") {
    if (aboutSec.areas && Array.isArray(aboutSec.areas) && aboutSec.areas.length > 0) {
      cfg.focus = aboutSec.areas.map(safe).filter(Boolean);
    }
  }

  return generateAboutMarkdown(cfg);
}

function renderSkills(data: unknown, c: Ctx): string {
  const isTechStackConfig =
    data &&
    typeof data === "object" &&
    ("selected" in data || "style" in data);

  if (isTechStackConfig) {
    return generateSkillsMarkdown(data as TechStackConfig);
  }

  // If data has legacy groups or facts has topLanguages, map them to catalog IDs
  const legacyItems: string[] = [];
  const maybeLegacy = data as { groups?: { items?: string[] }[] } | null;
  if (maybeLegacy && typeof maybeLegacy === "object" && "groups" in maybeLegacy && Array.isArray(maybeLegacy.groups)) {
    for (const g of maybeLegacy.groups) {
      if (Array.isArray(g.items)) {
        legacyItems.push(...g.items);
      }
    }
  } else if (c.facts.topLanguages.length) {
    legacyItems.push(...c.facts.topLanguages.map((l) => l.name));
  }

  const selected = legacyItems
    .map((item) => {
      const match = TECH_CATALOG.find(
        (t) => t.id.toLowerCase() === item.toLowerCase() || t.label.toLowerCase() === item.toLowerCase()
      );
      return match ? match.id : null;
    })
    .filter(Boolean) as string[];

  if (selected.length > 0) {
    return generateSkillsMarkdown({
      selected,
      style: "icons",
    });
  }

  return generateSkillsMarkdown(getDefaultSkillsConfig());
}

function renderProjects(d: ProjectsSection, c: Ctx): string {
  const { facts, t } = c;
  const rawItems = d?.length
    ? d
    : facts.topRepos.map((r) => ({
      repo: r.name,
      pitch: r.description ?? "",
      highlights: [],
    }));
  const items: ProjectsSection = rawItems.slice(0, 4);
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
      return renderAbout(data, c);
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
