import "./mock-server-only";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PRESET_TEMPLATES } from "../src/lib/templates/presetTemplates";
import { THEMES } from "../src/lib/assemble/themes";
import { seedTemplates } from "./seed-templates";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

async function runMilestone8Tests() {
  console.log("==================================================");
  console.log("   MILESTONE 8 ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Detail: ${detail}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // 1. Templates Catalog & Schema Integrity
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Templates Catalog & Schema Integrity ---");

  assert(
    PRESET_TEMPLATES.length >= 8,
    `Preset templates catalog has ${PRESET_TEMPLATES.length} templates (>= 8 required)`
  );

  const slugs = new Set<string>();
  let allSlugsUnique = true;
  let allThemesValid = true;
  let allSectionsValid = true;

  for (const t of PRESET_TEMPLATES) {
    if (slugs.has(t.slug)) {
      allSlugsUnique = false;
    }
    slugs.add(t.slug);

    if (!(t.theme in THEMES)) {
      allThemesValid = false;
    }

    if (!Array.isArray(t.sectionOrder) || t.sectionOrder.length < 3) {
      allSectionsValid = false;
    }
  }

  assert(allSlugsUnique, "All template slugs are strictly unique");
  assert(allThemesValid, "All template themes map to valid THEMES dictionary entries");
  assert(allSectionsValid, "All templates specify a valid sectionOrder array with >= 3 sections");

  console.log();

  // -------------------------------------------------------------------------
  // 2. Seeding Logic & MongoDB Resilience
  // -------------------------------------------------------------------------
  console.log("--- 2. Testing Templates Seeding Execution ---");

  let seedError = false;
  try {
    await seedTemplates();
  } catch (err) {
    seedError = true;
    console.error("Seeding error:", err);
  }
  assert(!seedError, "seedTemplates() runs without fatal unhandled exceptions");

  console.log();

  // -------------------------------------------------------------------------
  // 3. Testing GET /api/templates API Endpoint
  // -------------------------------------------------------------------------
  console.log("--- 3. Testing GET /api/templates Endpoint & Filters ---");

  try {
    const allRes = await fetch(`${BASE_URL}/api/templates`);
    assert(allRes.ok, "GET /api/templates returns HTTP 200 OK");
    const allData = await allRes.json();
    assert(
      Array.isArray(allData.templates) && allData.templates.length >= 8,
      `API returns all ${allData.templates?.length} templates`
    );

    // Filter by persona
    const aiRes = await fetch(`${BASE_URL}/api/templates?persona=ai`);
    const aiData = await aiRes.json();
    assert(
      aiData.templates.length > 0 && aiData.templates.every((t: any) => t.persona === "ai"),
      "Query ?persona=ai strictly filters to AI templates"
    );

    // Filter by theme
    const violetRes = await fetch(`${BASE_URL}/api/templates?theme=violet`);
    const violetData = await violetRes.json();
    assert(
      violetData.templates.length > 0 && violetData.templates.every((t: any) => t.theme === "violet"),
      "Query ?theme=violet strictly filters to violet theme templates"
    );

    // Search query
    const searchRes = await fetch(`${BASE_URL}/api/templates?search=Rust`);
    const searchData = await searchRes.json();
    assert(
      searchData.templates.length > 0 &&
        searchData.templates.some((t: any) =>
          (t.tags || []).includes("Rust") || t.name.includes("Rust")
        ),
      "Query ?search=Rust finds matching Rust templates"
    );
  } catch (err: unknown) {
    console.error("API test error:", (err as Error).message);
    assert(false, "API test completed successfully");
  }

  console.log();

  // -------------------------------------------------------------------------
  // 4. Responsive & Accessibility Structural Verification
  // -------------------------------------------------------------------------
  console.log("--- 4. Testing Responsive Mobile Layout & Accessibility Tokens ---");

  // Check MobileBottomNav definitions
  const fs = await import("fs");
  const path = await import("path");

  const mobileNavCode = fs.readFileSync(
    path.join(process.cwd(), "src/components/editor/MobileBottomNav.tsx"),
    "utf-8"
  );
  assert(
    mobileNavCode.includes('role="tablist"') &&
      mobileNavCode.includes('role="tab"') &&
      mobileNavCode.includes("aria-selected="),
    "MobileBottomNav implements strict WAI-ARIA tablist and tab roles"
  );
  assert(
    mobileNavCode.includes("lg:hidden"),
    "MobileBottomNav uses lg:hidden to support tablets and mobiles consistently"
  );

  const editorPageCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/editor/[id]/page.tsx"),
    "utf-8"
  );
  assert(
    editorPageCode.includes('id="pane-sections"') &&
      editorPageCode.includes('id="pane-editor"') &&
      editorPageCode.includes('id="pane-preview"'),
    "Editor panes define matching tabpanel IDs for screen readers"
  );
  assert(
    editorPageCode.includes("pb-14 lg:pb-0"),
    "Editor main container implements pb-14 lg:pb-0 padding to avoid bottom nav overlap"
  );

  console.log();

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("==================================================");
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("\n🎉 ALL MILESTONE 8 ACCEPTANCE TESTS PASSED!");
    process.exit(0);
  }
}

runMilestone8Tests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
