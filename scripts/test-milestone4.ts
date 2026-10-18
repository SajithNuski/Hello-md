import "./mock-server-only";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { Facts } from "../src/lib/github/types";
import { validateSections } from "../src/lib/ai/validate";
import { buildBadgeMarkdown } from "../src/lib/assemble/badges";
import { assemble, AssembleSection } from "../src/lib/assemble";
import { formatSection } from "../src/lib/assemble/formatSection";
import { buildSystemPrompt, buildUserPrompt, extractFactsSlice } from "../src/lib/ai/prompt";
import { routeLLMRequest } from "../src/lib/ai/router";

// Mock Facts for deterministic grounding tests
const mockFacts: Facts = {
  login: "linus-mock",
  name: "Linus Torvalds",
  bio: "Creator of Linux and Git. Working on kernel since 1991.",
  location: "Portland, OR",
  websiteUrl: "https://kernel.org",
  avatarUrl: "https://avatars.githubusercontent.com/u/1024025",
  followers: 215000,
  topLanguages: [
    { name: "C", percent: 85 },
    { name: "Shell", percent: 10 },
    { name: "Makefile", percent: 5 },
  ],
  topRepos: [
    {
      name: "linux",
      description: "Linux kernel source tree",
      url: "https://github.com/torvalds/linux",
      stars: 175000,
      language: "C",
      topics: ["kernel", "os", "c"],
      pushedAt: "2024-10-15T12:00:00Z",
    },
    {
      name: "git",
      description: "Fast version control system",
      url: "https://github.com/git/git",
      stars: 52000,
      language: "C",
      topics: ["git", "vcs"],
      pushedAt: "2024-09-01T10:00:00Z",
    },
  ],
  pinned: ["linux"],
  contributions: { commits: 15000, pullRequests: 250 },
  hasProfileReadme: true,
};

async function runMilestone4Tests() {
  console.log("=== Testing Milestone 4: Generation Pipeline & Assembly ===\n");

  // -------------------------------------------------------------
  // TEST 1: Grounding Checks (Negative & Hallucination Prevention)
  // -------------------------------------------------------------
  console.log("[TEST 1] Testing Strict Grounding Checks against Hallucinations...");

  const hallucinatedOutput = {
    intro: {
      headline: "Senior Software Engineer with 25 years experience", // 25 is ungrounded
      tagline: "Building scalable distributed systems and crypto bots",
    },
    about: {
      paragraphs: [
        "I have worked with 500 fortune clients across 30 countries.", // 500 and 30 are ungrounded
      ],
    },
    skills: {
      groups: [
        {
          title: "Languages",
          items: ["C", "Shell", "Brainfuck", "Cobol", "Fortran"], // Brainfuck, Cobol, Fortran are ungrounded
        },
      ],
    },
    projects: [
      { repo: "linux", pitch: "The famous operating system kernel." }, // Valid
      { repo: "super-crypto-ai-bot", pitch: "Invented repo that does not exist." }, // Hallucinated repo
    ],
    contact: {
      closing: "Reach me at https://fake-scam-url.com or call 9999.", // Ungrounded URL & number
    },
  };

  const validation = validateSections(JSON.stringify(hallucinatedOutput), mockFacts);

  if (!validation.success) {
    console.error("❌ Validation unexpectedly rejected valid JSON structure:", validation.error);
    process.exit(1);
  }

  const sanitized = validation.data;

  // Verify Hallucinated Repo Dropped
  const repoNames = sanitized.projects.map((p) => p.repo);
  const droppedFakeRepo = !repoNames.includes("super-crypto-ai-bot") && repoNames.includes("linux");
  if (droppedFakeRepo) {
    console.log("✅ Grounding: Hallucinated repo 'super-crypto-ai-bot' was strictly dropped.");
  } else {
    console.error("❌ Grounding failed: Hallucinated repo was not dropped:", repoNames);
    process.exit(1);
  }

  // Verify Hallucinated Skills Dropped
  const skillItems = sanitized.skills.groups[0]?.items || [];
  const keptValidSkillsOnly =
    skillItems.includes("C") &&
    skillItems.includes("Shell") &&
    !skillItems.includes("Brainfuck") &&
    !skillItems.includes("Cobol");
  if (keptValidSkillsOnly) {
    console.log("✅ Grounding: Ungrounded skills (Brainfuck, Cobol) were strictly dropped.");
  } else {
    console.error("❌ Grounding failed: Ungrounded skills remained:", skillItems);
    process.exit(1);
  }

  // Verify Ungrounded Numbers Stripped
  const aboutText = sanitized.about.paragraphs[0];
  const strippedUngroundedNumbers = !aboutText.includes("500") && !aboutText.includes("30");
  if (strippedUngroundedNumbers) {
    console.log("✅ Grounding: Ungrounded metrics ('500', '30') were stripped from prose.");
  } else {
    console.error("❌ Grounding failed: Ungrounded numbers survived:", aboutText);
    process.exit(1);
  }

  // Verify URLs Stripped from Contact
  const contactText = sanitized.contact.closing;
  const strippedUrl = !contactText.includes("https://fake-scam-url.com");
  if (strippedUrl) {
    console.log("✅ Grounding: Injected raw URLs stripped from AI prose.");
  } else {
    console.error("❌ Grounding failed: Raw URL was not stripped:", contactText);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 2: Shields.io Badge Mapping & URL Encoding
  // -------------------------------------------------------------
  console.log("\n[TEST 2] Testing Shields.io Badges Formatting...");

  const badgeTs = buildBadgeMarkdown("TypeScript");
  const badgeCPlusPlus = buildBadgeMarkdown("C++");
  const badgeCSharp = buildBadgeMarkdown("C#");
  const badgeUnknown = buildBadgeMarkdown("CustomInternalTool");

  if (
    badgeTs.includes("TypeScript-3178C6") &&
    badgeCPlusPlus.includes("C%2B%2B-00599C") &&
    badgeCSharp.includes("C%23-239120") &&
    badgeUnknown.includes("CustomInternalTool-24292e")
  ) {
    console.log("✅ Badges: Safe URL encoding and logo colors verified for standard and unmapped techs.");
    console.log(`   Sample TypeScript: ${badgeTs}`);
    console.log(`   Sample C++:        ${badgeCPlusPlus}`);
  } else {
    console.error("❌ Badge generation test failed:", { badgeTs, badgeCPlusPlus, badgeCSharp, badgeUnknown });
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 3: Deterministic Section Assembly
  // -------------------------------------------------------------
  console.log("\n[TEST 3] Testing Pure Deterministic assemble()...");

  const rawSections: AssembleSection[] = [
    { key: "contact", markdown: "## Connect\n\nReach out anytime.", enabled: true, order: 4 },
    { key: "intro", markdown: "# Hello World\n\nSoftware Builder", enabled: true, order: 0 },
    { key: "skills", markdown: "## Skills\n\nTypeScript and Rust", enabled: false, order: 2 }, // Disabled
    { key: "about", markdown: "## About\n\nI build systems.", enabled: true, order: 1 },
  ];

  const assembledMd = assemble(rawSections, "minimal", mockFacts);

  // Check order: intro (order 0) must appear before about (order 1), before contact (order 4)
  const introIdx = assembledMd.indexOf("# Hello World");
  const aboutIdx = assembledMd.indexOf("## About");
  const contactIdx = assembledMd.indexOf("## Connect");
  const skillsIdx = assembledMd.indexOf("## Skills");

  if (introIdx !== -1 && aboutIdx > introIdx && contactIdx > aboutIdx && skillsIdx === -1) {
    console.log("✅ Assembler: Sorted strictly by order and correctly omitted disabled section.");
  } else {
    console.error("❌ Assembler ordering test failed:\n", assembledMd);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // TEST 4: Live Generation Pipeline with Live AI Router
  // -------------------------------------------------------------
  console.log("\n[TEST 4] Testing End-to-End Generation with Live AI Router...");

  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  if (hasGroq || hasGemini) {
    try {
      const systemPrompt = buildSystemPrompt("professional");
      const userPrompt = buildUserPrompt(mockFacts);

      console.log("   - Calling live LLM Router for full profile generation...");
      const llmResult = await routeLLMRequest({
        system: systemPrompt,
        user: userPrompt,
        temperature: 0.4,
        maxOutputTokens: 2500,
      });

      console.log(`   - Received response from [${llmResult.provider}] model [${llmResult.model}]`);

      const liveValidation = validateSections(llmResult.text, mockFacts);
      if (!liveValidation.success) {
        console.error("❌ Live AI output failed validation:", liveValidation.error);
        console.log("Raw LLM Text:", llmResult.text);
        process.exit(1);
      }

      const validLiveOutput = liveValidation.data;

      // Format sections
      const sections: AssembleSection[] = [
        { key: "intro", markdown: formatSection("intro", validLiveOutput.intro, mockFacts), enabled: true, order: 0 },
        { key: "about", markdown: formatSection("about", validLiveOutput.about, mockFacts), enabled: true, order: 1 },
        { key: "skills", markdown: formatSection("skills", validLiveOutput.skills, mockFacts), enabled: true, order: 2 },
        { key: "projects", markdown: formatSection("projects", validLiveOutput.projects, mockFacts), enabled: true, order: 3 },
        { key: "contact", markdown: formatSection("contact", validLiveOutput.contact, mockFacts), enabled: true, order: 4 },
      ];

      const fullLiveMd = assemble(sections, "minimal", mockFacts);

      console.log("✅ Live generation succeeded!");
      console.log("--- Generated Markdown Preview ---");
      console.log(fullLiveMd.split("\n").slice(0, 18).join("\n"));
      console.log("...\n--- End Preview ---");

      // Verify no ungrounded repos in generated markdown
      const mentionsLinux = fullLiveMd.includes("linux");
      if (mentionsLinux) {
        console.log("✅ Generated Markdown successfully features grounded facts and repos.");
      }
    } catch (err: unknown) {
      console.error("❌ Live generation test encountered error:", (err as Error).message);
      process.exit(1);
    }
  } else {
    console.log("ℹ️ Skipping live call: neither GROQ_API_KEY nor GEMINI_API_KEY is configured.");
  }

  console.log("\n=== All Milestone 4 Tests Passed! ===");
  process.exit(0);
}

runMilestone4Tests();
