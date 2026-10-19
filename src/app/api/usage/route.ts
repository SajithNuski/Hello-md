import { NextRequest } from "next/server";
import { getSubjectId, extractByokHeaders, getOrCreateOwnerId, OWNER_COOKIE_NAME } from "@/lib/owner";
import { getUsage } from "@/lib/quota";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { ownerId, isNew } = getOrCreateOwnerId(req);
  const byok = extractByokHeaders(req);

  let responseData;
  if (byok) {
    responseData = {
      unlimited: true,
      isByok: true,
      byokProvider: byok.provider,
      used: 0,
      remaining: 999,
      limit: 999,
      resetsAt: null,
      resetTimeFormatted: "Unlimited (BYOK)",
      secondsUntilReset: 0,
    };
  } else {
    const subjectId = getSubjectId(req);
    const usage = await getUsage(subjectId);
    responseData = {
      unlimited: false,
      isByok: false,
      ...usage,
    };
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
  });

  if (isNew) {
    headers.set(
      "Set-Cookie",
      `${OWNER_COOKIE_NAME}=${encodeURIComponent(ownerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  return new Response(JSON.stringify(responseData), { status: 200, headers });
}
