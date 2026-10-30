import "./mock-server-only";
import assert from "assert";
import {
  TONES,
  Tone,
  DEFAULT_TONE,
  TONE_OPTIONS,
  handleTone,
  isValidTone,
  resolveTone,
  getToneEmojiDefault,
} from "../src/lib/config";
import {
  getDefaultAboutConfig,
  generateAboutMarkdown,
} from "../src/lib/aboutConfig";
import { formatSection } from "../src/lib/assemble/formatSection";
import { assemble, AssembleSection } from "../src/lib/assemble";
import { createCacheKey } from "../src/lib/ai/cache";
import { extractFactsSlice } from "../src/lib/ai/prompt";
import { Facts } from "../src/lib/github/types";

console.log("🚀 Running verification tests for Editorial Tone pipeline...\n");

// -------------------------------------------------------------
// Test 1: Shared Tone Configuration Verification
// -------------------------------------------------------------
console.log("[TEST 1] Verifying shared Tone configuration...");
assert.strictEqual(TONE_OPTIONS.length, 4, "TONE_OPTIONS must contain exactly 4 options");
assert.strictEqual(DEFAULT_TONE, "professional", "DEFAULT_TONE must be 'professional'");

const expectedValues: Tone[] = ["professional", "playful", "minimal", "hacker"];
const optionValues = TONE_OPTIONS.map((opt) => opt.value);
assert.deepStrictEqual(
  optionValues.sort(),
  [...expectedValues].sort(),
  "TONE_OPTIONS must cover all 4 tones"
);

// Verify validity and resolution helpers
assert.strictEqual(isValidTone("professional"), true);
assert.strictEqual(isValidTone("playful"), true);
assert.strictEqual(isValidTone("minimal"), true);
assert.strictEqual(isValidTone("hacker"), true);
assert.strictEqual(isValidTone("invalid_tone"), false);
assert.strictEqual(isValidTone(null), false);
assert.strictEqual(resolveTone("playful"), "playful");
assert.strictEqual(resolveTone("unknown"), DEFAULT_TONE);
assert.strictEqual(resolveTone(undefined), DEFAULT_TONE);

// Verify emoji rules
assert.strictEqual(getToneEmojiDefault("professional"), false);
assert.strictEqual(getToneEmojiDefault("minimal"), false);
assert.strictEqual(getToneEmojiDefault("playful"), true);
assert.strictEqual(getToneEmojiDefault("hacker"), true);

console.log("✅ Passed Test 1: Shared Tone configuration and helpers");

// -------------------------------------------------------------
// Test 2: Shared Tone-handling & Prompt Function
// -------------------------------------------------------------
console.log("\n[TEST 2] Verifying handleTone() function...");
expectedValues.forEach((tone) => {
  const res = handleTone(tone);
  assert.strictEqual(res.tone, tone, `handleTone(${tone}).tone must match`);
  assert(res.label.length > 0, `handleTone(${tone}).label must be non-empty`);
  assert(res.directive.length > 0, `handleTone(${tone}).directive must be non-empty`);
  assert(res.systemPrompt.includes(`Tone: ${res.directive}`), `System prompt must contain tone directive`);
});

// Fallback test
const fallbackRes = handleTone("bogus_value");
assert.strictEqual(fallbackRes.tone, DEFAULT_TONE, "handleTone should fallback to DEFAULT_TONE for invalid tone");
console.log("✅ Passed Test 2: handleTone() and prompt generation");

// -------------------------------------------------------------
// Test 3: Cache Key Invalidation Across Tones
// -------------------------------------------------------------
console.log("\n[TEST 3] Verifying Cache Key uniqueness for each Tone...");
const sampleFacts: Facts = {
  login: "testdev",
  name: "Test Developer",
  bio: "Full stack engineer exploring distributed AI systems.",
  location: "San Francisco, CA",
  websiteUrl: "https://testdev.io",
  avatarUrl: "https://avatars.githubusercontent.com/u/12345",
  followers: 450,
  topLanguages: [
    { name: "TypeScript", percent: 60 },
    { name: "Python", percent: 30 },
    { name: "Rust", percent: 10 },
  ],
  topRepos: [
    {
      name: "hyper-mesh",
      description: "Distributed message broker in Rust",
      url: "https://github.com/testdev/hyper-mesh",
      stars: 1200,
      language: "Rust",
      topics: ["networking", "distributed-systems"],
      pushedAt: "2024-10-01T00:00:00Z",
    },
    {
      name: "ai-lens",
      description: "Computer vision toolkit in Python",
      url: "https://github.com/testdev/ai-lens",
      stars: 800,
      language: "Python",
      topics: ["ai", "vision"],
      pushedAt: "2024-09-15T00:00:00Z",
    },
  ],
  pinned: ["hyper-mesh"],
  contributions: { commits: 850, pullRequests: 45 },
  hasProfileReadme: true,
};

const slice = extractFactsSlice(sampleFacts);
const cacheKeys = new Set(expectedValues.map((tone) => createCacheKey("all", tone, slice)));
assert.strictEqual(cacheKeys.size, 4, "All 4 tones must produce 4 unique cache keys");
console.log("✅ Passed Test 3: Cache keys differ across all 4 tones");

// -------------------------------------------------------------
// Test 4: Same input under all 4 tones gives 4 clearly different outputs
// matching what the Editor produces
// -------------------------------------------------------------
console.log("\n[TEST 4] Verifying 4 distinct outputs matching the Editor...");

const outputs: Record<Tone, string> = {
  professional: "",
  playful: "",
  minimal: "",
  hacker: "",
};

expectedValues.forEach((tone) => {
  // Generator pipeline simulation
  const config = getDefaultAboutConfig(sampleFacts.login, sampleFacts, tone);
  assert.strictEqual(config.style, tone, `config.style must be set to ${tone}`);

  const formattedViaFormatSection = formatSection("about", config, sampleFacts, "minimal", { tone });
  const formattedViaEditorDirect = generateAboutMarkdown(config);

  // CRITICAL: Generator output must match what the Editor produces
  assert.strictEqual(
    formattedViaFormatSection,
    formattedViaEditorDirect,
    `[${tone}] formatSection output must exactly match generateAboutMarkdown output from the Editor`
  );

  outputs[tone] = formattedViaFormatSection;
});

// Verify all 4 outputs are unique
const uniqueOutputs = new Set(Object.values(outputs));
assert.strictEqual(uniqueOutputs.size, 4, "All 4 tones must produce 4 clearly distinct outputs");

// Verify specific characteristics of each tone output matching Editor specifications
// 1. Hacker: code block with TS object and padded colons
assert(outputs.hacker.includes("```ts"), "[hacker] Must include TypeScript code block");
assert(outputs.hacker.includes("const test = {"), "[hacker] Must include 'const test = {' declaration");
assert(outputs.hacker.includes("name"), "[hacker] Must include name field in code block");
assert(outputs.hacker.includes("stack"), "[hacker] Must include stack array");

// 2. Playful: cheerful heading, tech arsenal, status call to action
assert(outputs.playful.includes("## 👋 Hey, I'm"), "[playful] Must include playful greeting header");
assert(outputs.playful.includes("Tech Arsenal:"), "[playful] Must include Tech Arsenal chips section");
assert(outputs.playful.includes("Focus Areas:"), "[playful] Must include Focus Areas chips section");
assert(outputs.playful.includes("let's build something epic together!"), "[playful] Must include cheerful call to action");
assert(!outputs.playful.includes("```ts"), "[playful] Must not include code block");

// 3. Professional: clean heading, summary paragraph, attribute table
assert(outputs.professional.includes("## About Me"), "[professional] Must include clean '## About Me' header without emoji");
assert(outputs.professional.includes("| Attribute | Details |"), "[professional] Must include attribute table header");
assert(outputs.professional.includes("| **Role** |"), "[professional] Must include Role row in table");
assert(outputs.professional.includes("| **Tech Stack** |"), "[professional] Must include Tech Stack row in table");
assert(!outputs.professional.includes("```ts"), "[professional] Must not include code block");
assert(!outputs.professional.includes("## 👋"), "[professional] Must not include wave emoji header");

// 4. Minimal: distraction-free text bullets, no tables, no code blocks
assert(outputs.minimal.includes("## About"), "[minimal] Must include concise '## About' header");
assert(!outputs.minimal.includes("| Attribute | Details |"), "[minimal] Must not include table");
assert(!outputs.minimal.includes("```ts"), "[minimal] Must not include code block");
assert(!outputs.minimal.includes("## 👋"), "[minimal] Must not include wave emoji header");
assert(outputs.minimal.includes("- Stack:"), "[minimal] Must format clean Stack bullet item");
assert(outputs.minimal.includes("- Portfolio:"), "[minimal] Must format clean Portfolio bullet item");

console.log("✅ Passed Test 4: 4 clearly different outputs produced, matching the Editor exactly!");

// -------------------------------------------------------------
// Test 5: Full Assembled Document Test across all 4 tones
// -------------------------------------------------------------
console.log("\n[TEST 5] Verifying Full Assembled READMEs across all 4 tones...");
const assembledDocs = expectedValues.map((tone) => {
  const aboutConfig = getDefaultAboutConfig(sampleFacts.login, sampleFacts, tone);
  const aboutMd = formatSection("about", aboutConfig, sampleFacts, "minimal", { tone });

  const sections: AssembleSection[] = [
    { key: "about", markdown: aboutMd, enabled: true, order: 1 },
  ];
  return assemble(sections, "minimal", sampleFacts);
});

const uniqueAssembled = new Set(assembledDocs);
assert.strictEqual(uniqueAssembled.size, 4, "Assembled documents must be distinct across all 4 tones");

console.log("✅ Passed Test 5: Full assembled READMEs are distinct for all 4 tones!");

console.log("\n🎉 ALL EDITORIAL TONE TESTS PASSED WITH 100% SUCCESS!");
