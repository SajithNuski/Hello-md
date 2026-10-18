import OpenAI from "openai";
import { LLMProvider, AIError } from "../types";
import { env } from "@/lib/env";

export class GroqProvider implements LLMProvider {
  readonly id = "groq" as const;
  readonly model: string;
  private client: OpenAI;

  constructor(model: string, apiKey?: string) {
    this.model = model;
    const key = apiKey || env.GROQ_API_KEY;
    if (!key) {
      throw new AIError("Groq API key is missing", "AUTH_ERROR", {
        status: 401,
        provider: "groq",
        model,
      });
    }

    this.client = new OpenAI({
      apiKey: key,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async generateJson(args: {
    system: string;
    user: string;
    maxOutputTokens: number;
    temperature: number;
    signal: AbortSignal;
  }): Promise<{ text: string; usage?: { input: number; output: number } }> {
    try {
      const response = await this.client.chat.completions.create(
        {
          model: this.model,
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
          ],
          response_format: { type: "json_object" },
          temperature: args.temperature,
          max_tokens: args.maxOutputTokens,
        },
        { signal: args.signal }
      );

      const text = response.choices[0]?.message?.content?.trim() || "";
      if (!text) {
        throw new AIError("Empty response returned by Groq", "INVALID_OUTPUT", {
          provider: "groq",
          model: this.model,
        });
      }

      const usage = response.usage
        ? {
            input: response.usage.prompt_tokens,
            output: response.usage.completion_tokens,
          }
        : undefined;

      return { text, usage };
    } catch (err: unknown) {
      if (err instanceof AIError) throw err;

      const anyErr = err as {
        status?: number;
        message?: string;
        headers?: Record<string, string>;
        name?: string;
      };

      if (anyErr?.name === "AbortError" || args.signal.aborted) {
        throw new AIError("Groq request timed out", "TIMEOUT", {
          status: 504,
          provider: "groq",
          model: this.model,
        });
      }

      if (anyErr?.status === 429) {
        const retryHeader = anyErr.headers?.["retry-after"];
        const retryAfter = retryHeader ? parseInt(retryHeader, 10) || 60 : 60;
        throw new AIError(`Groq rate limit exceeded: ${anyErr.message}`, "RATE_LIMIT", {
          status: 429,
          retryAfter,
          provider: "groq",
          model: this.model,
        });
      }

      if (anyErr?.status === 401 || anyErr?.status === 403) {
        throw new AIError(`Groq authentication failed: ${anyErr.message}`, "AUTH_ERROR", {
          status: anyErr.status,
          provider: "groq",
          model: this.model,
        });
      }

      throw new AIError(
        `Groq provider error: ${anyErr?.message || String(err)}`,
        "PROVIDER_ERROR",
        {
          status: anyErr?.status || 500,
          provider: "groq",
          model: this.model,
        }
      );
    }
  }
}
