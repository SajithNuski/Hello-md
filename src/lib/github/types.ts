import { z } from "zod";

export class GitHubFactError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number = 400) {
    super(message);
    this.name = "GitHubFactError";
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, GitHubFactError.prototype);
  }
}

export const TopLanguageSchema = z.object({
  name: z.string(),
  percent: z.number().min(0).max(100),
});
export type TopLanguage = z.infer<typeof TopLanguageSchema>;

export const TopRepoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  url: z.string().url(),
  stars: z.number().int().nonnegative(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  pushedAt: z.string(),
});
export type TopRepo = z.infer<typeof TopRepoSchema>;

export const ContributionsSchema = z.object({
  commits: z.number().int().nonnegative(),
  pullRequests: z.number().int().nonnegative(),
});
export type Contributions = z.infer<typeof ContributionsSchema>;

export const FactsSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  avatarUrl: z.string().url(),
  followers: z.number().int().nonnegative(),
  topLanguages: z.array(TopLanguageSchema).max(8),
  topRepos: z.array(TopRepoSchema).max(6),
  pinned: z.array(z.string()),
  contributions: ContributionsSchema,
  hasProfileReadme: z.boolean(),
});
export type Facts = z.infer<typeof FactsSchema>;

export type GitHubRawUserResponse = {
  user: {
    name: string | null;
    login: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    websiteUrl: string | null;
    avatarUrl: string;
    followers: {
      totalCount: number;
    };
    pinnedItems?: {
      nodes: Array<{ name: string } | null>;
    };
    repositories: {
      nodes: Array<{
        name: string;
        description: string | null;
        url: string;
        stargazerCount: number;
        pushedAt: string;
        isArchived: boolean;
        primaryLanguage: { name: string } | null;
        languages?: {
          edges: Array<{
            size: number;
            node: { name: string };
          }>;
        };
        repositoryTopics?: {
          nodes: Array<{
            topic: { name: string };
          }>;
        };
      } | null>;
    };
    contributionsCollection?: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
    };
  } | null;
};
