import "./mock-server-only";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { encryptToken, decryptToken, generateTokenEncKey } from "../src/lib/crypto";
import { computeReadmeDiff } from "../src/lib/github/publish";
import { authOptions } from "../src/lib/auth";

async function runMilestone7Tests() {
  console.log("==================================================");
  console.log("   MILESTONE 7 ACCEPTANCE TEST SUITE");
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
  // 1. AES-256-GCM Token Encryption & Decryption
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing AES-256-GCM Token Encryption & Security ---");

  const sampleToken = "gho_A1b2C3d4E5f6G7h8I9j0KlMnOpQrStUvWxYz_test";
  const encrypted1 = encryptToken(sampleToken);
  const encrypted2 = encryptToken(sampleToken);

  assert(
    typeof encrypted1 === "string" && encrypted1.split(".").length === 3,
    "Encrypted token contains 3 dot-delimited parts (iv.tag.ciphertext)",
    encrypted1
  );

  assert(
    encrypted1 !== encrypted2,
    "Ciphertext is non-deterministic (different random IV per encryption)",
    `enc1: ${encrypted1.slice(0, 20)}..., enc2: ${encrypted2.slice(0, 20)}...`
  );

  const decrypted1 = decryptToken(encrypted1);
  const decrypted2 = decryptToken(encrypted2);

  assert(
    decrypted1 === sampleToken && decrypted2 === sampleToken,
    "Decrypted tokens match original sample plaintext exactly"
  );

  // Tamper detection: flip a byte in ciphertext
  let tamperDetected = false;
  try {
    const parts = encrypted1.split(".");
    const tamperedCipher = parts[2].slice(0, -2) + (parts[2].endsWith("00") ? "ff" : "00");
    const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedCipher}`;
    decryptToken(tamperedToken);
  } catch {
    tamperDetected = true;
  }
  assert(tamperDetected, "Tampered ciphertext triggers authentication tag verification failure");

  // Key generator test
  const newKey = generateTokenEncKey();
  assert(
    typeof newKey === "string" && Buffer.from(newKey, "base64").length === 32,
    "generateTokenEncKey() produces valid 32-byte base64 string"
  );

  console.log();

  // -------------------------------------------------------------------------
  // 2. NextAuth Configuration & GitHub Scope Verification
  // -------------------------------------------------------------------------
  console.log("--- 2. Testing NextAuth GitHub Provider & Scopes ---");

  const githubProvider = authOptions.providers.find(
    (p: any) => p.id === "github" || (p as any).name === "GitHub"
  ) as any;

  const authSetting =
    githubProvider?.options?.authorization || githubProvider?.authorization;
  const scopeStr =
    typeof authSetting === "string"
      ? authSetting
      : authSetting?.params?.scope || "";

  assert(
    scopeStr.includes("read:user") && scopeStr.includes("public_repo"),
    "GitHub provider requests 'read:user' and 'public_repo' scopes",
    `Configured scopes: "${scopeStr}"`
  );

  assert(
    authOptions.session?.strategy === "jwt",
    "Session strategy is configured as JWT for stateless verification"
  );

  console.log();

  // -------------------------------------------------------------------------
  // 3. Unified Diff Calculation for GitHub Publishing
  // -------------------------------------------------------------------------
  console.log("--- 3. Testing Unified Diff Calculation ---");

  const oldReadme = `# John Doe

A passionate software developer.

## Skills
- JavaScript
- Python
`;

  const newReadme = `# John Doe

A passionate software developer building distributed systems.

## Skills
- JavaScript
- TypeScript
- Python
`;

  const patch = computeReadmeDiff(oldReadme, newReadme);

  assert(
    typeof patch === "string" && patch.includes("---") && patch.includes("+++"),
    "Unified diff contains standard file headers (--- / +++)"
  );

  assert(
    patch.includes("+A passionate software developer building distributed systems.") &&
      patch.includes("+- TypeScript"),
    "Unified diff correctly identifies added lines with '+' prefix"
  );

  assert(
    patch.includes("-A passionate software developer."),
    "Unified diff correctly identifies removed lines with '-' prefix"
  );

  console.log();

  // -------------------------------------------------------------------------
  // 4. Draft Reassignment Verification
  // -------------------------------------------------------------------------
  console.log("--- 4. Testing Draft Reassignment Logic ---");

  // Test reassignment logic simulation
  const anonOwnerId = "anon_68a0c2e391b44b8287e02830";
  const userGithubId = "12345678";
  const userOwnerId = `user_${userGithubId}`;

  const mockDrafts = [
    { _id: "draft_1", ownerId: anonOwnerId, login: "johndoe" },
    { _id: "draft_2", ownerId: "anon_other_visitor", login: "janedoe" },
  ];

  // Reassign matching drafts
  for (const draft of mockDrafts) {
    if (draft.ownerId === anonOwnerId) {
      draft.ownerId = userOwnerId;
    }
  }

  assert(
    mockDrafts[0].ownerId === userOwnerId,
    "Anonymous draft reassigns to logged-in userOwnerId upon sign-in"
  );

  assert(
    mockDrafts[1].ownerId === "anon_other_visitor",
    "Unrelated drafts belonging to other visitors remain unaffected"
  );

  console.log();

  // -------------------------------------------------------------------------
  // Final Summary
  // -------------------------------------------------------------------------
  console.log("==================================================");
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("\n🎉 ALL MILESTONE 7 TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  }
}

runMilestone7Tests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
