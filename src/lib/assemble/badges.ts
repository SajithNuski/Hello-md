/**
 * Mapping of languages & technologies to shields.io parameters
 */
export interface BadgeInfo {
  label: string;
  color: string;
  logo: string;
  logoColor?: string;
}

export const LANGUAGE_BADGE_MAP: Record<string, BadgeInfo> = {
  typescript: { label: "TypeScript", color: "3178C6", logo: "typescript", logoColor: "white" },
  javascript: { label: "JavaScript", color: "F7DF1E", logo: "javascript", logoColor: "black" },
  python: { label: "Python", color: "3776AB", logo: "python", logoColor: "white" },
  rust: { label: "Rust", color: "000000", logo: "rust", logoColor: "white" },
  go: { label: "Go", color: "00ADD8", logo: "go", logoColor: "white" },
  golang: { label: "Go", color: "00ADD8", logo: "go", logoColor: "white" },
  java: { label: "Java", color: "ED8B00", logo: "openjdk", logoColor: "white" },
  c: { label: "C", color: "A8B9CC", logo: "c", logoColor: "black" },
  "c++": { label: "C++", color: "00599C", logo: "cplusplus", logoColor: "white" },
  cpp: { label: "C++", color: "00599C", logo: "cplusplus", logoColor: "white" },
  "c#": { label: "C#", color: "239120", logo: "csharp", logoColor: "white" },
  csharp: { label: "C#", color: "239120", logo: "csharp", logoColor: "white" },
  php: { label: "PHP", color: "777BB4", logo: "php", logoColor: "white" },
  ruby: { label: "Ruby", color: "CC342D", logo: "ruby", logoColor: "white" },
  swift: { label: "Swift", color: "F05138", logo: "swift", logoColor: "white" },
  kotlin: { label: "Kotlin", color: "7F52FF", logo: "kotlin", logoColor: "white" },
  dart: { label: "Dart", color: "0175C2", logo: "dart", logoColor: "white" },
  html: { label: "HTML5", color: "E34F26", logo: "html5", logoColor: "white" },
  css: { label: "CSS3", color: "1572B6", logo: "css3", logoColor: "white" },
  shell: { label: "Shell", color: "89E051", logo: "gnu-bash", logoColor: "black" },
  bash: { label: "Bash", color: "4EAA25", logo: "gnu-bash", logoColor: "white" },
  powershell: { label: "PowerShell", color: "5391FE", logo: "powershell", logoColor: "white" },
  r: { label: "R", color: "276DC3", logo: "r", logoColor: "white" },
  scala: { label: "Scala", color: "DC322F", logo: "scala", logoColor: "white" },
  elixir: { label: "Elixir", color: "4B275F", logo: "elixir", logoColor: "white" },
  haskell: { label: "Haskell", color: "5D4F85", logo: "haskell", logoColor: "white" },
  lua: { label: "Lua", color: "2C2D72", logo: "lua", logoColor: "white" },
  solidity: { label: "Solidity", color: "363636", logo: "solidity", logoColor: "white" },
  react: { label: "React", color: "20232A", logo: "react", logoColor: "61DAFB" },
  "next.js": { label: "Next.js", color: "000000", logo: "nextdotjs", logoColor: "white" },
  nextjs: { label: "Next.js", color: "000000", logo: "nextdotjs", logoColor: "white" },
  vue: { label: "Vue.js", color: "4FC08D", logo: "vuedotjs", logoColor: "white" },
  angular: { label: "Angular", color: "DD0031", logo: "angular", logoColor: "white" },
  svelte: { label: "Svelte", color: "FF3E00", logo: "svelte", logoColor: "white" },
  "node.js": { label: "Node.js", color: "339933", logo: "nodedotjs", logoColor: "white" },
  nodejs: { label: "Node.js", color: "339933", logo: "nodedotjs", logoColor: "white" },
  docker: { label: "Docker", color: "2496ED", logo: "docker", logoColor: "white" },
  kubernetes: { label: "Kubernetes", color: "326CE5", logo: "kubernetes", logoColor: "white" },
  graphql: { label: "GraphQL", color: "E10098", logo: "graphql", logoColor: "white" },
  mongodb: { label: "MongoDB", color: "47A248", logo: "mongodb", logoColor: "white" },
  postgresql: { label: "PostgreSQL", color: "4169E1", logo: "postgresql", logoColor: "white" },
  postgres: { label: "PostgreSQL", color: "4169E1", logo: "postgresql", logoColor: "white" },
  mysql: { label: "MySQL", color: "4479A1", logo: "mysql", logoColor: "white" },
  redis: { label: "Redis", color: "DC382D", logo: "redis", logoColor: "white" },
  tailwind: { label: "TailwindCSS", color: "06B6D4", logo: "tailwindcss", logoColor: "white" },
  linux: { label: "Linux", color: "FCC624", logo: "linux", logoColor: "black" },
  git: { label: "Git", color: "F05032", logo: "git", logoColor: "white" },
};

/**
 * Format badge label according to shields.io requirements
 * Shields.io uses '-' as a separator, so dashes inside labels must be doubled '--'.
 */
function escapeShieldsText(text: string): string {
  return encodeURIComponent(text.replace(/-/g, "--").replace(/_/g, "__"));
}

/**
 * Build shields.io markdown badge
 */
export function buildBadgeMarkdown(
  techName: string,
  style: "flat-square" | "flat" | "for-the-badge" = "flat-square"
): string {
  const cleanKey = techName.trim().toLowerCase();
  const info = LANGUAGE_BADGE_MAP[cleanKey];

  if (info) {
    const label = escapeShieldsText(info.label);
    const color = info.color;
    const logo = encodeURIComponent(info.logo);
    const logoColor = encodeURIComponent(info.logoColor || "white");
    const badgeUrl = `https://img.shields.io/badge/${label}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor}`;
    return `![${info.label}](${badgeUrl})`;
  }

  // Safe fallback for unmapped languages or technologies
  const cleanLabel = techName.trim();
  const escapedLabel = escapeShieldsText(cleanLabel);
  const badgeUrl = `https://img.shields.io/badge/${escapedLabel}-24292e?style=${style}`;
  return `![${cleanLabel}](${badgeUrl})`;
}
