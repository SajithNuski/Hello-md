export interface ClientByokConfig {
  provider: "groq" | "gemini";
  apiKey: string;
}

const STORAGE_KEY = "hellomd_byok";

/**
 * Retrieve saved BYOK configuration from localStorage
 */
export function getByokConfig(): ClientByokConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.provider === "groq" || parsed.provider === "gemini") && parsed.apiKey) {
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return null;
}

/**
 * Save BYOK configuration to localStorage and notify listeners
 */
export function setByokConfig(config: ClientByokConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("hellomd:byok-updated", { detail: config }));
  } catch (err) {
    console.warn("Failed to persist BYOK config to localStorage:", err);
  }
}

/**
 * Remove BYOK configuration
 */
export function clearByokConfig(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("hellomd:byok-updated", { detail: null }));
  } catch (err) {
    console.warn("Failed to clear BYOK config from localStorage:", err);
  }
}

/**
 * Get HTTP headers for BYOK requests
 */
export function getByokHeaders(): Record<string, string> {
  const config = getByokConfig();
  if (!config) return {};

  if (config.provider === "groq") {
    return { "x-groq-api-key": config.apiKey };
  } else if (config.provider === "gemini") {
    return { "x-gemini-api-key": config.apiKey };
  }
  return {};
}
