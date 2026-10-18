export interface LLMProvider {
  id: "groq" | "gemini";
  model: string;
  generateJson(args: {
    system: string;
    user: string;
    maxOutputTokens: number;
    temperature: number;
    signal: AbortSignal;
  }): Promise<{ text: string; usage?: { input: number; output: number } }>;
}

export type LLMResult = {
  text: string;
  provider: "groq" | "gemini" | "cache";
  model: string;
  cached: boolean;
  usage?: { input: number; output: number };
};

export class AIError extends Error {
  code: "AI_BUSY" | "RATE_LIMIT" | "INVALID_OUTPUT" | "TIMEOUT" | "AUTH_ERROR" | "PROVIDER_ERROR";
  status: number;
  retryAfter?: number;
  provider?: string;
  model?: string;

  constructor(
    message: string,
    code: AIError["code"],
    options?: { status?: number; retryAfter?: number; provider?: string; model?: string }
  ) {
    super(message);
    this.name = "AIError";
    this.code = code;
    this.status = options?.status || 500;
    this.retryAfter = options?.retryAfter;
    this.provider = options?.provider;
    this.model = options?.model;
    Object.setPrototypeOf(this, AIError.prototype);
  }
}

export interface RouterRequest {
  system: string;
  user: string;
  maxOutputTokens?: number;
  temperature?: number;
  cacheKey?: string;
  byok?: {
    provider: "groq" | "gemini";
    apiKey: string;
    model?: string;
  };
}
