import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getAuthSession, getUserAccessToken } from "@/lib/auth";
import { getReadmesCollection, SectionItem } from "@/lib/db/collections";
import { publishReadmeToGithub } from "@/lib/github/publish";

export const runtime = "nodejs";

const PublishBodySchema = z.object({
  commitMessage: z.string().max(200).optional(),
  confirmOverwrite: z.boolean().optional().default(false),
  markdown: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Authenticate user session
  const session = await getAuthSession();
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in with GitHub to publish directly to your repository.",
        },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const githubId = session.user.githubId || session.user.id;
  const userLogin = (session.user.login || session.user.name || "").toLowerCase();

  if (!githubId || !userLogin) {
    return new Response(
      JSON.stringify({
        error: {
          code: "INVALID_SESSION",
          message: "Session is missing GitHub user profile information. Please sign in again.",
        },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Retrieve decrypted OAuth access token
  const token = await getUserAccessToken(githubId);
  if (!token) {
    return new Response(
      JSON.stringify({
        error: {
          code: "NO_TOKEN",
          message: "GitHub OAuth token not found or expired. Please sign in again.",
        },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Parse request body
  let body: z.infer<typeof PublishBodySchema>;
  try {
    const json = await req.json().catch(() => ({}));
    body = PublishBodySchema.parse(json);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request payload";
    return new Response(
      JSON.stringify({
        error: {
          code: "INVALID_BODY",
          message,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4. Resolve markdown content
  let markdown = body.markdown;

  if (!markdown) {
    // Attempt to read and assemble from MongoDB
    try {
      if (ObjectId.isValid(id)) {
        const col = await getReadmesCollection();
        const doc = await col.findOne({ _id: new ObjectId(id) });

        if (doc && doc.sections) {
          markdown = doc.sections
            .filter((s: SectionItem) => s.enabled)
            .sort((a: SectionItem, b: SectionItem) => a.order - b.order)
            .map((s: SectionItem) => s.markdown)
            .join("\n\n");
        }
      }
    } catch {
      // In-memory fallback
    }

    if (!markdown) {
      const { memoryDrafts } = await import("@/lib/db/draftStore");
      const memDoc = memoryDrafts.get(id);
      if (memDoc && memDoc.sections) {
        markdown = memDoc.sections
          .filter((s: SectionItem) => s.enabled)
          .sort((a: SectionItem, b: SectionItem) => a.order - b.order)
          .map((s: SectionItem) => s.markdown)
          .join("\n\n");
      }
    }
  }

  if (!markdown || !markdown.trim()) {
    return new Response(
      JSON.stringify({
        error: {
          code: "EMPTY_MARKDOWN",
          message: "Could not find or assemble markdown content for this draft.",
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 5. Execute GitHub publish flow
  try {
    const result = await publishReadmeToGithub({
      token,
      login: userLogin,
      markdown,
      commitMessage: body.commitMessage,
      confirmOverwrite: body.confirmOverwrite,
    });

    if (result.needsConfirmation) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NEEDS_CONFIRMATION",
            message: "A profile README.md already exists in your repository.",
            diff: result.diff,
            sha: result.sha,
          },
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        commitUrl: result.commitUrl,
        contentUrl: result.contentUrl,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Publish to GitHub failed:", err);
    const message = err instanceof Error ? err.message : "Failed to commit README.md to GitHub.";
    return new Response(
      JSON.stringify({
        error: {
          code: "PUBLISH_FAILED",
          message,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
