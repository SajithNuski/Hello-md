import assert from "assert";
import {
  AboutConfig,
  DEFAULT_ABOUT_CONFIG,
  generateHacker,
  generatePlayful,
  generateProfessional,
  generateMinimal,
  generateAboutMarkdown,
  sanitize,
} from "../src/lib/aboutConfig";

console.log("🚀 Running unit tests for About Me section generator...\n");

// Helper to check for undefined or dangling labels
function assertNoArtifacts(output: string, style: string) {
  assert(!output.includes("undefined"), `[${style}] Should not contain "undefined"`);
  assert(!output.includes("null"), `[${style}] Should not contain "null"`);
  assert(!output.includes("NaN"), `[${style}] Should not contain "NaN"`);
  assert(!output.includes("[object Object]"), `[${style}] Should not contain "[object Object]"`);
  assert(!output.includes("[]"), `[${style}] Should not contain empty brackets`);
}

// -----------------------------------------------------------------
// Test 1: Reference Default Data generates cleanly for all 4 styles
// -----------------------------------------------------------------
console.log("Test 1: Default reference data generation");
const styles: AboutConfig["style"][] = ["hacker", "playful", "professional", "minimal"];

styles.forEach((style) => {
  const config: AboutConfig = { ...DEFAULT_ABOUT_CONFIG, style };
  const md = generateAboutMarkdown(config);
  assertNoArtifacts(md, style);
  assert(md.length > 50, `[${style}] Should produce substantive output`);
  // Verify typo fix
  assert(!md.includes("AI Ingineer"), `[${style}] Must not contain typo "AI Ingineer"`);
  if (style !== "minimal") {
    assert(md.includes("AI Engineer"), `[${style}] Must contain corrected "AI Engineer"`);
  }
});
console.log("✅ Passed Test 1: Default reference data");

// -----------------------------------------------------------------
// Test 2: Hacker reference matches specifications
// -----------------------------------------------------------------
console.log("\nTest 2: Hacker style exact structure");
const hackerMd = generateHacker(DEFAULT_ABOUT_CONFIG);
assert(hackerMd.includes("const sajith = {"), "Hacker must declare 'const sajith = {'");
assert(hackerMd.includes("name     : \"Sajith Nuski\","), "Hacker must align colons for name");
assert(hackerMd.includes("freelance: \"Fiverr Level 2 Seller ⭐\","), "Hacker must include freelance with colon alignment");
assert(hackerMd.includes("stack    : [\"React\", \"Node.js\", \"Python\", \"MongoDB\", \"Firebase\"],"), "Hacker must format stack array");
assert(hackerMd.includes("focus    : [\"AI Engineer\", \"Cloud Deployment\", \"Scalable Systems\", \"SaaS Applications\"],"), "Hacker must format focus array");
assert(hackerMd.includes("🔭&nbsp; Check out my [Portfolio](https://sajithnuski.is-a.dev)"), "Hacker must format portfolio bullet with &nbsp;");
assert(hackerMd.includes("📫&nbsp; Let's connect on [LinkedIn](https://linkedin.com/in/sajithnuski)"), "Hacker must format LinkedIn bullet with &nbsp;");
console.log("✅ Passed Test 2: Hacker exact structure");

// -----------------------------------------------------------------
// Test 3: Empty fields handling
// -----------------------------------------------------------------
console.log("\nTest 3: Empty fields handling");
const emptyConfig: AboutConfig = {
  name: "",
  role: "",
  education: "",
  freelance: "",
  stack: [],
  focus: [],
  portfolio: "",
  linkedin: "",
  status: "",
  currentlyLearning: "",
  gifEnabled: false,
  gifUrl: "",
  gifWidth: 300,
  style: "hacker",
  emoji: true,
};

styles.forEach((style) => {
  const cfg = { ...emptyConfig, style };
  const md = generateAboutMarkdown(cfg);
  assertNoArtifacts(md, style);
  assert(!md.includes("undefined"), `[${style}] Empty fields must not produce 'undefined'`);
  assert(!md.includes("null"), `[${style}] Empty fields must not produce 'null'`);
  assert(!md.includes("[]"), `[${style}] Empty fields must not produce empty brackets '[]'`);
  assert(!md.includes("http"), `[${style}] Empty fields must not output empty links`);
});
console.log("✅ Passed Test 3: Empty fields handling");

// -----------------------------------------------------------------
// Test 4: Special Characters Escaping (|, *, _, `, <, ", \)
// -----------------------------------------------------------------
console.log("\nTest 4: Special characters escaping");
const specialConfig: AboutConfig = {
  ...DEFAULT_ABOUT_CONFIG,
  name: 'Dev "The Hacker" \\ Test',
  role: "Full-Stack | Cloud * Special _ Snake `Code` <tag>",
  education: "Uni | Department * Honors _ Track <Degree>",
  freelance: "Top * Seller | 100% _ Rated <Verified>",
  stack: ['C++ | "OOP"', "Node_js * Fast", "<TypeScript>"],
  focus: ['AI & "Cloud"', "Scalable | Systems"],
  status: "Looking for * Internships | Open <2026>",
};

styles.forEach((style) => {
  const cfg = { ...specialConfig, style };
  const md = generateAboutMarkdown(cfg);
  assertNoArtifacts(md, style);

  if (style === "professional") {
    // In professional tables, unescaped pipes break the table columns
    const lines = md.split("\n");
    const tableLines = lines.filter((l) => l.startsWith("|"));
    tableLines.forEach((l) => {
      // If there are pipes in values, they must be escaped as \|
      const innerPipes = l.slice(1, -1).split("\\|").join("");
      // There should only be 1 unescaped column divider pipe inside
      const dividerCount = (innerPipes.match(/\|/g) || []).length;
      assert.strictEqual(dividerCount, 1, `Table row must maintain exactly 2 columns: ${l}`);
    });
  }

  if (style === "hacker") {
    // In TS block, double quotes must be escaped as \" and backslashes as \\
    const tsBlock = md.slice(md.indexOf("```ts"), md.indexOf("```", md.indexOf("```ts") + 4));
    assert(!tsBlock.includes('"The Hacker"'), "Quotes inside code block must be escaped");
    assert(tsBlock.includes('\\"The Hacker\\"'), "Quotes inside code block must be \\\"");
  }
});
console.log("✅ Passed Test 4: Special characters escaping");

// -----------------------------------------------------------------
// Test 5: Single-item stack vs Very long stack list
// -----------------------------------------------------------------
console.log("\nTest 5: Single-item stack & Very long stack list");
const singleStackConfig: AboutConfig = {
  ...DEFAULT_ABOUT_CONFIG,
  stack: ["TypeScript"],
};

styles.forEach((style) => {
  const md = generateAboutMarkdown({ ...singleStackConfig, style });
  assertNoArtifacts(md, style);
  assert(md.includes("TypeScript"), `[${style}] Should include TypeScript`);
});

const longStackConfig: AboutConfig = {
  ...DEFAULT_ABOUT_CONFIG,
  stack: [
    "TypeScript", "JavaScript", "React", "Next.js", "Vue.js", "Node.js",
    "Express", "Python", "FastAPI", "Django", "Java", "Spring Boot",
    "Go", "Rust", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes",
    "AWS", "GCP", "GraphQL", "TailwindCSS"
  ],
};

styles.forEach((style) => {
  const md = generateAboutMarkdown({ ...longStackConfig, style });
  assertNoArtifacts(md, style);
  assert(md.includes("Kubernetes"), `[${style}] Should include Kubernetes in long stack`);
  assert(md.includes("TailwindCSS"), `[${style}] Should include TailwindCSS in long stack`);
});
console.log("✅ Passed Test 5: Single-item & Long stack");

// -----------------------------------------------------------------
// Test 6: GIF on / off
// -----------------------------------------------------------------
console.log("\nTest 6: GIF on / off");
const gifUrl = "https://media.giphy.com/media/test/giphy.gif";

// GIF ON
styles.forEach((style) => {
  const md = generateAboutMarkdown({
    ...DEFAULT_ABOUT_CONFIG,
    style,
    gifEnabled: true,
    gifUrl,
    gifWidth: 320,
  });

  if (style === "minimal") {
    // Minimal rule: "No code blocks, tables, GIF, or badges."
    assert(!md.includes(gifUrl), `[${style}] Minimal style must never include GIF`);
  } else {
    assert(md.includes(`<img align="right" width="320" src="${gifUrl}"/>`), `[${style}] Should include GIF`);
  }
});

// GIF OFF
styles.forEach((style) => {
  const md = generateAboutMarkdown({
    ...DEFAULT_ABOUT_CONFIG,
    style,
    gifEnabled: false,
    gifUrl,
  });
  assert(!md.includes(gifUrl), `[${style}] Must omit GIF when gifEnabled is false`);
});
console.log("✅ Passed Test 6: GIF on / off");

// -----------------------------------------------------------------
// Test 7: Emoji on / off for each style
// -----------------------------------------------------------------
console.log("\nTest 7: Emoji on / off");

// Emoji ON
styles.forEach((style) => {
  const md = generateAboutMarkdown({
    ...DEFAULT_ABOUT_CONFIG,
    style,
    emoji: true,
  });
  if (style === "hacker" || style === "playful") {
    assert(md.includes("🔭&nbsp;"), `[${style}] Should have emoji with &nbsp;`);
  }
});

// Emoji OFF
styles.forEach((style) => {
  const md = generateAboutMarkdown({
    ...DEFAULT_ABOUT_CONFIG,
    style,
    emoji: false,
  });
  assert(!md.includes("🔭&nbsp;"), `[${style}] Must omit 🔭&nbsp; when emoji is false`);
  assert(!md.includes("🌱&nbsp;"), `[${style}] Must omit 🌱&nbsp; when emoji is false`);
  if (style === "professional") {
    assert(md.startsWith("## About Me"), "[professional] Heading must not have emoji");
  }
  if (style === "minimal") {
    assert(md.startsWith("## About"), "[minimal] Heading must not have emoji");
  }
  if (style === "playful") {
    assert(md.startsWith("## Hey, I'm"), "[playful] Heading must not have emoji when off");
  }
  if (style === "hacker") {
    assert(md.startsWith("## About Me"), "[hacker] Heading must not have emoji when off");
  }
});
console.log("✅ Passed Test 7: Emoji on / off");

console.log("\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!");
