import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { TEMPLATES_CONFIG } from "@/lib/templates/templatesConfig";
import { getReadmesCollection, SectionItem } from "@/lib/db/collections";
import { memoryDrafts } from "@/lib/db/draftStore";
import { getOrCreateOwnerId, OWNER_COOKIE_NAME } from "@/lib/owner";
import { getAuthSession } from "@/lib/auth";
import { APP_CONFIG } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { slug, customUsername } = body as { slug?: string; customUsername?: string };

    if (!slug) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Template slug is required" } },
        { status: 400 }
      );
    }

    const template = TEMPLATES_CONFIG.find((t) => t.slug === slug);
    if (!template) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Template not found" } },
        { status: 404 }
      );
    }

    const session = await getAuthSession();
    const authUserId = session?.user?.id || session?.user?.githubId;
    const sessionLogin = session?.user?.login;

    const { ownerId: anonOwnerId, isNew } = getOrCreateOwnerId(req);
    const ownerId = authUserId ? `user_${authUserId}` : anonOwnerId;

    const effectiveLogin = customUsername?.trim() || sessionLogin || template.defaultTokens.username || "octocat";

    // Build the template's editable sections using its single source of truth
    let sections: SectionItem[] = [];
    if (template.createSections) {
      sections = template.createSections({
        username: effectiveLogin,
        name: session?.user?.name || effectiveLogin,
      });
    }

    const draftId = `draft_${crypto.randomUUID().replace(/-/g, "")}`;
    const doc = {
      ownerId,
      login: effectiveLogin,
      tone: "professional" as const,
      theme: template.theme,
      sections,
      promptVersion: APP_CONFIG.promptVersion,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    try {
      const col = await getReadmesCollection();
      const insertRes = await col.insertOne(doc);
      if (insertRes.insertedId) {
        // Use MongoDB string id if available
        const realId = insertRes.insertedId.toString();
        memoryDrafts.set(realId, { ...doc, _id: realId });
        const res = NextResponse.json({ readmeId: realId, redirectUrl: `/editor/${realId}` });
        if (isNew) {
          res.headers.set(
            "Set-Cookie",
            `${OWNER_COOKIE_NAME}=${encodeURIComponent(ownerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
          );
        }
        return res;
      }
    } catch (err: unknown) {
      console.warn("MongoDB unavailable to persist template draft, using memory fallback:", (err as Error).message);
    }

    // Fallback: save to memory drafts
    memoryDrafts.set(draftId, { ...doc, _id: draftId });

    const res = NextResponse.json({ readmeId: draftId, redirectUrl: `/editor/${draftId}` });
    if (isNew) {
      res.headers.set(
        "Set-Cookie",
        `${OWNER_COOKIE_NAME}=${encodeURIComponent(ownerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
      );
    }
    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: (error as Error).message } },
      { status: 500 }
    );
  }
}
