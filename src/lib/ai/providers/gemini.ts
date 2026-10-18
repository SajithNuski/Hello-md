import { GoogleGenAI } from "@google/genai";
import { LLMProvider, AIError } from "../types";
import { env } from "@/lib/env";

export class GeminiProvider implements LLMProvider {
  readonly id = "gemini" as const;
  readonly model: string;
  private ai: GoogleGenAI;

  constructor(model?: string, apiKey?: string) {
    this.model = model || env.GEMINI_MODEL || "gemini-1.5-flash";
    const key = apiKey || env.GEMINI_API_KEY;
    if (!key) {
      throw new AIError("Gemini API key is missing", "AUTH_ERROR", {
        status: 401,
        provider: "gemini",
        model: this.model,
      });
    }

    this.ai = new GoogleGenAI({ apiKey: key });
  }

  async generateJson(args: {
    system: string;
    user: string;
    maxOutputTokens: number;
    temperature: number;
    signal: AbortSignal;
  }): Promise<{ text: string; usage?: { input: number; output: number } }> {
    try {
      if (args.signal.aborted) {
        throw new AIError("Request was aborted before execution", "TIMEOUT", {
          status: 504,
          provider: "gemini",
          model: this.model,
        });
      }

      // Generate content with JSON schema / mime-type enforcement
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: args.user,
        config: {
          systemInstruction: args.system,
          temperature: args.temperature,
          maxOutputTokens: args.maxOutputTokens,
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "";
      if (!text) {
        throw new AIError("Empty response returned by Gemini", "INVALID_OUTPUT", {
          provider: "gemini",
          model: this.model,
        });
      }

      const usage = response.usageMetadata
        ? {
            input: response.usageMetadata.promptTokenCount ?? 0,
            output: response.usageMetadata.candidatesTokenCount ?? 0,
          }
        : undefined;

      return { text, usage };
    } catch (err: unknown) {
      if (err instanceof AIError) throw err;

      const anyErr = err as {
        status?: number;
        message?: string;
        code?: number | string;
        name?: string;
      };

      if (anyErr?.name === "AbortError" || args.signal.aborted) {
        throw new AIError("Gemini request timed out", "TIMEOUT", {
          status: 504,
          provider: "gemini",
          model: this.model,
        });
      }

      const msg = anyErr?.message || String(err);

      if (anyErr?.status === 429 || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        throw new AIError(`Gemini rate limit exceeded: ${msg}`, "RATE_LIMIT", {
          status: 429,
          retryAfter: 60,
          provider: "gemini",
          model: this.model,
        });
      }

      if (
        anyErr?.status === 401 ||
        anyErr?.status === 403 ||
        msg.includes("API key not valid") ||
        msg.includes("UNAUTHENTICATED")
      ) {
        throw new AIError(`Gemini authentication error: ${msg}`, "AUTH_ERROR", {
          status: 401,
          provider: "gemini",
          model: this.model,
        });
      }

      throw new AIError(`Gemini provider error: ${msg}`, "PROVIDER_ERROR", {
        status: anyErr?.status || 500,
        provider: "gemini",
        model: this.model,
      });
    }
  }
}
