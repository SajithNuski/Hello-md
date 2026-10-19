"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { LuSparkles } from "react-icons/lu";
import { Tone } from "@/lib/config";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export function GeneratorForm() {
  const router = useRouter();

  const [username, setUsername] = useState("sajithnuski");
  const [tone, setTone] = useState<Tone>("professional");
  const [theme, setTheme] = useState("minimal");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<"idle" | "fetching" | "writing" | "assembling" | "done">("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setCurrentStage("fetching");
    setLogs([]);

    addLog(`Initiating generation session for @${cleanUsername}`, "info");

    try {
      const response = await fetch("/api/readmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          const dataPayload = dataMatch ? JSON.parse(dataMatch[1].trim()) : null;

          if (eventType === "stage" && dataPayload) {
            setCurrentStage(dataPayload.stage);
            addLog(dataPayload.message, "info");
          } else if (eventType === "done" && dataPayload) {
            setCurrentStage("done");
            addLog(`Assembled ${dataPayload.sections?.length || 5} profile sections! Redirecting to Editor...`, "success");

            // Redirect to editor
            setTimeout(() => {
              router.push(`/editor/${dataPayload.readmeId}`);
            }, 800);
          } else if (eventType === "error" && dataPayload) {
            const err = dataPayload.error;
            setErrorMessage(err.message || "An error occurred during generation");
            addLog(`Error [${err.code}]: ${err.message}`, "error");
            setIsGenerating(false);
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
      {/* Form Card */}
      <form
        id="generator-card"
        onSubmit={handleGenerate}
        className="flex flex-col gap-6 bg-surface p-6 sm:p-7 rounded-xl border border-border shadow-sm transition-all duration-300"
      >
        {/* Username Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="gh-username"
            className="text-nav font-medium text-text-primary"
          >
            GitHub Profile Handle
          </label>
          <div className="flex h-11 w-full bg-surface-raised rounded-md border border-border overflow-hidden focus-within:border-text-primary focus-within:ring-2 focus-within:ring-accent/40 transition-all shadow-xs">
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
              onChange={(e) => setUsername(e.target.value)}
              placeholder="torvalds"
              className="w-full h-full px-3.5 bg-transparent font-mono text-meta text-text-primary placeholder:text-text-muted focus:outline-none"
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
            <label htmlFor="template-select" className="text-nav font-medium text-text-primary flex items-center gap-1.5">
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
          className="h-11 w-full mt-1 bg-accent hover:bg-accent-hover text-text-primary font-semibold text-nav rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isGenerating ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin text-text-primary" />
              <span>Synthesizing Profile...</span>
            </>
          ) : (
            <>
              <LuSparkles className="w-4 h-4 text-text-primary stroke-[1.8]" />
              <span>Generate README</span>
            </>
          )}
        </button>
      </form>

      {/* Live Stepper & Terminal Log Console */}
      {isGenerating && (
        <div className="w-full bg-surface border border-border rounded-md overflow-hidden flex flex-col shadow-xs">
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

            {/* Step 2: Writing */}
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
                  2. WRITE PROSE
                </span>
                <span className="text-meta text-text-secondary">Grounded sections</span>
              </div>
            </div>

            {/* Step 3: Assembling */}
            <div
              className={`flex items-center gap-3 px-4 py-3 ${
                currentStage === "assembling" || currentStage === "done" ? "bg-surface-raised" : ""
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
                  3. ASSEMBLE
                </span>
                <span className="text-meta text-text-secondary">Badges & Markdown</span>
              </div>
            </div>
          </div>

          {/* Console Log Stream */}
          <div className="p-4 flex flex-col gap-1.5 font-mono text-meta bg-[#171815] text-[#FAFAF8] min-h-[120px] max-h-[180px] overflow-y-auto">
            <div className="flex items-center justify-between text-text-muted border-b border-[#31322E] pb-1.5 mb-1 text-eyebrow">
              <span className="flex items-center gap-1.5">
                <FiTerminal className="w-3.5 h-3.5 text-accent" />
                <span className="tracking-[0.04em] uppercase">STDOUT STREAM</span>
              </span>
              <span className="text-accent uppercase tracking-wider text-[10px]">LIVE</span>
            </div>
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-text-secondary select-none">{log.timestamp}</span>
                <span className="text-accent select-none">&gt;</span>
                <span
                  className={
                    log.type === "error"
                      ? "text-status-error"
                      : log.type === "success"
                      ? "text-accent font-medium"
                      : "text-[#FAFAF8]"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
