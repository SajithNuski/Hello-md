import "server-only";
import { NextAuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { cookies } from "next/headers";
import { env } from "./env";
import { encryptToken, decryptToken } from "./crypto";
import { getUsersCollection, getReadmesCollection } from "./db/collections";
import { OWNER_COOKIE_NAME } from "./owner";

export interface GitHubOAuthProfile {
  id?: string | number;
  login?: string;
  avatar_url?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string;
      githubId?: string;
    };
  }
}

// In-memory fallback for user records if MongoDB is offline or unavailable
const memoryUsers = new Map<string, { githubId: string; login: string; encToken: string }>();

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID || "",
      clientSecret: env.GITHUB_SECRET || "",
      authorization: "https://github.com/login/oauth/authorize?scope=read:user+public_repo",
    }),
  ],
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign-in: capture access token and profile info
      if (account && profile) {
        const ghProfile = profile as GitHubOAuthProfile;
        const githubId = String(ghProfile.id || token.sub || "");
        const login = String(ghProfile.login || token.name || "").toLowerCase();
        const avatarUrl = String(ghProfile.avatar_url || token.picture || "");
        const rawToken = account.access_token || "";

        if (rawToken) {
          const encToken = encryptToken(rawToken);
          token.encToken = encToken;
          token.githubId = githubId;
          token.login = login;

          // Cache in memory for instant local retrieval
          memoryUsers.set(githubId, { githubId, login, encToken });

          try {
            // Upsert user in MongoDB
            const users = await getUsersCollection();
            await users.updateOne(
              { githubId },
              {
                $set: {
                  githubId,
                  login,
                  avatarUrl: avatarUrl || "https://github.com/ghost.png",
                  encToken,
                  updatedAt: new Date(),
                },
                $setOnInsert: {
                  createdAt: new Date(),
                },
              },
              { upsert: true }
            );

            // Reassign anonymous drafts if owner cookie is present
            try {
              const cookieStore = cookies();
              const anonOwnerCookie = cookieStore.get(OWNER_COOKIE_NAME)?.value;
              if (anonOwnerCookie && anonOwnerCookie.startsWith("anon_")) {
                const userOwnerId = `user_${githubId}`;
                const readmes = await getReadmesCollection();
                const reassignResult = await readmes.updateMany(
                  { ownerId: anonOwnerCookie },
                  { $set: { ownerId: userOwnerId, updatedAt: new Date() } }
                );
                if (reassignResult.modifiedCount > 0) {
                  console.log(
                    `Reassigned ${reassignResult.modifiedCount} drafts from ${anonOwnerCookie} to ${userOwnerId}`
                  );
                }
              }
            } catch {
              // Ignore cookies read error if in an unsupported context
            }
          } catch (err) {
            console.warn("MongoDB unavailable to persist user, using memory store:", (err as Error).message);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.githubId as string;
        session.user.login = token.login as string;
        session.user.githubId = token.githubId as string;
      }
      return session;
    },
  },
};

/**
 * Get current server session
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Get decrypted GitHub OAuth access token for a given user
 */
export async function getUserAccessToken(githubId: string): Promise<string | null> {
  if (!githubId) return null;

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ githubId });
    if (user && user.encToken) {
      return decryptToken(user.encToken);
    }
  } catch (err) {
    console.warn("MongoDB unavailable to read user token, checking memory fallback:", (err as Error).message);
  }

  const memUser = memoryUsers.get(githubId);
  if (memUser && memUser.encToken) {
    return decryptToken(memUser.encToken);
  }

  return null;
}
