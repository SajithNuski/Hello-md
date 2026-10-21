import { Facts } from "@/lib/github/types";

/**
 * Richer, still-grounded slice of Facts for the prompt.
 * Replace your existing extractFactsSlice with this (or merge any extra fields
 * yours already has). The model can only be specific if it is given specifics.
 * Years come from pushedAt (year only), matching extractAllowedNumbers.
 */
export function extractFactsSlice(facts: Facts) {
  return {
    name: facts.name,
    bio: facts.bio,
    location: facts.location,
    followers: facts.followers,
    contributions: facts.contributions,
    topLanguages: facts.topLanguages.map((l) => ({
      name: l.name,
      percent: Math.round(l.percent),
    })),
    topRepos: facts.topRepos.map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stars,
      topics: r.topics,
      lastPushYear: r.pushedAt?.slice(0, 4),
    })),
  };
}
