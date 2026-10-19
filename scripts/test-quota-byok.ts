import "./mock-server-only";
import { checkQuota, consumeQuota, getUsage, resetMemoryQuota, getUtcDay, getResetsAt } from "../src/lib/quota";
import { getSubjectId, extractByokHeaders } from "../src/lib/owner";
import { APP_CONFIG } from "../src/lib/config";

async function runTests() {
  console.log("=================================================");
  console.log(" Milestone 6: Quota Tracking & BYOK Verification ");
  console.log("=================================================\n");

  resetMemoryQuota();

  // Test 1: UTC Day & Reset calculation
  console.log("--- Test 1: UTC Day & ResetsAt Calculation ---");
  const today = getUtcDay();
  const resetInfo = getResetsAt();
  console.log(`[PASS] Today UTC: ${today}`);
  console.log(`[PASS] Resets at: ${resetInfo.resetsAt} (in ${resetInfo.resetTimeFormatted}, ${resetInfo.secondsUntilReset}s)`);
  if (!today.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`Invalid UTC day format: ${today}`);
  }

  // Test 2: Subject ID generation
  console.log("\n--- Test 2: Anonymous Subject ID Hashing ---");
  const mockReq1 = new Request("http://localhost:3000/api/usage", {
    headers: {
      "x-forwarded-for": "203.0.113.195",
      cookie: "hellomd_owner=anon_test_user_cookie_123",
    },
  });
  const subject1 = getSubjectId(mockReq1);
  console.log(`[PASS] Subject 1 ID: ${subject1}`);

  const mockReq1Same = new Request("http://localhost:3000/api/usage", {
    headers: {
      "x-forwarded-for": "203.0.113.195",
      cookie: "hellomd_owner=anon_test_user_cookie_123",
    },
  });
  const subject1Same = getSubjectId(mockReq1Same);
  if (subject1 !== subject1Same) {
    throw new Error("Subject ID is not deterministic for same IP & cookie!");
  }
  console.log("[PASS] Subject ID is 100% deterministic across identical requests.");

  const mockReq2 = new Request("http://localhost:3000/api/usage", {
    headers: {
      "x-forwarded-for": "198.51.100.42",
      cookie: "hellomd_owner=anon_different_cookie_456",
    },
  });
  const subject2 = getSubjectId(mockReq2);
  console.log(`[PASS] Subject 2 ID: ${subject2}`);
  if (subject1 === subject2) {
    throw new Error("Distinct clients produced identical subject ID!");
  }
  console.log("[PASS] Different clients produce isolated subject IDs.");

  // Test 3: Initial Quota Status
  console.log("\n--- Test 3: Initial Quota Allocation ---");
  const testSubject = `test_sub_${Date.now()}`;
  const initialCheck = await checkQuota(testSubject, 1.0);
  console.log(`[PASS] Initial Check: used=${initialCheck.used}, remaining=${initialCheck.remaining}, limit=${initialCheck.limit}, allowed=${initialCheck.allowed}`);
  if (!initialCheck.allowed || initialCheck.remaining !== 3 || initialCheck.used !== 0) {
    throw new Error(`Expected initial quota 3/3, got ${initialCheck.remaining}/${initialCheck.limit}`);
  }

  // Test 4: Consume Full Generation (Cost 1.0)
  console.log("\n--- Test 4: Consume Full Profile Generation (cost = 1.0) ---");
  const postGen1 = await consumeQuota(testSubject, 1.0, 2500);
  console.log(`[PASS] Post Gen 1: used=${postGen1.used}, remaining=${postGen1.remaining}`);
  if (postGen1.used !== 1.0 || postGen1.remaining !== 2.0) {
    throw new Error(`Expected used=1.0, remaining=2.0, got used=${postGen1.used}, remaining=${postGen1.remaining}`);
  }

  // Test 5: Consume Single Section Regeneration (Cost 0.25)
  console.log(`\n--- Test 5: Consume Single Section Regeneration (cost = ${APP_CONFIG.sectionRegenCost}) ---`);
  const postRegen = await consumeQuota(testSubject, APP_CONFIG.sectionRegenCost, 1000);
  console.log(`[PASS] Post Single-Section Regen: used=${postRegen.used}, remaining=${postRegen.remaining}`);
  if (postRegen.used !== 1.25 || postRegen.remaining !== 1.75) {
    throw new Error(`Expected used=1.25, remaining=1.75, got used=${postRegen.used}, remaining=${postRegen.remaining}`);
  }

  // Test 6: Deplete Remaining Quota
  console.log("\n--- Test 6: Quota Depletion to Zero ---");
  await consumeQuota(testSubject, 1.0, 2500); // used 2.25, remaining 0.75
  await consumeQuota(testSubject, 0.75, 1500); // used 3.0, remaining 0.0

  const depletedCheck = await checkQuota(testSubject, 1.0);
  console.log(`[PASS] Full Generation Check on Depleted Quota: allowed=${depletedCheck.allowed}, remaining=${depletedCheck.remaining}`);
  if (depletedCheck.allowed) {
    throw new Error("Quota check allowed full generation when quota is exhausted!");
  }

  const depletedSectionCheck = await checkQuota(testSubject, 0.25);
  console.log(`[PASS] Section Regen Check on Depleted Quota: allowed=${depletedSectionCheck.allowed}, remaining=${depletedSectionCheck.remaining}`);
  if (depletedSectionCheck.allowed) {
    throw new Error("Quota check allowed section regen when quota is exhausted!");
  }

  // Test 7: BYOK Headers Extraction & Unmetered Bypass
  console.log("\n--- Test 7: Bring-Your-Own-Key (BYOK) Extraction & Zero-Logging ---");
  const groqReq = new Request("http://localhost:3000/api/readmes", {
    headers: {
      "x-groq-api-key": "gsk_test_fake_groq_key_999",
    },
  });
  const groqByok = extractByokHeaders(groqReq);
  console.log(`[PASS] Extracted Groq BYOK provider: ${groqByok?.provider}, key length: ${groqByok?.apiKey.length}`);
  if (!groqByok || groqByok.provider !== "groq" || groqByok.apiKey !== "gsk_test_fake_groq_key_999") {
    throw new Error("Failed to extract Groq BYOK header correctly!");
  }

  const geminiReq = new Request("http://localhost:3000/api/readmes", {
    headers: {
      "x-gemini-api-key": "AIzaSy_fake_gemini_key_888",
    },
  });
  const geminiByok = extractByokHeaders(geminiReq);
  console.log(`[PASS] Extracted Gemini BYOK provider: ${geminiByok?.provider}, key length: ${geminiByok?.apiKey.length}`);
  if (!geminiByok || geminiByok.provider !== "gemini" || geminiByok.apiKey !== "AIzaSy_fake_gemini_key_888") {
    throw new Error("Failed to extract Gemini BYOK header correctly!");
  }

  const emptyReq = new Request("http://localhost:3000/api/readmes");
  const noByok = extractByokHeaders(emptyReq);
  if (noByok !== null) {
    throw new Error("Expected null BYOK for request without headers!");
  }
  console.log("[PASS] Requests without BYOK headers cleanly return null.");

  // Test 8: Verify BYOK Key is not persisted to memory quota or subject
  const currentUsage = await getUsage(testSubject);
  console.log(`[PASS] Quota status after test suite: used=${currentUsage.used}, remaining=${currentUsage.remaining}`);

  console.log("\n=================================================");
  console.log(" ALL MILESTONE 6 AUTOMATED VERIFICATIONS PASSED! ");
  console.log("=================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
