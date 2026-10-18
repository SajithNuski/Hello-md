import crypto from "crypto";

export const OWNER_COOKIE_NAME = "hellomd_owner";

/**
 * Extract or generate an anonymous owner ID from request cookies
 */
export function getOrCreateOwnerId(req: Request): { ownerId: string; isNew: boolean } {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${OWNER_COOKIE_NAME}=([^;]+)`));

  if (match && match[1]) {
    return { ownerId: decodeURIComponent(match[1]), isNew: false };
  }

  const newOwnerId = `anon_${crypto.randomUUID().replace(/-/g, "")}`;
  return { ownerId: newOwnerId, isNew: true };
}
