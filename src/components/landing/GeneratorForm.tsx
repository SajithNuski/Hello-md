"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Terminal, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Tone } from "@/lib/config";

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
        onSubmit={handleGenerate}
        className="flex flex-col gap-4 bg-[#F0F0EC] p-5 rounded-[8px] border border-[#DEDFD8] shadow-sm"
      >
        {/* Username Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="gh-username"
            className="text-xs font-medium text-[#171815] flex items-center justify-between"
          >
            <span>GitHub Profile Handle</span>
            <span className="font-mono text-[11px] text-[#91928A]">Required</span>
          </label>
          <div className="flex h-9 w-full bg-[#FAFAF8] rounded-[6px] border border-[#DEDFD8] overflow-hidden focus-within:border-[#171815] focus-within:ring-2 focus-within:ring-[#C5F467]/50 transition-all">
            <span className="inline-flex items-center justify-center px-3 bg-[#E2E3DD] border-r border-[#DEDFD8] font-mono text-xs text-[#65665F] select-none">
              @
            </span>
            <input
              id="gh-username"
              type="text"
              required
              disabled={isGenerating}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="torvalds"
              className="w-full h-full px-3 bg-transparent font-mono text-xs text-[#171815] placeholder:text-[#91928A] focus:outline-none"
            />
          </div>
        </div>

        {/* Configuration Row: Tone & Template */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tone Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tone-select" className="text-xs font-medium text-[#171815]">
              Editorial Tone
            </label>
            <select
              id="tone-select"
              disabled={isGenerating}
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full h-9 px-3 bg-[#FAFAF8] rounded-[6px] border border-[#DEDFD8] text-xs text-[#171815] focus:outline-none focus:border-[#171815] cursor-pointer"
            >
              <option value="professional">Professional (Confident & clean)</option>
              <option value="playful">Playful (Light humor, concise)</option>
              <option value="minimal">Minimal (Terse & focused)</option>
              <option value="hacker">Hacker (Terminal-flavored)</option>
            </select>
          </div>

          {/* Template Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="template-select" className="text-xs font-medium text-[#171815]">
              Structural Template
            </label>
            <select
              id="template-select"
              disabled={isGenerating}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full h-9 px-3 bg-[#FAFAF8] rounded-[6px] border border-[#DEDFD8] text-xs text-[#171815] focus:outline-none focus:border-[#171815] cursor-pointer"
            >
              <option value="minimal">Minimal Developer</option>
              <option value="featured">Featured Projects Showcase</option>
              <option value="compact">Compact Stack & Stats</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-[#FEE2E2] border border-[#DC2626]/30 rounded-[6px] flex items-center gap-2 text-xs text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0 stroke-[1.5]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="h-9 w-full mt-1 bg-[#C5F467] hover:bg-[#A8D94E] text-[#171815] font-semibold text-xs rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#171815]" />
              <span>Synthesizing Profile...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#171815] stroke-[1.5]" />
              <span>Generate README</span>
            </>
          )}
        </button>
      </form>

      {/* Meta Availability Line */}
      <div className="flex items-center justify-between px-1 text-xs text-[#65665F]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>3 of 3 generations left today</span>
        </div>
        <span className="font-mono text-[11px] text-[#91928A]">Free tier resets daily</span>
      </div>

      {/* Live Stepper & Terminal Log Console */}
      {isGenerating && (
        <div className="w-full bg-[#F0F0EC] border border-[#DEDFD8] rounded-[8px] overflow-hidden flex flex-col shadow-sm">
          {/* Stepper Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#DEDFD8] bg-[#E2E3DD]">
            {/* Step 1: Ingestion */}
            <div
              className={`flex items-center gap-2.5 px-4 py-3 border-b md:border-b-0 md:border-r border-[#DEDFD8] ${
                currentStage === "fetching" ? "bg-[#FAFAF8]" : ""
              }`}
            >
              {currentStage === "fetching" ? (
                <Loader2 className="w-4 h-4 text-[#171815] animate-spin" />
              ) : currentStage !== "idle" ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-[#91928A] flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-medium text-[#171815]">
                  1. Fetching data
                </span>
                <span className="text-[11px] text-[#65665F]">GraphQL facts</span>
              </div>
            </div>

            {/* Step 2: Writing */}
            <div
              className={`flex items-center gap-2.5 px-4 py-3 border-b md:border-b-0 md:border-r border-[#DEDFD8] ${
                currentStage === "writing" ? "bg-[#FAFAF8]" : ""
              }`}
            >
              {currentStage === "writing" ? (
                <Loader2 className="w-4 h-4 text-[#171815] animate-spin" />
              ) : currentStage === "assembling" || currentStage === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-[#91928A] flex items-center justify-center text-[10px] font-mono">
                  2
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-medium text-[#171815]">
                  2. Writing prose
                </span>
                <span className="text-[11px] text-[#65665F]">Grounded sections</span>
              </div>
            </div>

            {/* Step 3: Assembling */}
            <div
              className={`flex items-center gap-2.5 px-4 py-3 ${
                currentStage === "assembling" || currentStage === "done" ? "bg-[#FAFAF8]" : ""
              }`}
            >
              {currentStage === "assembling" ? (
                <Loader2 className="w-4 h-4 text-[#171815] animate-spin" />
              ) : currentStage === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-[#91928A] flex items-center justify-center text-[10px] font-mono">
                  3
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-medium text-[#171815]">
                  3. Assembling
                </span>
                <span className="text-[11px] text-[#65665F]">Badges & Markdown</span>
              </div>
            </div>
          </div>

          {/* Console Log Stream */}
          <div className="p-4 flex flex-col gap-1.5 font-mono text-xs bg-[#171815] text-[#FAFAF8] min-h-[120px] max-h-[180px] overflow-y-auto">
            <div className="flex items-center justify-between text-[#91928A] border-b border-[#31322E] pb-1.5 mb-1 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>stdout stream</span>
              </span>
              <span className="text-[#C5F467]">live</span>
            </div>
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#65665F] select-none">{log.timestamp}</span>
                <span className="text-[#C5F467] select-none">&gt;</span>
                <span
                  className={
                    log.type === "error"
                      ? "text-[#DC2626]"
                      : log.type === "success"
                      ? "text-[#C5F467] font-medium"
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
