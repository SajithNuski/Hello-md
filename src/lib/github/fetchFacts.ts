import { graphql } from "@octokit/graphql";
import { GITHUB_USER_QUERY } from "./query";
import { normalizeRawGitHubUser } from "./normalize";
import { Facts, FactsSchema, GitHubRawUserResponse, GitHubFactError } from "./types";
export { GitHubFactError };
import { getGithubFactsCollection } from "@/lib/db/collections";
import { env } from "@/lib/env";

/**
 * Fallback fetch using public GitHub REST API when no token is configured
 */
async function fetchViaRest(login: string): Promise<GitHubRawUserResponse> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Hello-md-App",
  };

  const token = env.GITHUB_SERVER_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 1. Fetch user details
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (userRes.status === 404) {
    throw new GitHubFactError(`GitHub user '${login}' does not exist`, "USER_NOT_FOUND", 404);
  }

  if (!userRes.ok) {
    const errorText = await userRes.text();
    throw new GitHubFactError(
      `GitHub API error: ${userRes.status} ${errorText}`,
      "GITHUB_API_ERROR",
      userRes.status
    );
  }

  const userData = await userRes.json();

  if (userData.type === "Organization") {
    throw new GitHubFactError(
      `'${login}' is an organization. Hello-md only supports personal profiles.`,
      "ORGANIZATION_NOT_SUPPORTED",
      400
    );
  }

  // 2. Fetch public repositories
  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=30&sort=pushed`,
    { headers, next: { revalidate: 3600 } }
  );

  const reposData = reposRes.ok ? await reposRes.json() : [];

  const rawRepos = Array.isArray(reposData)
    ? reposData
      .filter((r) => !r.fork && !r.archived)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stargazerCount: r.stargazers_count ?? 0,
        pushedAt: r.pushed_at,
        isArchived: Boolean(r.archived),
        primaryLanguage: r.language ? { name: r.language } : null,
        languages: r.language
          ? {
            edges: [{ size: 1000, node: { name: r.language } }],
          }
          : undefined,
        repositoryTopics: Array.isArray(r.topics)
          ? {
            nodes: r.topics.map((topic: string) => ({ topic: { name: topic } })),
          }
          : undefined,
      }))
    : [];

  return {
    user: {
      login: userData.login,
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
      company: userData.company,
      websiteUrl: userData.blog || null,
      avatarUrl: userData.avatar_url,
      followers: {
        totalCount: userData.followers ?? 0,
      },
      pinnedItems: { nodes: [] },
      repositories: { nodes: rawRepos },
      contributionsCollection: {
        totalCommitContributions: 0,
        totalPullRequestContributions: 0,
      },
    },
  };
}

export async function fetchFacts(
  login: string,
  userToken?: string
): Promise<Facts> {
  const normalizedLogin = login.trim().toLowerCase();

  // 1. Check MongoDB cache first (TTL 1 hour)
  try {
    const col = await getGithubFactsCollection();
    const cached = await col.findOne({ login: normalizedLogin });
    if (cached && cached.facts) {
      const oneHourAgo = new Date(Date.now() - 3600 * 1000);
      if (cached.fetchedAt && cached.fetchedAt > oneHourAgo) {
        const parsed = FactsSchema.safeParse(cached.facts);
        if (parsed.success) {
          return parsed.data;
        }
      }
    }
  } catch (err) {
    // Graceful degradation if MongoDB is offline or connecting
    console.warn("MongoDB cache check bypassed:", (err as Error).message);
  }

  // 2. Determine auth token
  const token = userToken || env.GITHUB_SERVER_TOKEN;
  let rawResponse: GitHubRawUserResponse;

  if (token) {
    try {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer ${token}`,
        },
      });

      rawResponse = await graphqlWithAuth<GitHubRawUserResponse>(GITHUB_USER_QUERY, {
        login: normalizedLogin,
      });

      if (!rawResponse || !rawResponse.user) {
        throw new GitHubFactError(`GitHub user '${login}' does not exist`, "USER_NOT_FOUND", 404);
      }
    } catch (err: unknown) {
      if (err instanceof GitHubFactError) throw err;
      const gqlError = err as {
        status?: number;
        message?: string;
        errors?: Array<{ type?: string; message?: string }>;
      };
      if (
        gqlError?.status === 404 ||
        gqlError?.errors?.some((e) => e.type === "NOT_FOUND")
      ) {
        throw new GitHubFactError(`GitHub user '${login}' does not exist`, "USER_NOT_FOUND", 404);
      }
      // If token fails or is invalid, fallback to REST
      console.warn("GraphQL fetch failed, falling back to REST:", gqlError?.message || String(err));
      rawResponse = await fetchViaRest(normalizedLogin);
    }
  } else {
    // If no token, use public REST
    rawResponse = await fetchViaRest(normalizedLogin);
  }

  // 3. Normalize
  const facts = normalizeRawGitHubUser(rawResponse, login);

  // 4. Save to cache
  try {
    const col = await getGithubFactsCollection();
    await col.updateOne(
      { login: normalizedLogin },
      {
        $set: {
          login: normalizedLogin,
          facts,
          fetchedAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.warn("Could not write to githubFacts cache:", (err as Error).message);
  }

  return facts;
}
