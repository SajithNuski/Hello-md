export type TechCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "DevOps"
  | "Tools"
  | "Mobile/AI";

export interface TechItem {
  id: string;
  label: string;
  category: TechCategory;
}

export interface TechStackConfig {
  selected: string[];
  style: "icons" | "badges";
}

export const TECH_CATEGORIES: Array<{ id: "All" | TechCategory; label: string }> = [
  { id: "All", label: "All" },
  { id: "Languages", label: "Languages" },
  { id: "Frontend", label: "Frontend" },
  { id: "Backend", label: "Backend" },
  { id: "Databases", label: "Databases" },
  { id: "DevOps", label: "DevOps" },
  { id: "Tools", label: "Tools" },
  { id: "Mobile/AI", label: "Mobile/AI" },
];

export const TECH_CATALOG: TechItem[] = [
  // Languages
  { id: "js", label: "JavaScript", category: "Languages" },
  { id: "ts", label: "TypeScript", category: "Languages" },
  { id: "python", label: "Python", category: "Languages" },
  { id: "java", label: "Java", category: "Languages" },
  { id: "c", label: "C", category: "Languages" },
  { id: "cpp", label: "C++", category: "Languages" },
  { id: "cs", label: "C#", category: "Languages" },
  { id: "go", label: "Go", category: "Languages" },
  { id: "rust", label: "Rust", category: "Languages" },
  { id: "php", label: "PHP", category: "Languages" },
  { id: "ruby", label: "Ruby", category: "Languages" },
  { id: "kotlin", label: "Kotlin", category: "Languages" },
  { id: "swift", label: "Swift", category: "Languages" },
  { id: "dart", label: "Dart", category: "Languages" },
  { id: "r", label: "R", category: "Languages" },
  { id: "lua", label: "Lua", category: "Languages" },
  { id: "bash", label: "Bash", category: "Languages" },

  // Frontend
  { id: "html", label: "HTML5", category: "Frontend" },
  { id: "css", label: "CSS3", category: "Frontend" },
  { id: "sass", label: "Sass", category: "Frontend" },
  { id: "react", label: "React", category: "Frontend" },
  { id: "vue", label: "Vue", category: "Frontend" },
  { id: "angular", label: "Angular", category: "Frontend" },
  { id: "svelte", label: "Svelte", category: "Frontend" },
  { id: "nextjs", label: "Next.js", category: "Frontend" },
  { id: "nuxtjs", label: "Nuxt.js", category: "Frontend" },
  { id: "tailwind", label: "Tailwind CSS", category: "Frontend" },
  { id: "bootstrap", label: "Bootstrap", category: "Frontend" },
  { id: "materialui", label: "Material UI", category: "Frontend" },
  { id: "redux", label: "Redux", category: "Frontend" },
  { id: "jquery", label: "jQuery", category: "Frontend" },
  { id: "threejs", label: "Three.js", category: "Frontend" },
  { id: "vite", label: "Vite", category: "Frontend" },
  { id: "webpack", label: "Webpack", category: "Frontend" },

  // Backend
  { id: "nodejs", label: "Node.js", category: "Backend" },
  { id: "express", label: "Express", category: "Backend" },
  { id: "nestjs", label: "NestJS", category: "Backend" },
  { id: "django", label: "Django", category: "Backend" },
  { id: "flask", label: "Flask", category: "Backend" },
  { id: "fastapi", label: "FastAPI", category: "Backend" },
  { id: "spring", label: "Spring", category: "Backend" },
  { id: "laravel", label: "Laravel", category: "Backend" },
  { id: "dotnet", label: ".NET", category: "Backend" },
  { id: "graphql", label: "GraphQL", category: "Backend" },

  // Databases
  { id: "mongodb", label: "MongoDB", category: "Databases" },
  { id: "mysql", label: "MySQL", category: "Databases" },
  { id: "postgres", label: "PostgreSQL", category: "Databases" },
  { id: "sqlite", label: "SQLite", category: "Databases" },
  { id: "redis", label: "Redis", category: "Databases" },
  { id: "firebase", label: "Firebase", category: "Databases" },
  { id: "supabase", label: "Supabase", category: "Databases" },
  { id: "prisma", label: "Prisma", category: "Databases" },

  // DevOps & Cloud
  { id: "docker", label: "Docker", category: "DevOps" },
  { id: "kubernetes", label: "Kubernetes", category: "DevOps" },
  { id: "aws", label: "AWS", category: "DevOps" },
  { id: "azure", label: "Azure", category: "DevOps" },
  { id: "gcp", label: "Google Cloud", category: "DevOps" },
  { id: "vercel", label: "Vercel", category: "DevOps" },
  { id: "netlify", label: "Netlify", category: "DevOps" },
  { id: "heroku", label: "Heroku", category: "DevOps" },
  { id: "cloudflare", label: "Cloudflare", category: "DevOps" },
  { id: "nginx", label: "Nginx", category: "DevOps" },
  { id: "linux", label: "Linux", category: "DevOps" },
  { id: "githubactions", label: "GitHub Actions", category: "DevOps" },

  // Tools & Design
  { id: "git", label: "Git", category: "Tools" },
  { id: "github", label: "GitHub", category: "Tools" },
  { id: "gitlab", label: "GitLab", category: "Tools" },
  { id: "vscode", label: "VS Code", category: "Tools" },
  { id: "postman", label: "Postman", category: "Tools" },
  { id: "figma", label: "Figma", category: "Tools" },
  { id: "ai", label: "Illustrator", category: "Tools" },
  { id: "ps", label: "Photoshop", category: "Tools" },
  { id: "npm", label: "npm", category: "Tools" },
  { id: "yarn", label: "Yarn", category: "Tools" },
  { id: "jest", label: "Jest", category: "Tools" },

  // Mobile & AI/ML
  { id: "flutter", label: "Flutter", category: "Mobile/AI" },
  { id: "androidstudio", label: "Android Studio", category: "Mobile/AI" },
  { id: "tensorflow", label: "TensorFlow", category: "Mobile/AI" },
  { id: "pytorch", label: "PyTorch", category: "Mobile/AI" },
];

export const TECH_CATALOG_MAP: Record<string, TechItem> = TECH_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, TechItem>
);

export const SAMPLE_TECH_STACK_IDS: string[] = ["js", "react", "nodejs", "mongodb", "git"];

export const DEFAULT_TECH_STACK_CONFIG: TechStackConfig = {
  selected: [],
  style: "icons",
};

export function getDefaultSkillsConfig(): TechStackConfig {
  return {
    selected: [],
    style: "icons",
  };
}

export function getTechItem(id: string): TechItem | undefined {
  return TECH_CATALOG_MAP[id];
}

/**
 * Escape shield label text according to shields.io rules.
 * Dashes inside labels must be doubled '--'.
 */
function escapeShieldLabel(label: string): string {
  return encodeURIComponent(label.replace(/-/g, "--").replace(/_/g, "__"));
}

/**
 * Generate a single shields.io badge markdown string.
 */
export function generateBadgeMarkdown(id: string): string {
  const item = getTechItem(id);
  const label = item ? item.label : id;
  const escapedLabel = escapeShieldLabel(label);
  return `![${label}](https://img.shields.io/badge/${escapedLabel}-informational?style=for-the-badge&logo=${id}&logoColor=white)`;
}

/**
 * Generate deterministic README Markdown for the Tech Stack section.
 *
 * Requirements:
 * - Heading: `## 🛠️ Tech Stack`, centered inside `<div align="center">`
 * - style = "icons": `<img src="https://skillicons.dev/icons?i={{SELECTED_IDS_COMMA_SEPARATED}}&perline=10" />`
 * - style = "badges": one shields.io badge per selected item:
 *   `![Label](https://img.shields.io/badge/Label-informational?style=for-the-badge&logo={{id}}&logoColor=white)`
 * - Keep the user's selection order.
 * - If nothing is selected, fill with SAMPLE values so user can edit later:
 *   `i=js,react,nodejs,mongodb,git` and add comment line: `<!-- Replace with your own tech stack -->`
 * - Every selected id appears exactly once. No unselected id appears.
 */
export function generateSkillsMarkdown(config: TechStackConfig): string {
  // Deduplicate while strictly preserving selection order
  const selected = Array.from(new Set(config.selected || [])).filter(Boolean);
  const style = config.style || "icons";
  const heading = "## 🛠️ Tech Stack";

  if (selected.length === 0) {
    // Fill with SAMPLE values and add warning comment
    const comment = "<!-- Replace with your own tech stack -->";

    if (style === "badges") {
      const sampleBadges = SAMPLE_TECH_STACK_IDS.map((id) => generateBadgeMarkdown(id)).join("\n  ");
      return `${heading}\n\n${comment}\n<div align="center">\n  ${sampleBadges}\n</div>`;
    }

    // Default: style === "icons"
    const sampleIds = SAMPLE_TECH_STACK_IDS.join(",");
    return `${heading}\n\n${comment}\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${sampleIds}&perline=10" />\n</div>`;
  }

  // Active user selection
  if (style === "badges") {
    const badges = selected.map((id) => generateBadgeMarkdown(id)).join("\n  ");
    return `${heading}\n\n<div align="center">\n  ${badges}\n</div>`;
  }

  // style === "icons"
  const idsParam = selected.join(",");
  return `${heading}\n\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${idsParam}&perline=10" />\n</div>`;
}

/**
 * Parse existing markdown back into TechStackConfig.
 */
export function parseSkillsMarkdown(markdown: string): Partial<TechStackConfig> {
  if (!markdown) {
    return { selected: [], style: "icons" };
  }

  const isSampleComment = markdown.includes("<!-- Replace with your own tech stack -->");

  // Check for skillicons URL
  const skilliconsMatch = markdown.match(/skillicons\.dev\/icons\?[^"'\s]*i=([a-zA-Z0-9,]+)/i);
  if (skilliconsMatch) {
    const ids = skilliconsMatch[1]
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => Boolean(s) && (s in TECH_CATALOG_MAP || true));

    return {
      selected: isSampleComment ? [] : Array.from(new Set(ids)),
      style: "icons",
    };
  }

  // Check for shields.io badges
  const badgeRegex = /!\[([^\]]*)\]\(https:\/\/img\.shields\.io\/badge\/[^)]*logo=([a-zA-Z0-9_-]+)[^)]*\)/gi;
  const matchedBadges: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = badgeRegex.exec(markdown)) !== null) {
    if (match[2]) {
      matchedBadges.push(match[2].toLowerCase());
    }
  }

  if (matchedBadges.length > 0) {
    return {
      selected: isSampleComment ? [] : Array.from(new Set(matchedBadges)),
      style: "badges",
    };
  }

  return {
    selected: [],
    style: "icons",
  };
}
