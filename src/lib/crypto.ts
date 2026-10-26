import "server-only";
import crypto from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 32-byte encryption key from TOKEN_ENC_KEY or fallback to AUTH_SECRET
 */
function getEncryptionKey(): Buffer {
  if (env.TOKEN_ENC_KEY && env.TOKEN_ENC_KEY.trim().length > 0) {
    try {
      const buffer = Buffer.from(env.TOKEN_ENC_KEY.trim(), "base64");
      if (buffer.length === 32) {
        return buffer;
      }
      // If not 32 bytes base64, hash it to exactly 32 bytes
      return crypto.createHash("sha256").update(buffer).digest();
    } catch {
      // Fallback
    }
  }

  // Fallback: derive 32-byte key from AUTH_SECRET
  return crypto.createHash("sha256").update(env.AUTH_SECRET).digest();
}

/**
 * Encrypt a plaintext token using AES-256-GCM
 * Returns string in format: `iv.authTag.ciphertext` (all hex encoded)
 */
export function encryptToken(token: string): string {
  if (!token) return "";

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}.${tag.toString("hex")}.${encrypted.toString("hex")}`;
}

/**
 * Decrypt an AES-256-GCM encrypted token string
 */
export function decryptToken(encryptedString: string): string {
  if (!encryptedString) return "";

  const parts = encryptedString.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, tagHex, cipherHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(cipherHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}

/**
 * Utility to generate a new 32-byte random base64 key for TOKEN_ENC_KEY
 */
export function generateTokenEncKey(): string {
  return crypto.randomBytes(32).toString("base64");
}
