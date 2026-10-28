import crypto from "crypto";

export const OWNER_COOKIE_NAME = "hellomd_owner";

export interface ByokConfig {
  provider: "groq" | "gemini";
  apiKey: string;
}

/**
 * Extract or generate an anonymous owner ID from request cookies
 */
export function getOrCreateOwnerId(req: Request): { ownerId: string; isNew: boolean } {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${OWNER_COOKIE_NAME}=([^;]+)`));

  if (match && match[1]) {
    let val = decodeURIComponent(match[1]).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    return { ownerId: val, isNew: false };
  }

  const newOwnerId = `anon_${crypto.randomUUID().replace(/-/g, "")}`;
  return { ownerId: newOwnerId, isNew: true };
}

/**
 * Extract client IP from request headers with fallback to localhost
 */
export function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0];
    if (first) return first.trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

/**
 * Get subject ID for quota tracking:
 * If signed in, returns userId; otherwise returns SHA-256(ip + ":" + ownerId)
 */
export function getSubjectId(req: Request, authenticatedUserId?: string | null): string {
  if (authenticatedUserId) {
    return `user_${authenticatedUserId}`;
  }

  const customUserId = req.headers.get("x-user-id");
  if (customUserId) {
    return `user_${customUserId.trim()}`;
  }

  const ip = getClientIp(req);
  const { ownerId } = getOrCreateOwnerId(req);
  const hash = crypto.createHash("sha256").update(`${ip}:${ownerId}`).digest("hex");

  return `anon_${hash.slice(0, 24)}`;
}

/**
 * Extract Bring-Your-Own-Key headers from request.
 * Keys are never logged and never stored on the server.
 */
export function extractByokHeaders(req: Request): ByokConfig | null {
  const groqKey = req.headers.get("x-groq-api-key")?.trim();
  if (groqKey) {
    return { provider: "groq", apiKey: groqKey };
  }

  const geminiKey = req.headers.get("x-gemini-api-key")?.trim();
  if (geminiKey) {
    return { provider: "gemini", apiKey: geminiKey };
  }

  return null;
}
