import { Facts, FactsSchema, GitHubRawUserResponse, TopLanguage, TopRepo, GitHubFactError } from "./types";

export function normalizeRawGitHubUser(
  raw: GitHubRawUserResponse,
  targetLogin: string
): Facts {
  const user = raw.user;
  if (!user) {
    throw new GitHubFactError(`GitHub user '${targetLogin}' not found`, "USER_NOT_FOUND", 404);
  }

  // 1. Bio truncation to 300 characters
  const bio = user.bio
    ? user.bio.length > 300
      ? user.bio.slice(0, 297) + "..."
      : user.bio
    : null;

  // 2. Filter & sort repositories
  const allRepos = (user.repositories?.nodes || []).filter(
    (repo): repo is NonNullable<typeof repo> => repo !== null && !repo.isArchived
  );

  // Check for profile README repo (named identically to login)
  const hasProfileReadme = allRepos.some(
    (repo) => repo.name.toLowerCase() === user.login.toLowerCase()
  );

  // Sort by stars desc, then pushedAt desc
  const sortedRepos = [...allRepos].sort((a, b) => {
    if (b.stargazerCount !== a.stargazerCount) {
      return b.stargazerCount - a.stargazerCount;
    }
    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
  });

  // Take top 6 repos
  const topRepos: TopRepo[] = sortedRepos.slice(0, 6).map((repo) => {
    const description = repo.description
      ? repo.description.length > 120
        ? repo.description.slice(0, 117) + "..."
        : repo.description
      : null;

    const topics = (repo.repositoryTopics?.nodes || [])
      .map((t) => t?.topic?.name)
      .filter((t): t is string => Boolean(t));

    return {
      name: repo.name,
      description,
      url: repo.url,
      stars: repo.stargazerCount,
      language: repo.primaryLanguage?.name || null,
      topics,
      pushedAt: repo.pushedAt,
    };
  });

  // 3. Sum language sizes across repos and compute percentages
  const languageSizes: Record<string, number> = {};
  let totalSize = 0;

  for (const repo of allRepos) {
    if (repo.languages?.edges) {
      for (const edge of repo.languages.edges) {
        if (edge && edge.node?.name && edge.size > 0) {
          const langName = edge.node.name;
          languageSizes[langName] = (languageSizes[langName] || 0) + edge.size;
          totalSize += edge.size;
        }
      }
    }
  }

  const topLanguages: TopLanguage[] = Object.entries(languageSizes)
    .map(([name, size]) => ({
      name,
      percent: totalSize > 0 ? Math.round((size / totalSize) * 1000) / 10 : 0,
    }))
    .filter((l) => l.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 8);

  // 4. Pinned items
  const pinned = (user.pinnedItems?.nodes || [])
    .map((item) => item?.name)
    .filter((name): name is string => Boolean(name));

  // 5. Contributions
  const contributions = {
    commits: user.contributionsCollection?.totalCommitContributions ?? 0,
    pullRequests: user.contributionsCollection?.totalPullRequestContributions ?? 0,
  };

  const facts: Facts = {
    login: user.login,
    name: user.name || null,
    bio,
    location: user.location || null,
    websiteUrl: user.websiteUrl || null,
    avatarUrl: user.avatarUrl,
    followers: user.followers?.totalCount ?? 0,
    topLanguages,
    topRepos,
    pinned,
    contributions,
    hasProfileReadme,
  };

  return FactsSchema.parse(facts);
}
