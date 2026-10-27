import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { fetchFacts } from "@/lib/github/fetchFacts";
import { GitHubFactError } from "@/lib/github/types";
import { buildSystemPrompt, buildUserPrompt, extractFactsSlice } from "@/lib/ai/prompt";
import { routeLLMRequest } from "@/lib/ai/router";
import { createCacheKey } from "@/lib/ai/cache";
import { validateSections } from "@/lib/ai/validate";
import { formatSection } from "@/lib/assemble/formatSection";
import { assemble } from "@/lib/assemble";
import { getReadmesCollection, SectionItem } from "@/lib/db/collections";
import { getOrCreateOwnerId, getSubjectId, extractByokHeaders, OWNER_COOKIE_NAME } from "@/lib/owner";
import { checkQuota, consumeQuota } from "@/lib/quota";
import { APP_CONFIG, TONES } from "@/lib/config";
import { AIError } from "@/lib/ai/types";
import { getDefaultAboutConfig } from "@/lib/aboutConfig";
import { getDefaultIntroConfig } from "@/lib/introConfig";
import { getDefaultStatsConfig } from "@/lib/statsConfig";
import {
  SocialConfig,
  getDefaultSocialConfig,
  generateContactMarkdown,
  normalizeSocialUrl,
} from "@/lib/socialConfig";
import {
  TechStackConfig,
  getDefaultSkillsConfig,
} from "@/lib/techStackConfig";

export const runtime = "nodejs";

const GenerateBodySchema = z.object({
  login: z.string().trim().min(1, "GitHub username is required"),
  tone: z.enum(TONES).default("professional"),
  theme: z.string().default("minimal"),
});

export async function POST(req: NextRequest) {
  let bodyJson: unknown;
  try {
    bodyJson = await req.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: { code: "INVALID_JSON", message: "Request body must be valid JSON" },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const parsed = GenerateBodySchema.safeParse(bodyJson);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { login, tone, theme } = parsed.data;
  const { ownerId, isNew } = getOrCreateOwnerId(req);
  const byok = extractByokHeaders(req);
  const subjectId = getSubjectId(req);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        // Immediately notify client and flush SSE response headers
        sendEvent("stage", {
          stage: "fetching",
          message: `Ingesting facts for @${login} from GitHub...`,
        });

        // --- QUOTA CHECK (Bypassed if BYOK is present) ---
        if (!byok) {
          const quota = await checkQuota(subjectId, 1.0);
          if (!quota.allowed) {
            sendEvent("error", {
              error: {
                code: "QUOTA_EXCEEDED",
                message: "Daily anonymous generation limit reached. Markdown editor and export features remain 100% usable.",
                resetsAt: quota.resetsAt,
                resetTimeFormatted: quota.resetTimeFormatted,
                used: quota.used,
                limit: quota.limit,
              },
            });
            controller.close();
            return;
          }
        }

        const facts = await fetchFacts(login);

        // --- STAGE 2: WRITING PROSE VIA AI ---
        sendEvent("stage", {
          stage: "writing",
          message: `Generating grounded profile sections with AI in ${tone} tone...`,
        });

        const factsSlice = extractFactsSlice(facts);
        const cacheKey = byok ? undefined : createCacheKey("all", tone, factsSlice);
        const systemPrompt = buildSystemPrompt(tone);
        const userPrompt = buildUserPrompt(facts);

        const aiResult = await routeLLMRequest({
          system: systemPrompt,
          user: userPrompt,
          cacheKey,
          byok: byok ? { provider: byok.provider, apiKey: byok.apiKey } : undefined,
          temperature: 0.4,
          maxOutputTokens: 2500,
        });

        // Run strict grounding validation
        let validation = validateSections(aiResult.text, facts);

        // If validation failed, attempt 1 self-correction retry
        if (!validation.success) {
          const retryAiResult = await routeLLMRequest({
            system: systemPrompt,
            user: `${userPrompt}\n\nCorrection instruction: Your previous response had schema/grounding issues: ${validation.error}. Ensure 100% adherence to schema and facts.`,
            byok: byok ? { provider: byok.provider, apiKey: byok.apiKey } : undefined,
            temperature: 0.2,
            maxOutputTokens: 2500,
          });
          validation = validateSections(retryAiResult.text, facts);
        }

        if (!validation.success) {
          throw new AIError(
            `AI output failed grounding validation: ${validation.error}`,
            "INVALID_AI_OUTPUT",
            { status: 502 }
          );
        }

        const validOutput = validation.data;

        // --- STAGE 3: ASSEMBLING DETERMINISTIC MARKDOWN ---
        sendEvent("stage", {
          stage: "assembling",
          message: "Formatting sections and assembling Markdown...",
        });

        const initialSkillsConfig: TechStackConfig = getDefaultSkillsConfig();
        const introMd = formatSection("intro", validOutput.intro, facts, theme);
        const aboutMd = formatSection("about", validOutput.about, facts, theme);
        const skillsMd = formatSection("skills", initialSkillsConfig, facts, theme);
        const projectsMd = formatSection("projects", validOutput.projects, facts, theme);
        const initialIntroConfig = getDefaultIntroConfig(facts.login, facts, validOutput.intro.roles);
        const initialAboutConfig = getDefaultAboutConfig(facts.login, facts);
        const initialStatsConfig = getDefaultStatsConfig(facts.login);
        const initialSocialConfig: SocialConfig = {
          ...getDefaultSocialConfig(),
          portfolio: facts.websiteUrl ? normalizeSocialUrl("portfolio", facts.websiteUrl) : "",
        };

        const statsMd = formatSection("stats", initialStatsConfig, facts, theme);
        const contactMd = generateContactMarkdown(initialSocialConfig);

        const sections: SectionItem[] = [
          { key: "intro", markdown: introMd, source: "ai", enabled: true, order: 0, config: { intro: initialIntroConfig } },
          { key: "about", markdown: aboutMd, source: "ai", enabled: true, order: 1, config: { about: initialAboutConfig } },
          { key: "skills", markdown: skillsMd, source: "ai", enabled: true, order: 2, config: { skills: initialSkillsConfig } },
          { key: "projects", markdown: projectsMd, source: "ai", enabled: true, order: 3 },
          { key: "stats", markdown: statsMd, source: "ai", enabled: true, order: 4, config: { stats: initialStatsConfig } },
          { key: "contact", markdown: contactMd, source: "ai", enabled: true, order: 5, config: { contact: initialSocialConfig } },
        ];

        const fullMarkdown = assemble(sections, theme, facts);

        const doc = {
          ownerId,
          login: facts.login,
          tone,
          theme,
          sections,
          promptVersion: APP_CONFIG.promptVersion,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save to MongoDB readmes collection
        let readmeId = `draft_${crypto.randomUUID().replace(/-/g, "")}`;
        try {
          const col = await getReadmesCollection();
          const res = await col.insertOne(doc);
          readmeId = res.insertedId.toString();
        } catch (dbErr: unknown) {
          console.warn("Could not save README to MongoDB:", (dbErr as Error).message);
        }

        // Always cache in memoryDrafts so dev mode runs even if MongoDB is offline
        const { memoryDrafts } = await import("@/lib/db/draftStore");
        memoryDrafts.set(readmeId, { ...doc, _id: readmeId });

        // --- CONSUME QUOTA (Only if not BYOK) ---
        if (!byok) {
          await consumeQuota(subjectId, 1.0, 2500);
        }

        // --- STAGE 4: DONE ---
        sendEvent("done", {
          readmeId,
          login: facts.login,
          theme,
          tone,
          sections,
          markdown: fullMarkdown,
        });

        controller.close();
      } catch (err: unknown) {
        if (err instanceof GitHubFactError) {
          sendEvent("error", {
            error: {
              code: err.code,
              message: err.message,
            },
          });
        } else if (err instanceof AIError) {
          sendEvent("error", {
            error: {
              code: err.code,
              message: err.message,
              retryAfter: err.retryAfter,
            },
          });
        } else {
          sendEvent("error", {
            error: {
              code: "INTERNAL_ERROR",
              message: (err as Error).message || "An unexpected error occurred during generation",
            },
          });
        }
        controller.close();
      }
    },
  });

  const headers = new Headers({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  if (isNew) {
    headers.set(
      "Set-Cookie",
      `${OWNER_COOKIE_NAME}=${encodeURIComponent(ownerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  return new Response(stream, { headers });
}
