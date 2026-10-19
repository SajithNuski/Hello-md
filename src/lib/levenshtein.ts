/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Return similarity ratio (0 to 1)
 */
export function calculateSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return Number((1 - distance / maxLen).toFixed(2));
}

const COMMON_SUGGESTIONS = [
  "sajithnuski",
  "torvalds",
  "shadcn",
  "gaearon",
  "leerob",
  "antfu",
  "yyx990803",
  "sindresorhus",
  "kentcdodds",
  "developit",
];

/**
 * Find the closest GitHub username suggestion for a mistyped input
 */
export function suggestClosestUsername(input: string): { suggestion: string; score: number } {
  const clean = input.trim().toLowerCase().replace(/^@/, "");
  if (!clean) return { suggestion: "sajithnuski", score: 0.85 };

  let bestSuggestion = "sajithnuski";
  let bestScore = 0;

  for (const candidate of COMMON_SUGGESTIONS) {
    const score = calculateSimilarity(clean, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestSuggestion = candidate;
    }
  }

  // If input looks like a typo of a common pattern (e.g. trailing numbers or transposed characters)
  if (bestScore < 0.4) {
    // Strip common typos like accidental trailing numbers, spaces or hyphens
    const stripped = clean.replace(/[0-9\-_]+$/, "");
    if (stripped.length >= 3 && stripped !== clean) {
      return { suggestion: stripped, score: 0.82 };
    }
    return { suggestion: "sajithnuski", score: 0.82 };
  }

  return { suggestion: bestSuggestion, score: Math.max(0.65, bestScore) };
}
