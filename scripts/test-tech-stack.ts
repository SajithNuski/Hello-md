import {
  TECH_CATALOG,
  TECH_CATEGORIES,
  DEFAULT_TECH_STACK_CONFIG,
  generateSkillsMarkdown,
  parseSkillsMarkdown,
  getTechItem,
  TechCategory,
} from "../src/lib/techStackConfig";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log("=== 1. Checking Catalog Requirements ===");

const expectedCategories: Record<string, string[]> = {
  Languages: [
    "js", "ts", "python", "java", "c", "cpp", "cs", "go", "rust", "php",
    "ruby", "kotlin", "swift", "dart", "r", "lua", "bash"
  ],
  Frontend: [
    "html", "css", "sass", "react", "vue", "angular", "svelte", "nextjs",
    "nuxtjs", "tailwind", "bootstrap", "materialui", "redux", "jquery",
    "threejs", "vite", "webpack"
  ],
  Backend: [
    "nodejs", "express", "nestjs", "django", "flask", "fastapi", "spring",
    "laravel", "dotnet", "graphql"
  ],
  Databases: [
    "mongodb", "mysql", "postgres", "sqlite", "redis", "firebase", "supabase", "prisma"
  ],
  DevOps: [
    "docker", "kubernetes", "aws", "azure", "gcp", "vercel", "netlify",
    "heroku", "cloudflare", "nginx", "linux", "githubactions"
  ],
  Tools: [
    "git", "github", "gitlab", "vscode", "postman", "figma", "ai", "ps",
    "npm", "yarn", "jest"
  ],
  "Mobile/AI": [
    "flutter", "androidstudio", "tensorflow", "pytorch"
  ]
};

// Check every required id is present in the catalog with correct category
for (const [category, ids] of Object.entries(expectedCategories)) {
  for (const id of ids) {
    const item = getTechItem(id);
    assert(Boolean(item), `Item "${id}" exists in catalog`);
    assert(item?.category === category, `Item "${id}" has category "${category}" (got "${item?.category}")`);
    assert(Boolean(item?.label), `Item "${id}" has non-empty label "${item?.label}"`);
  }
}

// Check category tabs
const tabIds = TECH_CATEGORIES.map((c) => c.id);
const requiredTabs = ["All", "Languages", "Frontend", "Backend", "Databases", "DevOps", "Tools", "Mobile/AI"];
for (const tab of requiredTabs) {
  assert(tabIds.includes(tab as any), `Tab "${tab}" exists in category tabs`);
}

console.log("\n=== 2. Checking Markdown Output Rules ===");

// Test 2a: Empty selection, style = "icons"
const emptyIconsMd = generateSkillsMarkdown({ selected: [], style: "icons" });
console.log("Empty icons output:\n", emptyIconsMd);
assert(emptyIconsMd.includes("## 🛠️ Tech Stack"), "Includes Tech Stack heading");
assert(emptyIconsMd.includes("<!-- Replace with your own tech stack -->"), "Includes sample comment when empty");
assert(emptyIconsMd.includes('src="https://skillicons.dev/icons?i=js,react,nodejs,mongodb,git&perline=10"'), "Includes sample values js,react,nodejs,mongodb,git with perline=10");
assert(emptyIconsMd.includes('<div align="center">'), "Centered in <div align=\"center\">");

// Test 2b: Empty selection, style = "badges"
const emptyBadgesMd = generateSkillsMarkdown({ selected: [], style: "badges" });
console.log("Empty badges output:\n", emptyBadgesMd);
assert(emptyBadgesMd.includes("## 🛠️ Tech Stack"), "Includes Tech Stack heading");
assert(emptyBadgesMd.includes("<!-- Replace with your own tech stack -->"), "Includes sample comment when empty");
assert(emptyBadgesMd.includes("logo=js"), "Includes sample badge for js");
assert(emptyBadgesMd.includes("logo=react"), "Includes sample badge for react");
assert(emptyBadgesMd.includes("logo=nodejs"), "Includes sample badge for nodejs");
assert(emptyBadgesMd.includes("logo=mongodb"), "Includes sample badge for mongodb");
assert(emptyBadgesMd.includes("logo=git"), "Includes sample badge for git");

// Test 2c: Selected items, style = "icons", preserving order
const customSelection = ["react", "nodejs", "mongodb"];
const customIconsMd = generateSkillsMarkdown({ selected: customSelection, style: "icons" });
console.log("Custom icons output:\n", customIconsMd);
assert(customIconsMd.includes("## 🛠️ Tech Stack"), "Includes Tech Stack heading");
assert(!customIconsMd.includes("<!-- Replace with your own tech stack -->"), "No comment when user selected items");
assert(customIconsMd.includes('src="https://skillicons.dev/icons?i=react,nodejs,mongodb&perline=10"'), "Order react,nodejs,mongodb preserved strictly");

// Test 2d: Final Check: Every selected id appears exactly once, no unselected id appears
const allCatalogIds = TECH_CATALOG.map((i) => i.id);
const unselectedIds = allCatalogIds.filter((id) => !customSelection.includes(id));
for (const id of customSelection) {
  const matches = (customIconsMd.match(new RegExp(id, "g")) || []).length;
  assert(matches === 1, `Selected id "${id}" appears exactly once in output`);
}
for (const id of unselectedIds) {
  // Ensure word boundary or delimiter match
  const appears = customIconsMd.includes(`=${id}&`) || customIconsMd.includes(`,${id},`) || customIconsMd.includes(`,${id}&`) || customIconsMd.includes(`=${id},`);
  assert(!appears, `Unselected id "${id}" does not appear in icons output`);
}

// Test 2e: Selected items, style = "badges", one badge per selected item
const customBadgesMd = generateSkillsMarkdown({ selected: customSelection, style: "badges" });
console.log("Custom badges output:\n", customBadgesMd);
assert(customBadgesMd.includes("## 🛠️ Tech Stack"), "Includes Tech Stack heading");
assert(!customBadgesMd.includes("<!-- Replace with your own tech stack -->"), "No comment when user selected items");
assert(customBadgesMd.includes("![React](https://img.shields.io/badge/React-informational?style=for-the-badge&logo=react&logoColor=white)"), "React badge generated with exact shields.io format");
assert(customBadgesMd.includes("![Node.js](https://img.shields.io/badge/Node.js-informational?style=for-the-badge&logo=nodejs&logoColor=white)"), "Node.js badge generated with exact shields.io format");
assert(customBadgesMd.includes("![MongoDB](https://img.shields.io/badge/MongoDB-informational?style=for-the-badge&logo=mongodb&logoColor=white)"), "MongoDB badge generated with exact shields.io format");

for (const id of customSelection) {
  const matches = (customBadgesMd.match(new RegExp(`logo=${id}&`, "g")) || []).length;
  assert(matches === 1, `Selected id "${id}" badge appears exactly once in badges output`);
}

console.log("\n=== 3. Checking Parser Round-Trip ===");

const parsedIcons = parseSkillsMarkdown(customIconsMd);
assert(JSON.stringify(parsedIcons.selected) === JSON.stringify(customSelection), "Parsed icons selected items match original selection");
assert(parsedIcons.style === "icons", "Parsed icons style is 'icons'");

const parsedBadges = parseSkillsMarkdown(customBadgesMd);
assert(JSON.stringify(parsedBadges.selected) === JSON.stringify(customSelection), "Parsed badges selected items match original selection");
assert(parsedBadges.style === "badges", "Parsed badges style is 'badges'");

const parsedEmptyIcons = parseSkillsMarkdown(emptyIconsMd);
assert(parsedEmptyIcons.selected?.length === 0, "Parsed empty icons returns empty array");

const parsedEmptyBadges = parseSkillsMarkdown(emptyBadgesMd);
assert(parsedEmptyBadges.selected?.length === 0, "Parsed empty badges returns empty array");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
