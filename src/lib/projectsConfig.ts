import { ProjectCardItem } from "@/components/editor/ProjectsSectionControls";

/**
 * Default sample projects when none are specified.
 */
export function getDefaultProjectsConfig(username: string = ""): ProjectCardItem[] {
  void username;
  return [
    {
      repo: "developer-portfolio",
      pitch: "A modern, minimalist developer portfolio built with React and Tailwind CSS.",
      highlights: ["Lighthouse score 100", "Dark and light theme support"],
    },
    {
      repo: "api-service",
      pitch: "High throughput microservice architecture built with Node.js and TypeScript.",
      highlights: ["Sub-10ms response latency", "Comprehensive test coverage"],
    },
  ];
}

/**
 * Generate GitHub pinned cards table markdown for featured projects.
 */
export function generateProjectsMarkdown(
  projects: ProjectCardItem[],
  username: string = "user"
): string {
  const items = projects.slice(0, 4);
  if (!items.length) return "";

  const host =
    process.env.NEXT_PUBLIC_STATS_HOST || "https://github-readme-stats.vercel.app";
  const user = encodeURIComponent(username || "user");
  const CARD_BG = "0D1117";
  const ACCENT = "C5F467";
  const TEXT = "C9D1D9";

  const cell = (p: ProjectCardItem) => {
    const name = p.repo;
    const href = `https://github.com/${user}/${encodeURIComponent(name)}`;
    const card = `${host}/api/pin/?username=${user}&repo=${encodeURIComponent(
      name
    )}&hide_border=true&bg_color=${CARD_BG}&title_color=${ACCENT}&icon_color=${ACCENT}&text_color=${TEXT}`;
    const bullets = (p.highlights ?? []).map((h) => `• ${h}`).join("<br/>");
    const text = [p.pitch, bullets].filter(Boolean).join("<br/>");
    return `    <td width="50%" valign="top">\n      <a href="${href}"><img src="${card}" width="100%" alt="${name}"/></a>${
      text ? `\n      <br/>${text}` : ""
    }\n    </td>`;
  };

  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const [a, b] = [items[i], items[i + 1]];
    rows.push(
      `  <tr>\n${cell(a)}\n${b ? cell(b) : `    <td width="50%"></td>`}\n  </tr>`
    );
  }

  return `## 🚀 Featured Projects\n\n<table>\n${rows.join("\n")}\n</table>`;
}

/**
 * Parse existing projects markdown back into project items.
 */
export function parseProjectsMarkdown(markdown: string): ProjectCardItem[] {
  if (!markdown) return [];

  const items: ProjectCardItem[] = [];
  // Match table cells containing repo links and descriptions
  const cellRegex = /<td[^>]*>[\s\S]*?<a\s+href="[^"]*\/([^"/]+)"[\s\S]*?(?:<br\/>([\s\S]*?))?<\/td>/gi;
  let match: RegExpExecArray | null;

  while ((match = cellRegex.exec(markdown)) !== null) {
    const repo = match[1]?.trim();
    const rawContent = match[2] || "";
    if (repo && !repo.includes("width=")) {
      const parts = rawContent.split("<br/>").map((s) => s.trim()).filter(Boolean);
      const pitch = parts[0]?.replace(/^•\s*/, "") || "";
      const highlights = parts
        .slice(1)
        .map((h) => h.replace(/^•\s*/, "").trim())
        .filter(Boolean);

      items.push({
        repo,
        pitch,
        highlights,
      });
    }
  }

  return items;
}
