export interface StatsConfig {
  showStats: boolean;
  showLangs: boolean;
  showStreak: boolean;
  theme: string;
}

export const DEFAULT_STATS_CONFIG: StatsConfig = {
  showStats: true,
  showLangs: true,
  showStreak: true,
  theme: "dark",
};

export interface StatsThemeOption {
  id: string;
  name: string;
  bg: string;
  accent: string;
}

export const STATS_THEMES: StatsThemeOption[] = [
  { id: "dark", name: "Dark", bg: "#0d1117", accent: "#58a6ff" },
  { id: "radical", name: "Radical", bg: "#141321", accent: "#fe428e" },
  { id: "tokyonight", name: "Tokyo Night", bg: "#1a1b26", accent: "#7aa2f7" },
  { id: "dracula", name: "Dracula", bg: "#282a36", accent: "#ff79c6" },
  { id: "onedark", name: "One Dark", bg: "#282c34", accent: "#e06c75" },
  { id: "gruvbox", name: "Gruvbox", bg: "#282828", accent: "#fabd2f" },
  { id: "synthwave", name: "Synthwave", bg: "#2b213a", accent: "#e2e9c0" },
  { id: "monokai", name: "Monokai", bg: "#272822", accent: "#eb1f6a" },
  { id: "cobalt", name: "Cobalt", bg: "#193549", accent: "#ffc600" },
  { id: "nightowl", name: "Night Owl", bg: "#011627", accent: "#c792ea" },
  { id: "highcontrast", name: "High Contrast", bg: "#000000", accent: "#00ffff" },
  { id: "prussian", name: "Prussian", bg: "#17202a", accent: "#3ddc84" },
];

/**
 * Returns default configuration for GitHub Analytics cards.
 * Ensures strict grounding: uses ONLY the provided username.
 */
export function getDefaultStatsConfig(username: string = ""): StatsConfig {
  return {
    showStats: true,
    showLangs: true,
    showStreak: true,
    theme: "dark",
  };
}

/**
 * Generates the deterministic Markdown/HTML for the GitHub Analytics section.
 *
 * Layout rules:
 * - Heading: `## 📊 GitHub Analytics`
 * - Wrap enabled cards in `<div align="center">`.
 * - If Stats and Languages are both enabled, place them side by side using a two-cell HTML table;
 *   the Streak card goes below, full width.
 * - If only one card is enabled, center it alone.
 * - If none are enabled, omit the whole section (returns empty string "").
 * - Use ONLY {{USERNAME}} in every URL.
 * - Do not add, remove, or reorder cards beyond what is enabled.
 */
export function generateStatsMarkdown(
  config: StatsConfig,
  username: string
): string {
  const user = (username || "username").trim();
  const theme = (config.theme || "dark").trim();
  const { showStats, showLangs, showStreak } = config;

  // If none are enabled, omit the whole section (no heading)
  if (!showStats && !showLangs && !showStreak) {
    return "";
  }

  // Exact card URLs as per specification
  const statsImg = `<img src="https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=${theme}" alt="GitHub Stats" />`;
  const langsImg = `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&theme=${theme}" alt="Top Languages" />`;
  const streakImg = `<img src="https://streak-stats.demolab.com/?user=${user}&theme=${theme}" alt="GitHub Streak" />`;

  const heading = "## 📊 GitHub Analytics";

  // Case 1: Both Stats and Languages are enabled
  if (showStats && showLangs) {
    const tableHtml = `  <table>\n    <tr>\n      <td>\n        ${statsImg}\n      </td>\n      <td>\n        ${langsImg}\n      </td>\n    </tr>\n  </table>`;

    if (showStreak) {
      // Streak card goes below
      return `${heading}\n\n<div align="center">\n${tableHtml}\n  ${streakImg}\n</div>`;
    }
    return `${heading}\n\n<div align="center">\n${tableHtml}\n</div>`;
  }

  // Case 2: Stats and Streak are enabled (Languages disabled)
  if (showStats && showStreak) {
    return `${heading}\n\n<div align="center">\n  ${statsImg}\n  <br/>\n  ${streakImg}\n</div>`;
  }

  // Case 3: Languages and Streak are enabled (Stats disabled)
  if (showLangs && showStreak) {
    return `${heading}\n\n<div align="center">\n  ${langsImg}\n  <br/>\n  ${streakImg}\n</div>`;
  }

  // Case 4: Only one card enabled (center it alone)
  if (showStats) {
    return `${heading}\n\n<div align="center">\n  ${statsImg}\n</div>`;
  }

  if (showLangs) {
    return `${heading}\n\n<div align="center">\n  ${langsImg}\n</div>`;
  }

  if (showStreak) {
    return `${heading}\n\n<div align="center">\n  ${streakImg}\n</div>`;
  }

  return "";
}

/**
 * Parses existing markdown to extract active card toggles and theme.
 * Supports both standard HTML `<img ...>` and markdown `![...]` syntax.
 */
export function parseStatsMarkdown(markdown: string): Partial<StatsConfig> {
  if (!markdown || !markdown.includes("GitHub Analytics")) {
    return {
      showStats: false,
      showLangs: false,
      showStreak: false,
    };
  }

  const hasStats =
    markdown.includes("github-readme-stats.vercel.app/api?") ||
    markdown.includes("alt=\"GitHub Stats\"") ||
    markdown.includes("![GitHub Stats]");

  const hasLangs =
    markdown.includes("github-readme-stats.vercel.app/api/top-langs") ||
    markdown.includes("alt=\"Top Languages\"") ||
    markdown.includes("![Top Languages]");

  const hasStreak =
    markdown.includes("streak-stats.demolab.com") ||
    markdown.includes("alt=\"GitHub Streak\"") ||
    markdown.includes("![GitHub Streak]");

  const themeMatch = markdown.match(/theme=([a-zA-Z0-9_-]+)/);
  const theme = themeMatch ? themeMatch[1] : undefined;

  return {
    showStats: hasStats,
    showLangs: hasLangs,
    showStreak: hasStreak,
    ...(theme ? { theme } : {}),
  };
}
