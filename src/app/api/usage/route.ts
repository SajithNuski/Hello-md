import { NextRequest } from "next/server";
import { getSubjectId, extractByokHeaders, getOrCreateOwnerId, OWNER_COOKIE_NAME } from "@/lib/owner";
import { getUsage } from "@/lib/quota";
import { getAuthSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const authUserId = session?.user?.id || session?.user?.githubId;
  const { ownerId, isNew } = getOrCreateOwnerId(req);
  const byok = extractByokHeaders(req);

  let responseData;
  if (byok) {
    responseData = {
      unlimited: true,
      isByok: true,
      isAuthenticated: Boolean(authUserId),
      byokProvider: byok.provider,
      used: 0,
      remaining: 999,
      limit: 999,
      resetsAt: null,
      resetTimeFormatted: "Unlimited (BYOK)",
      secondsUntilReset: 0,
    };
  } else if (authUserId) {
    const subjectId = getSubjectId(req, authUserId);
    const usage = await getUsage(subjectId);
    responseData = {
      unlimited: true,
      isByok: false,
      isAuthenticated: true,
      userLogin: session?.user?.login || session?.user?.name,
      used: usage.used,
      remaining: 999,
      limit: 999,
      resetsAt: null,
      resetTimeFormatted: "Unlimited (Signed in)",
      secondsUntilReset: 0,
    };
  } else {
    const subjectId = getSubjectId(req);
    const usage = await getUsage(subjectId);
    responseData = {
      unlimited: false,
      isByok: false,
      isAuthenticated: false,
      ...usage,
    };
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  });

  if (isNew) {
    headers.set(
      "Set-Cookie",
      `${OWNER_COOKIE_NAME}=${encodeURIComponent(ownerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  return new Response(JSON.stringify(responseData), { status: 200, headers });
}
