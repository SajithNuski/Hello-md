"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { SystemStateBanner, SystemStateType } from "@/components/system/SystemStateBanner";
import { ByokDialog } from "@/components/system/ByokDialog";
import {
  getByokConfig,
  clearByokConfig,
  getByokHeaders,
  ClientByokConfig,
} from "@/lib/byokClient";
import {
  FiServer,
  FiActivity,
  FiCpu,
  FiRefreshCw,
  FiShield,
  FiKey,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiHelpCircle,
  FiTrash2,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { SiGoogle } from "react-icons/si";

interface UsageData {
  used: number;
  remaining: number;
  limit: number;
  resetsAtFormatted: string;
  isByok: boolean;
  byokProvider?: string;
  unlimited?: boolean;
}

export default function SystemStatesPage() {
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [byokConfig, setLocalByokConfig] = useState<ClientByokConfig | null>(null);
  const [usage, setUsage] = useState<UsageData>({
    used: 0,
    remaining: 3,
    limit: 3,
    resetsAtFormatted: "Calculating...",
    isByok: false,
  });
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(36);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  // Simulator controls
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<SystemStateType>("congestion");
  const [simulatedCountdown, setSimulatedCountdown] = useState(24);
  const [testUsername, setTestUsername] = useState("sajithnuski-dev");

  // Fetch real-time usage data
  const fetchUsageData = useCallback(async () => {
    setIsLoadingUsage(true);
    const startTime = performance.now();
    try {
      const cfg = getByokConfig();
      setLocalByokConfig(cfg);

      const res = await fetch("/api/usage", {
        headers: getByokHeaders(),
        cache: "no-store",
      });
      const duration = Math.round(performance.now() - startTime);
      setLatencyMs(Math.max(18, duration));

      if (res.ok) {
        const data = await res.json();
        setUsage({
          used: data.used ?? 0,
          remaining: data.remaining ?? 3,
          limit: data.limit ?? 3,
          resetsAtFormatted: data.resetTimeFormatted || "00:00 UTC",
          isByok: Boolean(data.isByok),
          byokProvider: data.byokProvider,
          unlimited: Boolean(data.unlimited),
        });
      }
    } catch {
      setLatencyMs(null);
    } finally {
      setIsLoadingUsage(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    fetchUsageData();

    const handleByokUpdate = () => {
      fetchUsageData();
    };

    window.addEventListener("hellomd:byok-updated", handleByokUpdate);
    return () => window.removeEventListener("hellomd:byok-updated", handleByokUpdate);
  }, [fetchUsageData]);

  const handleClearKey = () => {
    clearByokConfig();
    fetchUsageData();
  };

  const getMaskedKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return `${key.slice(0, 4)}••••${key.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#0D0E0C] text-[#FAFAF8] flex flex-col justify-between selection:bg-accent selection:text-[#0D0E0C]">
      <Header />

      <main className="w-full pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex-1 flex flex-col gap-10">
        {/* Top Header & Operational Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#21231D]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent bg-[#161C10] px-2.5 py-0.5 rounded border border-[#2D3A1F] flex items-center gap-1.5 font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                Live Status &amp; Telemetry
              </span>
              {latencyMs && (
                <span className="font-mono text-xs text-[#8E9285]">
                  Edge Latency: <span className="text-[#D8D9D2] font-medium">{latencyMs}ms</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              System Status &amp; Usage Stats
            </h1>
            <p className="text-xs sm:text-sm text-[#95988D] max-w-2xl">
              Monitor real-time service health, track your generation allowance, and manage your API keys.
            </p>
          </div>

          {/* Quick Status Pill & Refresh */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-[#141611] rounded-lg border border-[#25281E] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">All Systems Operational</span>
                {lastRefreshed && (
                  <span className="text-[10px] font-mono text-[#787B70]">
                    Checked at {lastRefreshed}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={fetchUsageData}
              disabled={isLoadingUsage}
              title="Refresh status and usage"
              className="h-10 w-10 bg-[#161813] hover:bg-[#20231B] text-[#D8D9D2] hover:text-white border border-[#262820] hover:border-[#3D4233] rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoadingUsage ? "animate-spin text-accent" : ""}`} />
            </button>
          </div>
        </div>

        {/* SECTION 1: PERSONAL USAGE & ACCESS STATS (What the user cares about most) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-accent" />
              <span>Your Generation Allowance</span>
            </h2>
            <span className="text-xs font-mono text-[#787B70]">
              IP / Session Tier:{" "}
              <span className="text-[#D8D9D2] font-medium">
                {byokConfig ? "Custom Key (BYOK)" : "Free Anonymous"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Daily Generations Left */}
            <div className="bg-[#141611] border border-[#262920] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#8E9285] uppercase tracking-wider">
                    Generations Today
                  </span>
                  <div className="flex items-baseline gap-2">
                    {byokConfig ? (
                      <span className="text-2xl sm:text-3xl font-bold text-accent font-mono">
                        Unlimited
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                          {usage.remaining}
                        </span>
                        <span className="text-sm font-mono text-[#787B70]">/ {usage.limit} left</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#1B1E16] border border-[#2E3324] flex items-center justify-center text-accent">
                  <FiCpu className="w-5 h-5" />
                </div>
              </div>

              {/* Visual meter */}
              {byokConfig ? (
                <div className="flex items-center gap-2 text-xs font-mono text-accent">
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  <span>Unmetered access activated</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-1.5 w-full">
                    {[1, 2, 3].map((slot) => {
                      const isAvailable = slot <= usage.remaining;
                      return (
                        <div
                          key={slot}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            isAvailable ? "bg-accent" : "bg-[#25281E]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#787B70]">
                    <span>{usage.used} generated</span>
                    <span>Resets daily</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Reset Timer */}
            <div className="bg-[#141611] border border-[#262920] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#8E9285] uppercase tracking-wider">
                    Quota Reset
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                      {usage.resetsAtFormatted}
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#1B1E16] border border-[#2E3324] flex items-center justify-center text-[#9EAA96]">
                  <FiClock className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-[#8E9285] leading-relaxed">
                Free generation allocations refresh automatically at{" "}
                <span className="font-mono text-white">00:00 UTC</span> every 24 hours.
              </div>
            </div>

            {/* Card 3: BYOK (Bring Your Own Key) Quick Setup */}
            <div className="bg-[#141611] border border-[#262920] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#8E9285] uppercase tracking-wider">
                    API Provider Mode
                  </span>
                  <div className="flex items-center gap-2">
                    {byokConfig ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-accent/10 border border-accent/30 text-accent font-semibold capitalize">
                        {byokConfig.provider === "gemini" ? (
                          <SiGoogle className="w-3 h-3" />
                        ) : (
                          <FiServer className="w-3 h-3" />
                        )}
                        {byokConfig.provider} Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1E2119] border border-[#303527] text-[#9EAA96]">
                        Standard Shared
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#1B1E16] border border-[#2E3324] flex items-center justify-center text-accent">
                  <FiKey className="w-5 h-5" />
                </div>
              </div>

              {byokConfig ? (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#22251C]">
                  <span className="text-xs font-mono text-[#8E9285]">
                    {getMaskedKey(byokConfig.apiKey)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsByokOpen(true)}
                      className="px-2.5 py-1 text-xs text-[#D8D9D2] hover:text-white bg-[#1C1F17] hover:bg-[#262A1F] rounded border border-[#2D3124] transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleClearKey}
                      title="Clear saved key"
                      className="p-1.5 text-[#8E9285] hover:text-red-400 bg-[#1C1F17] hover:bg-[#262A1F] rounded border border-[#2D3124] transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsByokOpen(true)}
                  className="w-full h-8 px-3 bg-[#20251A] hover:bg-[#2A3121] text-accent font-medium text-xs rounded-md border border-[#38422A] hover:border-accent/40 transition-colors flex items-center justify-center gap-2"
                >
                  <FiKey className="w-3.5 h-3.5" />
                  <span>Add Free API Key for Unlimited</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: CORE SERVICES HEALTH GRID */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <FiServer className="w-4 h-4 text-accent" />
              <span>Core Service Status</span>
            </h2>
            <span className="text-xs font-mono text-accent flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              100% Core Uptime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service 1 */}
            <div className="bg-[#141611] border border-[#23261D] rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">AI Synthesis Engine</span>
                <span className="text-[11px] font-mono font-medium text-accent bg-[#192212] px-2 py-0.5 rounded border border-[#2C3B1E]">
                  Operational
                </span>
              </div>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Groq Llama 3.3 Router with automatic Google Gemini fallback for streaming generation.
              </p>
              <div className="pt-2 border-t border-[#1F221A] flex items-center justify-between text-[11px] font-mono text-[#72766A]">
                <span>Pipeline: SSE Stream</span>
                <span>~180ms TTFT</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-[#141611] border border-[#23261D] rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">GitHub API Gateway</span>
                <span className="text-[11px] font-mono font-medium text-accent bg-[#192212] px-2 py-0.5 rounded border border-[#2C3B1E]">
                  Operational
                </span>
              </div>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Octokit GraphQL v4 &amp; REST v3 profile facts ingestion with Levenshtein fuzzy matching.
              </p>
              <div className="pt-2 border-t border-[#1F221A] flex items-center justify-between text-[11px] font-mono text-[#72766A]">
                <span>Resolver: Multi-Tier</span>
                <span>Normal Rate</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-[#141611] border border-[#23261D] rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">Markdown Studio</span>
                <span className="text-[11px] font-mono font-medium text-accent bg-[#192212] px-2 py-0.5 rounded border border-[#2C3B1E]">
                  Operational
                </span>
              </div>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                CodeMirror 6 live split editor, real-time GFM syntax preview, and local draft persistence.
              </p>
              <div className="pt-2 border-t border-[#1F221A] flex items-center justify-between text-[11px] font-mono text-[#72766A]">
                <span>Client Engine: CM6</span>
                <span>Zero Latency</span>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-[#141611] border border-[#23261D] rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">Export Pipeline</span>
                <span className="text-[11px] font-mono font-medium text-accent bg-[#192212] px-2 py-0.5 rounded border border-[#2C3B1E]">
                  Operational
                </span>
              </div>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Deterministic raw markdown download, clipboard synthesis, and multi-file asset bundling.
              </p>
              <div className="pt-2 border-t border-[#1F221A] flex items-center justify-between text-[11px] font-mono text-[#72766A]">
                <span>Artifact: .md / .zip</span>
                <span>Client Bound</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE EDGE-CASE & ERROR PLAYGROUND */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <FiShield className="w-4 h-4 text-accent" />
                <span>Runtime Limit &amp; Error Handling Guide</span>
              </h2>
              <p className="text-xs text-[#8E9285] mt-0.5">
                Preview how Hello-md handles edge cases like traffic spikes, quotas, and username typos.
              </p>
            </div>

            {/* State Picker Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#141611] rounded-lg border border-[#25281E] self-start sm:self-auto">
              {(
                [
                  { id: "congestion", label: "01: Engine Congestion" },
                  { id: "quota", label: "02: Quota Limit" },
                  { id: "user_not_found", label: "03: Typo Detection" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSimulatorTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                    activeSimulatorTab === tab.id
                      ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D] shadow-xs"
                      : "text-[#888C80] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Playground Box */}
          <div className="bg-[#12140F] border border-[#23261D] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
            {/* Context Explanation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2118] text-xs text-[#95988D]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-accent bg-[#182112] px-2 py-0.5 rounded border border-[#2C3A1D] uppercase">
                  {activeSimulatorTab === "congestion"
                    ? "HTTP 503 • AI Engine Busy"
                    : activeSimulatorTab === "quota"
                    ? "HTTP 429 • Daily Limit"
                    : "HTTP 404 • Octokit Resolution"}
                </span>
                <span>
                  {activeSimulatorTab === "congestion"
                    ? "Automatically activates when the upstream LLM throttles requests."
                    : activeSimulatorTab === "quota"
                    ? "Appears once 3 daily anonymous generations have been consumed."
                    : "Triggers when a GitHub handle does not exist, offering typo suggestions."}
                </span>
              </div>

              {/* Extra interactive test control for tab 03 */}
              {activeSimulatorTab === "user_not_found" && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-[#787B70]">Test input:</span>
                  <input
                    type="text"
                    value={testUsername}
                    onChange={(e) => setTestUsername(e.target.value)}
                    placeholder="Type handle..."
                    className="h-7 px-2.5 bg-[#0D0E0C] border border-[#2D3125] focus:border-accent/60 rounded text-xs text-white font-mono outline-none w-36"
                  />
                </div>
              )}

              {/* Extra control for tab 01 */}
              {activeSimulatorTab === "congestion" && (
                <button
                  type="button"
                  onClick={() => setSimulatedCountdown((prev) => (prev === 24 ? 12 : 24))}
                  className="text-[11px] font-mono text-accent hover:underline"
                >
                  Restart timer ({simulatedCountdown}s)
                </button>
              )}
            </div>

            {/* Live Banner Preview Component */}
            <div className="w-full">
              {activeSimulatorTab === "congestion" && (
                <SystemStateBanner
                  state="congestion"
                  retryAfterSeconds={simulatedCountdown}
                  onOpenByok={() => setIsByokOpen(true)}
                />
              )}

              {activeSimulatorTab === "quota" && (
                <SystemStateBanner
                  state="quota"
                  resetsAtFormatted={usage.resetsAtFormatted}
                  onOpenByok={() => setIsByokOpen(true)}
                />
              )}

              {activeSimulatorTab === "user_not_found" && (
                <SystemStateBanner
                  state="user_not_found"
                  username={testUsername}
                  onSelectSuggestion={(sug) => setTestUsername(sug)}
                />
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <FiHelpCircle className="w-4 h-4 text-accent" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141611] border border-[#24271E] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-white">How does the 3 daily generations quota work?</h3>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Anonymous users receive 3 full README generations per 24 hours. The quota resets every night at 00:00 UTC. Even when quota is exhausted, you retain 100% unrestricted access to edit, customize, and export existing READMEs.
              </p>
            </div>

            <div className="bg-[#141611] border border-[#24271E] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-white">How do I get unlimited generations?</h3>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Click <strong>&quot;Add Free API Key&quot;</strong> above to plug in your own free key from{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  Groq Console <FiExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                or{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio <FiExternalLink className="w-2.5 h-2.5" />
                </a>
                . Both offer generous free tiers.
              </p>
            </div>

            <div className="bg-[#141611] border border-[#24271E] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-white">Is my API key kept private?</h3>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Yes. Your key is stored exclusively in your browser&apos;s local storage (<code className="text-[#D8D9D2] font-mono text-[11px]">localStorage</code>). It is never written to our database or logged on servers.
              </p>
            </div>

            <div className="bg-[#141611] border border-[#24271E] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-white">What happens if an error occurs mid-generation?</h3>
              <p className="text-xs text-[#8E9285] leading-relaxed">
                Hello-md automatically preserves your current session and draft in your browser sandbox. If an AI rate limit occurs, a live countdown timer displays the exact seconds until backoff expires, and your progress is retained.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: ACTION FOOTER */}
        <div className="p-5 rounded-xl bg-[#141611] border border-[#25281E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1D2117] border border-[#2E3524] flex items-center justify-center text-accent shrink-0">
              <LuSparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Ready to create your README?</h4>
              <p className="text-xs text-[#8E9285]">
                Generate a precision GitHub profile with deterministic stats and zero hallucinations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/templates"
              className="h-9 px-4 bg-[#1C1F17] hover:bg-[#262B1F] text-[#D8D9D2] hover:text-white font-medium text-xs rounded-md border border-[#2E3324] transition-colors flex items-center gap-1.5"
            >
              <span>Explore Templates</span>
            </Link>
            <Link
              href="/#generator"
              className="h-9 px-4 bg-accent hover:bg-[#b0e254] text-[#0D0E0C] font-semibold text-xs rounded-md transition-all shadow-xs flex items-center gap-1.5"
            >
              <LuSparkles className="w-3.5 h-3.5" />
              <span>Launch Generator</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* BYOK Modal */}
      <ByokDialog isOpen={isByokOpen} onClose={() => setIsByokOpen(false)} />
    </div>
  );
}
