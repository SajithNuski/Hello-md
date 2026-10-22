import assert from "assert";
import {
  StatsConfig,
  DEFAULT_STATS_CONFIG,
  getDefaultStatsConfig,
  generateStatsMarkdown,
  parseStatsMarkdown,
} from "../src/lib/statsConfig";

console.log("🚀 Running unit tests for GitHub Analytics section generator...\n");

const USER = "johndoe";

// -------------------------------------------------------------
// Test 1: All three cards enabled (Stats + Languages side-by-side in HTML table, Streak below)
// -------------------------------------------------------------
console.log("Test 1: All 3 cards enabled (Side-by-side table + Streak below)");
{
  const config: StatsConfig = {
    showStats: true,
    showLangs: true,
    showStreak: true,
    theme: "dark",
  };
  const md = generateStatsMarkdown(config, USER);

  assert(md.includes("## 📊 GitHub Analytics"), "Must include exact heading ## 📊 GitHub Analytics");
  assert(md.includes('<div align="center">'), "Must wrap cards in <div align=\"center\">");
  assert(md.includes("<table>"), "Must place stats and langs in an HTML table");
  assert(md.includes("<tr>") && md.includes("<td>"), "Must use tr and td cells");
  assert(md.includes(`api?username=${USER}&show_icons=true&theme=dark`), "Stats card must contain correct user and theme");
  assert(md.includes(`api/top-langs/?username=${USER}&layout=compact&theme=dark`), "Langs card must contain correct user and theme");
  assert(md.includes(`streak-stats.demolab.com/?user=${USER}&theme=dark`), "Streak card must contain correct user and theme");

  // Streak card must appear after table closing tag
  const tableCloseIdx = md.indexOf("</table>");
  const streakIdx = md.indexOf("streak-stats.demolab.com");
  assert(streakIdx > tableCloseIdx, "Streak card must appear below the table");

  // Verify URL strictness
  assert(!md.includes("SajithNuski") && !md.includes("sajithnuski"), "Must not leak any author data");
  assert(md.split(USER).length - 1 === 3, "Username must appear exactly 3 times in the 3 cards");
}
console.log("✅ Passed Test 1: All 3 cards enabled");

// -------------------------------------------------------------
// Test 2: Only Stats and Languages (Two-cell HTML table, no Streak)
// -------------------------------------------------------------
console.log("\nTest 2: Only Stats and Languages enabled");
{
  const config: StatsConfig = {
    showStats: true,
    showLangs: true,
    showStreak: false,
    theme: "tokyonight",
  };
  const md = generateStatsMarkdown(config, USER);

  assert(md.includes("## 📊 GitHub Analytics"), "Must include heading");
  assert(md.includes("<table>"), "Must include table");
  assert(!md.includes("streak-stats.demolab.com"), "Must omit streak card");
  assert(md.includes("theme=tokyonight"), "Must respect selected theme");
  assert(md.split(USER).length - 1 === 2, "Username must appear exactly 2 times for 2 cards");
}
console.log("✅ Passed Test 2: Stats and Languages side-by-side");

// -------------------------------------------------------------
// Test 3: Only Stats and Streak (Languages disabled)
// -------------------------------------------------------------
console.log("\nTest 3: Only Stats and Streak enabled (No table)");
{
  const config: StatsConfig = {
    showStats: true,
    showLangs: false,
    showStreak: true,
    theme: "radical",
  };
  const md = generateStatsMarkdown(config, USER);

  assert(md.includes("## 📊 GitHub Analytics"), "Must include heading");
  assert(!md.includes("<table>"), "Must NOT use table when Languages is not enabled");
  assert(md.includes("api?username="), "Must include stats card");
  assert(md.includes("streak-stats.demolab.com"), "Must include streak card");
  assert(!md.includes("api/top-langs/"), "Must omit top-langs card");
  assert(md.split(USER).length - 1 === 2, "Username must appear exactly 2 times");
}
console.log("✅ Passed Test 3: Stats and Streak");

// -------------------------------------------------------------
// Test 4: Only Languages and Streak (Stats disabled)
// -------------------------------------------------------------
console.log("\nTest 4: Only Languages and Streak enabled (No table)");
{
  const config: StatsConfig = {
    showStats: false,
    showLangs: true,
    showStreak: true,
    theme: "dracula",
  };
  const md = generateStatsMarkdown(config, USER);

  assert(md.includes("## 📊 GitHub Analytics"), "Must include heading");
  assert(!md.includes("<table>"), "Must NOT use table when Stats is not enabled");
  assert(!md.includes("api?username="), "Must omit stats card");
  assert(md.includes("api/top-langs/"), "Must include top-langs card");
  assert(md.includes("streak-stats.demolab.com"), "Must include streak card");
  assert(md.split(USER).length - 1 === 2, "Username must appear exactly 2 times");
}
console.log("✅ Passed Test 4: Languages and Streak");

// -------------------------------------------------------------
// Test 5: Single Card Enabled (Centered alone)
// -------------------------------------------------------------
console.log("\nTest 5: Single Card Enabled (Centered alone)");
{
  // 5a: Only Stats
  const mdStatsOnly = generateStatsMarkdown(
    { showStats: true, showLangs: false, showStreak: false, theme: "dark" },
    USER
  );
  assert(mdStatsOnly.includes("## 📊 GitHub Analytics"));
  assert(mdStatsOnly.includes('<div align="center">'));
  assert(mdStatsOnly.includes("api?username="));
  assert(!mdStatsOnly.includes("<table>"));
  assert(!mdStatsOnly.includes("api/top-langs/"));
  assert(!mdStatsOnly.includes("streak-stats.demolab.com"));
  assert(mdStatsOnly.split(USER).length - 1 === 1);

  // 5b: Only Languages
  const mdLangsOnly = generateStatsMarkdown(
    { showStats: false, showLangs: true, showStreak: false, theme: "dark" },
    USER
  );
  assert(mdLangsOnly.includes("## 📊 GitHub Analytics"));
  assert(mdLangsOnly.includes('<div align="center">'));
  assert(mdLangsOnly.includes("api/top-langs/"));
  assert(!mdLangsOnly.includes("<table>"));
  assert(!mdLangsOnly.includes("api?username="));
  assert(!mdLangsOnly.includes("streak-stats.demolab.com"));
  assert(mdLangsOnly.split(USER).length - 1 === 1);

  // 5c: Only Streak
  const mdStreakOnly = generateStatsMarkdown(
    { showStats: false, showLangs: false, showStreak: true, theme: "dark" },
    USER
  );
  assert(mdStreakOnly.includes("## 📊 GitHub Analytics"));
  assert(mdStreakOnly.includes('<div align="center">'));
  assert(mdStreakOnly.includes("streak-stats.demolab.com"));
  assert(!mdStreakOnly.includes("<table>"));
  assert(!mdStreakOnly.includes("api?username="));
  assert(!mdStreakOnly.includes("api/top-langs/"));
  assert(mdStreakOnly.split(USER).length - 1 === 1);
}
console.log("✅ Passed Test 5: Single Card Enabled");

// -------------------------------------------------------------
// Test 6: None enabled (Omit whole section, no heading)
// -------------------------------------------------------------
console.log("\nTest 6: None enabled (Omit whole section)");
{
  const emptyConfig: StatsConfig = {
    showStats: false,
    showLangs: false,
    showStreak: false,
    theme: "dark",
  };
  const md = generateStatsMarkdown(emptyConfig, USER);
  assert.strictEqual(md, "", "If none enabled, must return completely empty string");
  assert(!md.includes("GitHub Analytics"), "Must not include heading");
}
console.log("✅ Passed Test 6: None enabled omitted");

// -------------------------------------------------------------
// Test 7: parseStatsMarkdown round-trip
// -------------------------------------------------------------
console.log("\nTest 7: Parsing existing markdown");
{
  const fullMd = generateStatsMarkdown(DEFAULT_STATS_CONFIG, USER);
  const parsed = parseStatsMarkdown(fullMd);
  assert.strictEqual(parsed.showStats, true);
  assert.strictEqual(parsed.showLangs, true);
  assert.strictEqual(parsed.showStreak, true);
  assert.strictEqual(parsed.theme, "dark");

  const singleMd = generateStatsMarkdown(
    { showStats: false, showLangs: true, showStreak: false, theme: "onedark" },
    USER
  );
  const parsedSingle = parseStatsMarkdown(singleMd);
  assert.strictEqual(parsedSingle.showStats, false);
  assert.strictEqual(parsedSingle.showLangs, true);
  assert.strictEqual(parsedSingle.showStreak, false);
  assert.strictEqual(parsedSingle.theme, "onedark");

  const emptyParsed = parseStatsMarkdown("");
  assert.strictEqual(emptyParsed.showStats, false);
  assert.strictEqual(emptyParsed.showLangs, false);
  assert.strictEqual(emptyParsed.showStreak, false);
}
console.log("✅ Passed Test 7: Parser round-trip");

console.log("\n🎉 ALL GITHUB ANALYTICS TESTS PASSED SUCCESSFULLY!");
