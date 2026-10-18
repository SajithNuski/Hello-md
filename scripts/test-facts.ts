import { FactsSchema } from "../src/lib/github/types";

const TEST_USERS = [
  "torvalds",   // High activity, C language, multi-star repos
  "SajithNuski",// Active profile with existing profile README
  "norepos",    // User with 0 public repositories
];

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

async function runTests() {
  console.log(`=== Testing GET /api/github/[login] against ${BASE_URL} ===\n`);

  for (const username of TEST_USERS) {
    console.log(`[TEST] Fetching facts for @${username}...`);
    try {
      const res = await fetch(`${BASE_URL}/api/github/${username}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const parsed = FactsSchema.safeParse(data);

      if (!parsed.success) {
        console.error(`❌ Validation failed for @${username}:`, parsed.error.format());
        process.exit(1);
      }

      const facts = parsed.data;
      console.log(`✅ Success for @${username}:`);
      console.log(`   - Name: ${facts.name || "N/A"}`);
      console.log(`   - Bio: ${facts.bio ? facts.bio.slice(0, 50) + "..." : "None"}`);
      console.log(`   - Followers: ${facts.followers}`);
      console.log(
        `   - Top Languages (${facts.topLanguages.length}): ${
          facts.topLanguages.map((l) => `${l.name} (${l.percent}%)`).join(", ") || "None"
        }`
      );
      console.log(
        `   - Top Repos (${facts.topRepos.length}): ${
          facts.topRepos.map((r) => `${r.name} (★${r.stars})`).join(", ") || "None"
        }`
      );
      console.log(`   - Has Profile README: ${facts.hasProfileReadme}`);
      console.log();
    } catch (err: unknown) {
      console.error(`❌ Error fetching @${username}:`, (err as Error).message);
      process.exit(1);
    }
  }

  // Test non-existent user for 404
  const fakeUser = "user-not-found-xyz123";
  console.log(`[TEST] Testing 404 handling for @${fakeUser}...`);
  const notFoundRes = await fetch(`${BASE_URL}/api/github/${fakeUser}`);
  if (notFoundRes.status === 404) {
    const errorJson = await notFoundRes.json();
    console.log("✅ Expected 404 USER_NOT_FOUND caught:", JSON.stringify(errorJson));
  } else {
    console.error(`❌ Expected 404, got ${notFoundRes.status}`);
    process.exit(1);
  }

  // Test organization rejection
  console.log(`[TEST] Testing organization rejection for @vercel...`);
  const orgRes = await fetch(`${BASE_URL}/api/github/vercel`);
  if (orgRes.status === 400) {
    const orgJson = await orgRes.json();
    console.log("✅ Expected 400 ORGANIZATION_NOT_SUPPORTED caught:", JSON.stringify(orgJson));
  } else {
    console.error(`❌ Expected 400, got ${orgRes.status}`);
    process.exit(1);
  }

  console.log("\n=== All Milestone 2 Acceptance Tests Passed! ===");
}

runTests();
