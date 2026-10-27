"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiTerminal,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiSliders,
  FiLayout,
  FiDatabase,
  FiEdit3,
  FiPackage,
  FiKey,
} from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { Tone } from "@/lib/config";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SystemStateBanner, SystemStateType } from "@/components/system/SystemStateBanner";
import { ByokDialog } from "@/components/system/ByokDialog";
import { getByokHeaders } from "@/lib/byokClient";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface QuotaDisplay {
  used: number;
  remaining: number;
  limit: number;
  resetsAtFormatted: string;
  isByok: boolean;
}

export function GeneratorForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [username, setUsername] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [theme, setTheme] = useState("minimal");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<"idle" | "fetching" | "writing" | "assembling" | "done">("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // System States & BYOK State
  const [activeSystemState, setActiveSystemState] = useState<SystemStateType | null>(null);
  const [statePayload, setStatePayload] = useState<{
    retryAfterSeconds?: number;
    username?: string;
    resetsAtFormatted?: string;
  }>({});
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaDisplay | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage", {
        headers: getByokHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setQuotaInfo({
          used: data.used,
          remaining: data.remaining,
          limit: data.limit,
          resetsAtFormatted: data.resetTimeFormatted || "4h 12m",
          isByok: Boolean(data.isByok),
        });
      }
    } catch {
      // ignore telemetry fetch error
    }
  }, []);

  useEffect(() => {
    fetchUsage();

    // Initialize username/theme/tone from URL query parameters (e.g. from /templates)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlUser = params.get("username") || params.get("user");
      const urlTheme = params.get("theme");
      const urlTone = params.get("tone");
      if (urlUser) {
        setUsername(urlUser);
      }
      if (urlTheme) {
        setTheme(urlTheme);
      }
      if (
        urlTone &&
        (urlTone === "professional" ||
          urlTone === "playful" ||
          urlTone === "minimal" ||
          urlTone === "hacker")
      ) {
        setTone(urlTone);
      }
    }

    const handleByokUpdated = () => {
      fetchUsage();
    };

    window.addEventListener("hellomd:byok-updated", handleByokUpdated);
    return () => window.removeEventListener("hellomd:byok-updated", handleByokUpdated);
  }, [fetchUsage]);

  useEffect(() => {
    if (session?.user?.login) {
      setUsername((prev) => (prev ? prev : session.user.login || ""));
    }
  }, [session?.user?.login]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, { timestamp: time, message, type }]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, "");
    if (!cleanUsername) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setActiveSystemState(null);
    setCurrentStage("fetching");
    setLogs([]);

    addLog(`Initiating generation session for @${cleanUsername}`, "info");

    try {
      const byokHeaders = getByokHeaders();
      const response = await fetch("/api/readmes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...byokHeaders,
        },
        body: JSON.stringify({
          login: cleanUsername,
          tone,
          theme,
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported by browser");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse SSE event and data lines
          const eventMatch = line.match(/^event:\s*(.+)$/m);
          const dataMatch = line.match(/^data:\s*(.+)$/m);

          const eventType = eventMatch ? eventMatch[1].trim() : "message";
          let dataPayload: {
            stage?: "idle" | "fetching" | "writing" | "assembling" | "done";
            message?: string;
            sections?: unknown[];
            readmeId?: string;
            error?: {
              code: string;
              message: string;
              retryAfter?: number;
              resetTimeFormatted?: string;
            };
          } | null = null;
          if (dataMatch) {
            try {
              dataPayload = JSON.parse(dataMatch[1].trim());
            } catch (parseErr) {
              console.warn("Failed to parse SSE payload line:", parseErr);
            }
          }

          if (eventType === "stage" && dataPayload) {
            if (dataPayload.stage) setCurrentStage(dataPayload.stage);
            if (dataPayload.message) addLog(dataPayload.message, "info");
          } else if (eventType === "done" && dataPayload) {
            setCurrentStage("done");
            addLog(`Assembled ${dataPayload.sections?.length || 5} profile sections! Redirecting to Editor...`, "success");

            // Refresh quota telemetry
            fetchUsage();

            // Redirect to editor
            if (dataPayload.readmeId) {
              const targetId = dataPayload.readmeId;
              setTimeout(() => {
                router.push(`/editor/${targetId}`);
              }, 800);
            }
          } else if (eventType === "error" && dataPayload) {
            const err = dataPayload.error;
            setIsGenerating(false);

            if (err?.code === "QUOTA_EXCEEDED") {
              setActiveSystemState("quota");
              setStatePayload({
                resetsAtFormatted: err.resetTimeFormatted || "4h 12m",
              });
              addLog(`Quota Exceeded: 0 of 3 generations left today.`, "warning");
              fetchUsage();
            } else if (err?.code === "AI_BUSY") {
              setActiveSystemState("congestion");
              setStatePayload({
                retryAfterSeconds: err.retryAfter || 24,
              });
              addLog(`AI Busy: Throttling active. Retry in ${err.retryAfter || 24}s`, "warning");
            } else if (err?.code === "USER_NOT_FOUND") {
              setActiveSystemState("user_not_found");
              setStatePayload({
                username: cleanUsername,
              });
              addLog(`GitHub user '@${cleanUsername}' not found.`, "error");
            } else {
              setErrorMessage(err?.message || "An error occurred during generation");
              addLog(`Error [${err?.code || "UNKNOWN"}]: ${err?.message || "Generation error"}`, "error");
            }
            return;
          }
        }
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Connection failed";
      setErrorMessage(msg);
      addLog(`Fatal: ${msg}`, "error");
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[720px]">
      {/* Active System State Banner (State 01, 02, or 03) */}
      {activeSystemState && (
        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <SystemStateBanner
            state={activeSystemState}
            retryAfterSeconds={statePayload.retryAfterSeconds}
            username={statePayload.username || username}
            resetsAtFormatted={statePayload.resetsAtFormatted}
            onOpenByok={() => setIsByokOpen(true)}
            onSelectSuggestion={(suggested) => {
              setUsername(suggested);
              setActiveSystemState(null);
            }}
          />
        </div>
      )}

      {/* Form Card */}
      <form
        id="generator-card"
        onSubmit={handleGenerate}
        className="flex flex-col gap-6 bg-surface p-6 sm:p-7 rounded-lg border border-border shadow-xs transition-colors text-left"
      >
        {/* Card Header & Quota Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-text-secondary text-[11px] uppercase tracking-wider font-semibold">
              Profile generator
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {quotaInfo && (
              <span className="font-mono text-[11px] text-text-muted bg-surface-raised px-2 py-0.5 rounded border border-border">
                {quotaInfo.isByok ? (
                  <span className="text-accent font-medium">Unmetered (BYOK)</span>
                ) : (
                  <span>
                    <strong className="text-text-primary">{quotaInfo.remaining}</strong> of {quotaInfo.limit} left today
                  </span>
                )}
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsByokOpen(true)}
              className="font-mono text-[11px] text-text-secondary hover:text-accent flex items-center gap-1 transition-colors"
              title="Configure Bring Your Own Key"
            >
              <FiKey className="w-3 h-3" />
              <span className="hidden sm:inline">BYOK</span>
            </button>
          </div>
        </div>

        {/* Username Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="gh-username"
            className="text-nav font-medium text-text-primary"
          >
            GitHub Profile Handle
          </label>
          <div className="flex h-11 w-full bg-surface-raised rounded-md border border-border overflow-hidden focus-within:border-text-primary outline-none focus:outline-none transition-all shadow-xs">
            <span className="inline-flex items-center justify-center px-3.5 bg-surface border-r border-border font-medium text-meta text-text-secondary select-none gap-1.5">
              <SiGithub className="w-4 h-4 text-text-secondary" />
              <span>@</span>
            </span>
            <input
              id="gh-username"
              type="text"
              required
              disabled={isGenerating}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (activeSystemState === "user_not_found") {
                  setActiveSystemState(null);
                }
              }}
              placeholder="torvalds"
              style={{ outline: "none" }}
              className="w-full h-full px-3.5 bg-transparent font-mono text-meta text-text-primary placeholder:text-text-muted outline-none focus:outline-none focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Configuration Row: Tone & Template */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tone Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="tone-select" className="text-nav font-medium text-text-primary flex items-center gap-1.5">
              <FiSliders className="w-3.5 h-3.5 text-text-secondary" />
              <span>Editorial Tone</span>
            </label>
            <CustomSelect<Tone>
              id="tone-select"
              disabled={isGenerating}
              value={tone}
              onChange={setTone}
              options={[
                { value: "professional", label: "Professional" },
                { value: "playful", label: "Playful" },
                { value: "minimal", label: "Minimal" },
                { value: "hacker", label: "Hacker" },
              ]}
            />
          </div>

          {/* Template Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="template-select" className="text-nav font-medium text-text-primary flex items-center gap-1.5 ">
              <FiLayout className="w-3.5 h-3.5 text-text-secondary" />
              <span>Structural Template</span>
            </label>
            <CustomSelect<string>
              id="template-select"
              disabled={isGenerating}
              value={theme}
              onChange={setTheme}
              options={[
                { value: "minimal", label: "Minimal Developer" },
                { value: "featured", label: "Featured Showcase" },
                { value: "compact", label: "Compact Stats" },
              ]}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-status-error/30 rounded-md flex items-center gap-2 text-nav text-status-error">
            <FiAlertCircle className="w-4 h-4 shrink-0 stroke-[1.5]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="h-10 w-full mt-1 bg-accent hover:bg-accent-hover text-text-primary font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isGenerating ? (
            <>
              <FiLoader className="w-3.5 h-3.5 animate-spin text-text-primary" />
              <span>Generating README...</span>
            </>
          ) : (
            <span>Generate README</span>
          )}
        </button>
      </form>

      {/* Live Stepper & Terminal Log Console */}
      {isGenerating && (
        <div className="w-full bg-surface border border-border rounded-md overflow-hidden flex flex-col shadow-xs text-left">
          {/* Stepper Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border bg-surface-raised/40">
            {/* Step 1: Ingestion */}
            <div
              className={`flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-border ${
                currentStage === "fetching" ? "bg-surface-raised" : ""
              }`}
            >
              {currentStage === "fetching" ? (
                <FiLoader className="w-4 h-4 text-text-primary animate-spin shrink-0" />
              ) : currentStage !== "idle" ? (
                <FiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              ) : (
                <FiDatabase className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-mono text-eyebrow font-medium text-text-primary tracking-[0.04em]">
                  1. FETCH DATA
                </span>
                <span className="text-meta text-text-secondary">GraphQL facts</span>
              </div>
            </div>

            {/* Step 2: Generation */}
            <div
              className={`flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-border ${
                currentStage === "writing" ? "bg-surface-raised" : ""
              }`}
            >
              {currentStage === "writing" ? (
                <FiLoader className="w-4 h-4 text-text-primary animate-spin shrink-0" />
              ) : currentStage === "assembling" || currentStage === "done" ? (
                <FiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              ) : (
                <FiEdit3 className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-mono text-eyebrow font-medium text-text-primary tracking-[0.04em]">
                  2. GENERATION
                </span>
                <span className="text-meta text-text-secondary">Grounded prose</span>
              </div>
            </div>

            {/* Step 3: Assembly */}
            <div
              className={`flex items-center gap-3 px-4 py-3 ${
                currentStage === "assembling" ? "bg-surface-raised" : ""
              }`}
            >
              {currentStage === "assembling" ? (
                <FiLoader className="w-4 h-4 text-text-primary animate-spin shrink-0" />
              ) : currentStage === "done" ? (
                <FiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              ) : (
                <FiPackage className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-mono text-eyebrow font-medium text-text-primary tracking-[0.04em]">
                  3. ASSEMBLY
                </span>
                <span className="text-meta text-text-secondary">Deterministic layout</span>
              </div>
            </div>
          </div>

          {/* Monospace Log Terminal Output */}
          <div className="p-4 bg-[#0D0E0C] text-[#FAFAF8] flex flex-col gap-2 max-h-48 overflow-y-auto font-mono text-meta">
            <div className="flex items-center gap-2 pb-2 mb-1 border-b border-[#21231D] text-text-muted text-eyebrow uppercase tracking-[0.05em]">
              <FiTerminal className="w-3.5 h-3.5 text-accent" />
              <span>Generation log</span>
            </div>

            {logs.length === 0 && (
              <span className="text-text-muted italic">Connecting to streaming endpoint...</span>
            )}

            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-text-muted shrink-0 select-none">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === "success"
                      ? "text-accent font-medium"
                      : log.type === "error"
                      ? "text-status-error font-medium"
                      : log.type === "warning"
                      ? "text-amber-400 font-medium"
                      : "text-[#D8D9D2]"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BYOK Modal */}
      <ByokDialog
        isOpen={isByokOpen}
        onClose={() => {
          setIsByokOpen(false);
          fetchUsage();
        }}
        onSaved={() => {
          fetchUsage();
        }}
      />
    </div>
  );
}
