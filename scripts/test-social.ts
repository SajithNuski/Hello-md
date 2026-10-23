import {
  SocialConfig,
  getDefaultSocialConfig,
  normalizeSocialUrl,
  validateSocialField,
  generateContactMarkdown,
  parseContactMarkdown,
  SAMPLE_SOCIAL_OUTPUT,
} from "../src/lib/socialConfig";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
}

console.log("--- 1. Testing Default / Empty Fallback ---");
const defaultConfig = getDefaultSocialConfig();
const emptyMarkdown = generateContactMarkdown(defaultConfig);
assert(emptyMarkdown.includes("<!-- Replace with your own links -->"), "Empty config includes sample fallback comment");
assert(emptyMarkdown.includes("https://linkedin.com/in/your-username"), "Empty config has sample LinkedIn URL");
assert(emptyMarkdown.includes("https://x.com/your-handle"), "Empty config has sample X URL");
assert(emptyMarkdown.includes("https://your-site.com"), "Empty config has sample Portfolio URL");
assert(emptyMarkdown.includes("mailto:you@example.com"), "Empty config has sample Email URL");
assert(emptyMarkdown.includes("## 🤝 Connect With Me"), "Empty config has proper heading");

console.log("\n--- 2. Testing Username & URL Normalization ---");
assert(normalizeSocialUrl("linkedin", "johndoe") === "https://linkedin.com/in/johndoe", "LinkedIn username normalization");
assert(normalizeSocialUrl("linkedin", "@johndoe") === "https://linkedin.com/in/johndoe", "LinkedIn @username normalization");
assert(normalizeSocialUrl("linkedin", "https://linkedin.com/in/johndoe") === "https://linkedin.com/in/johndoe", "LinkedIn full URL preserved");
assert(normalizeSocialUrl("x", "alice") === "https://x.com/alice", "X handle normalization");
assert(normalizeSocialUrl("x", "@alice") === "https://x.com/alice", "X @handle normalization");
assert(normalizeSocialUrl("x", "https://twitter.com/alice") === "https://x.com/alice", "Twitter URL migrated to x.com");

console.log("\n--- 3. Testing Validation Rules ---");
assert(validateSocialField("url", "https://example.com").isValid === true, "Valid https URL");
assert(validateSocialField("url", "http://example.com").isValid === false, "http URL rejected");
assert(validateSocialField("url", "not a url").isValid === false, "invalid text rejected");
assert(validateSocialField("email", "test@domain.com").isValid === true, "Valid email with @");
assert(validateSocialField("email", "invalidemail").isValid === false, "Email without @ rejected");

console.log("\n--- 4. Testing User Filled Links & Order ---");
const userConfig: SocialConfig = {
  linkedin: "https://linkedin.com/in/testuser",
  x: "https://x.com/testuser",
  portfolio: "https://mysite.org",
  email: "hello@mysite.org",
  extra: [
    { label: "Behance", url: "https://behance.net/testuser" },
    { label: "YouTube", url: "https://youtube.com/@testuser" },
  ],
};
const userMarkdown = generateContactMarkdown(userConfig);
assert(!userMarkdown.includes("<!-- Replace with your own links -->"), "User config does not include sample comment");
assert(userMarkdown.includes("badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"), "LinkedIn badge correct");
assert(userMarkdown.includes("badge/X-000000?style=for-the-badge&logo=x&logoColor=white"), "X badge correct");
assert(userMarkdown.includes("badge/Portfolio-FF5722?style=for-the-badge&logo=googlechrome&logoColor=white"), "Portfolio badge correct");
assert(userMarkdown.includes("badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"), "Email badge correct");
assert(userMarkdown.includes("badge/Behance-555555?style=for-the-badge&logo=behance&logoColor=white"), "Extra link Behance badge correct");
assert(userMarkdown.includes("badge/YouTube-555555?style=for-the-badge&logo=youtube&logoColor=white"), "Extra link YouTube badge correct");

// Order check
const linkedinIdx = userMarkdown.indexOf("LinkedIn");
const xIdx = userMarkdown.indexOf("badge/X-000000");
const portfolioIdx = userMarkdown.indexOf("Portfolio");
const emailIdx = userMarkdown.indexOf("Email");
const behanceIdx = userMarkdown.indexOf("Behance");
const youtubeIdx = userMarkdown.indexOf("YouTube");
assert(linkedinIdx < xIdx && xIdx < portfolioIdx && portfolioIdx < emailIdx && emailIdx < behanceIdx && behanceIdx < youtubeIdx, "Order is LinkedIn -> X -> Portfolio -> Email -> Extra links");

console.log("\n--- 5. Testing Extra Links Limit & Duplicates & Invalid Exclusions ---");
const edgeConfig: SocialConfig = {
  linkedin: "https://example.com/same",
  x: "",
  portfolio: "https://example.com/same", // duplicate of linkedin
  email: "notanemail", // invalid email
  extra: [
    { label: "Same", url: "https://example.com/same" }, // duplicate
    { label: "", url: "https://example.com/valid" }, // empty label excluded
    { label: "Invalid URL", url: "http://insecure.com" }, // http excluded
    { label: "Extra 1", url: "https://site1.com" },
    { label: "Extra 2", url: "https://site2.com" },
    { label: "Extra 3", url: "https://site3.com" },
    { label: "Extra 4", url: "https://site4.com" },
    { label: "Extra 5", url: "https://site5.com" },
    { label: "Extra 6", url: "https://site6.com" },
    { label: "Extra 7", url: "https://site7.com" },
    { label: "Extra 8", url: "https://site8.com" },
    { label: "Extra 9 (Should be excluded by 8 limit)", url: "https://site9.com" },
  ],
};
const edgeMarkdown = generateContactMarkdown(edgeConfig);
assert((edgeMarkdown.match(/https:\/\/example\.com\/same/g) || []).length === 1, "Duplicate URLs appear only once");
assert(!edgeMarkdown.includes("notanemail"), "Invalid email excluded");
assert(!edgeMarkdown.includes("http://insecure.com"), "Non-https URL excluded");
assert(!edgeMarkdown.includes("site9.com"), "Extra links strictly capped at 8");

console.log("\n--- 6. Testing Roundtrip Parsing ---");
const parsed = parseContactMarkdown(userMarkdown);
assert(parsed.linkedin === "https://linkedin.com/in/testuser", "Parsed LinkedIn");
assert(parsed.x === "https://x.com/testuser", "Parsed X");
assert(parsed.portfolio === "https://mysite.org", "Parsed Portfolio");
assert(parsed.email === "hello@mysite.org", "Parsed Email");
assert(parsed.extra?.length === 2, "Parsed 2 extra links");
assert(parsed.extra?.[0].label === "Behance", "Parsed Behance label");

console.log("\n--- 7. Testing Automatic Prepending of Usernames in generateContactMarkdown ---");
const usernameConfig: SocialConfig = {
  linkedin: "johndoe",
  x: "@janedoe",
  portfolio: "",
  email: "",
  extra: [],
};
const usernameMarkdown = generateContactMarkdown(usernameConfig);
assert(usernameMarkdown.includes("https://linkedin.com/in/johndoe"), "LinkedIn username automatically prepended in markdown");
assert(usernameMarkdown.includes("https://x.com/janedoe"), "X handle automatically prepended in markdown");

console.log("\n--- 8. Testing Trailing Slash Deduplication & Mailto Prefix Cleaning ---");
const dedupConfig: SocialConfig = {
  linkedin: "https://example.com/site",
  x: "",
  portfolio: "https://example.com/site/", // Trailing slash duplicate
  email: "mailto:test@example.com",
  extra: [
    { label: "Duplicate Site", url: "https://example.com/site" },
    { label: "Dev-To Community", url: "https://dev.to/test" },
  ],
};
const dedupMarkdown = generateContactMarkdown(dedupConfig);
assert(!dedupMarkdown.includes("mailto:mailto:"), "No duplicate mailto: prefix in email href");
assert(dedupMarkdown.includes("href=\"mailto:test@example.com\""), "Clean mailto href generated");
assert((dedupMarkdown.match(/example\.com\/site/g) || []).length === 1, "Duplicate URL with trailing slash deduplicated");
assert(dedupMarkdown.includes("badge/Dev--To%20Community-555555"), "Label dashes and spaces properly encoded for shields.io");

console.log("\nALL TESTS PASSED SUCCESSFULLY! 🎉");
