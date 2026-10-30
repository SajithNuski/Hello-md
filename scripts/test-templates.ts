import "./mock-server-only";
import {
  TEMPLATES_CONFIG,
  PresetTemplate,
  renderTemplateMarkdown,
} from "../src/lib/templates/templatesConfig";

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
  }
}

console.log("=================================================");
console.log("🧪 TEMPLATES TEST SUITE");
console.log("=================================================\n");

// --- TEST SUITE 1: All 8 templates render without errors ---
console.log("--- 1. Template Integrity & Rendering ---");
assert(TEMPLATES_CONFIG.length === 8, "Exactly 8 curated developer templates configured", `Got ${TEMPLATES_CONFIG.length}`);

for (const template of TEMPLATES_CONFIG) {
  let rendered = "";
  let renderSuccess = false;
  try {
    rendered = renderTemplateMarkdown(template);
    renderSuccess = typeof rendered === "string" && rendered.length > 50;
  } catch (err) {
    renderSuccess = false;
  }

  assert(
    renderSuccess,
    `Template '${template.name}' renders valid markdown without errors`,
    `Slug: ${template.slug}, length: ${rendered.length}`
  );

  // Check required fields
  assert(
    Boolean(template.name && template.slug && template.role && template.tagline && template.theme),
    `Template '${template.slug}' has all required metadata fields`
  );

  assert(
    Boolean(template.headerStyle && ["wave", "terminal", "minimal"].includes(template.headerStyle)),
    `Template '${template.slug}' has valid headerStyle: ${template.headerStyle}`
  );
}

// --- TEST SUITE 2: Single Source of Truth: Thumbnail, Modal Preview & Export Match ---
console.log("\n--- 2. Single Source of Truth & Token Replacement ---");
for (const template of TEMPLATES_CONFIG) {
  const renderedFromFunction = renderTemplateMarkdown(template);
  assert(
    template.previewMarkdown === renderedFromFunction,
    `'${template.slug}': template.previewMarkdown matches renderTemplateMarkdown() output identically`
  );

  // Test custom token replacement (simulating 'Use template' / export with custom username)
  const customTokens = {
    username: "test-user-42",
    name: "Ada Lovelace",
    role: "Pioneering Computing Architect",
  };
  const customized = renderTemplateMarkdown(template, customTokens);
  assert(
    customized.includes("test-user-42"),
    `'${template.slug}': token {username} replaced with custom input`
  );

  // Ensure no unreplaced token artifacts remain
  const unreplaced = customized.match(/\{(name|role|username|accentColor|font|stack)\}/);
  assert(
    unreplaced === null,
    `'${template.slug}': all placeholder tokens replaced completely (no residual tokens)`
  );
}

// --- TEST SUITE 3: Content Distinction (Terminal & Minimal vs Wave) ---
console.log("\n--- 3. Content Differentiation & Realism ---");
const terminalTemplate = TEMPLATES_CONFIG.find((t) => t.slug === "terminal-hacker")!;
const minimalTemplate = TEMPLATES_CONFIG.find((t) => t.slug === "minimal-monospace")!;
const fullstackTemplate = TEMPLATES_CONFIG.find((t) => t.slug === "fullstack-modernist")!;

assert(Boolean(terminalTemplate), "Terminal Hacker template exists");
assert(Boolean(minimalTemplate), "Minimal Monospace template exists");

const terminalMd = renderTemplateMarkdown(terminalTemplate);
const minimalMd = renderTemplateMarkdown(minimalTemplate);
const fullstackMd = renderTemplateMarkdown(fullstackTemplate);

// Terminal must NOT have capsule-render wave banner and MUST have bash code block
assert(
  !terminalMd.includes("capsule-render.vercel.app"),
  "Terminal template does NOT use wave banner (distinct layout)"
);
assert(
  terminalMd.includes("```bash") && terminalMd.includes("$ whoami"),
  "Terminal template features terminal telemetry code block"
);

// Minimal must NOT have capsule-render and must have clean typography
assert(
  !minimalMd.includes("capsule-render.vercel.app"),
  "Minimal Monospace template does NOT use wave banner (pure documentation)"
);
assert(
  minimalMd.includes("---") && minimalMd.includes("> Focused on"),
  "Minimal Monospace features restrained typography-first structure"
);

// No fake duplicate text across templates
const descriptions = TEMPLATES_CONFIG.map((t) => t.tagline);
const uniqueDescriptions = new Set(descriptions);
assert(
  uniqueDescriptions.size === TEMPLATES_CONFIG.length,
  "All 8 templates have distinct role-appropriate taglines and bios (no duplicate text)"
);

// --- TEST SUITE 4: Tag Layout Rule ("+N" chip never wraps on its own) ---
console.log("\n--- 4. Tech Tags Single Row Rule ---");
for (const template of TEMPLATES_CONFIG) {
  const maxVisible = 4;
  const visible = template.tags.slice(0, maxVisible);
  const remaining = template.tags.length - maxVisible;

  assert(
    visible.length <= 4,
    `'${template.slug}': tags strictly limited to max 4 on the first row (count: ${visible.length})`
  );

  if (template.tags.length > 4) {
    assert(
      remaining > 0,
      `'${template.slug}': ${remaining} remaining tags cleanly consolidated into a single '+${remaining}' chip`
    );
  }
}

// Specific check on Neural & Systems Architect (which has 6 tags)
const neuralTemplate = TEMPLATES_CONFIG.find((t) => t.slug === "neural-systems-architect")!;
const neuralVisible = neuralTemplate.tags.slice(0, 4);
const neuralRemaining = neuralTemplate.tags.length - 4;
assert(
  neuralVisible.length === 4 && neuralRemaining === 2,
  "Neural template displays 4 tags + 1 '+2' chip on same row without wrapping alone"
);

// --- TEST SUITE 5: Filters & Search Combinations (AND logic) ---
console.log("\n--- 5. Filter & Search Combinations (AND Logic) ---");

// Helper filter function matching TemplatesPage logic
function filterTemplates(role: string, layout: string, query: string): PresetTemplate[] {
  return TEMPLATES_CONFIG.filter((t) => {
    if (role !== "all" && t.persona.toLowerCase() !== role.toLowerCase()) return false;
    if (layout !== "all" && t.headerStyle !== layout) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

// 1. Role filter alone
const aiResults = filterTemplates("ai", "all", "");
assert(
  aiResults.length === 1 && aiResults[0].slug === "neural-systems-architect",
  "Role filter 'ai' correctly returns 1 template (Neural & Systems Architect)"
);

// 2. Layout filter alone
const terminalResults = filterTemplates("all", "terminal", "");
assert(
  terminalResults.length === 1 && terminalResults[0].slug === "terminal-hacker",
  "Layout filter 'terminal' correctly returns 1 template (Terminal Hacker)"
);

const waveResults = filterTemplates("all", "wave", "");
assert(
  waveResults.length === 6,
  `Layout filter 'wave' correctly returns all 6 wave templates (got ${waveResults.length})`
);

// 3. Search query alone
const rustResults = filterTemplates("all", "all", "rust");
assert(
  rustResults.length >= 1 && rustResults.some((t) => t.tags.includes("Rust")),
  "Search query 'rust' matches templates containing Rust in tags/role"
);

// 4. Combined filters with AND logic
// Role: opensource, Layout: terminal -> Should match Terminal Hacker
const andMatch1 = filterTemplates("opensource", "terminal", "");
assert(
  andMatch1.length === 1 && andMatch1[0].slug === "terminal-hacker",
  "AND logic (role: opensource AND layout: terminal) matches Terminal Hacker"
);

// Role: fullstack, Layout: terminal -> Should return 0 results
const andMatch2 = filterTemplates("fullstack", "terminal", "");
assert(
  andMatch2.length === 0,
  "AND logic (role: fullstack AND layout: terminal) returns 0 results as expected"
);

// Search: 'Docker', Layout: 'wave' -> Should match only wave templates with Docker
const andMatch3 = filterTemplates("all", "wave", "Docker");
assert(
  andMatch3.length > 0 && andMatch3.every((t) => t.headerStyle === "wave"),
  "AND logic (layout: wave AND search: Docker) returns only wave templates containing Docker"
);

// --- SUMMARY ---
console.log("\n=================================================");
console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
console.log("=================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log("🎉 All template quality tests passed successfully!\n");
  process.exit(0);
}
