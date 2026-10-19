"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { SystemStateBanner, SystemStateType } from "@/components/system/SystemStateBanner";
import { ByokDialog } from "@/components/system/ByokDialog";
import { FiServer, FiActivity, FiCpu, FiPlay, FiRefreshCw, FiCode } from "react-icons/fi";

export default function SystemStatesPage() {
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<SystemStateType | "all">("all");
  const [demoUsername, setDemoUsername] = useState("nonexistent-dev-999201");
  const [simulatedCountdown, setSimulatedCountdown] = useState(24);
  const [showRawPayload, setShowRawPayload] = useState(false);

  const rawPayload = {
    diagnostics: {
      timestamp: new Date().toISOString(),
      gateway: "api.hello-md.io",
      region: "edge-iad-04",
      syncRate: "99.98%",
    },
    states: {
      congestion: {
        code: "AI_BUSY",
        httpStatus: 503,
        retryAfter: simulatedCountdown,
        backoffPolicy: "exponential_jittered",
      },
      quota: {
        code: "QUOTA_EXCEEDED",
        httpStatus: 429,
        dailyLimit: 3,
        remainingGenerations: 0,
        resetsAt: "00:00:00Z",
        editorAccess: "unrestricted",
      },
      userNotFound: {
        code: "USER_NOT_FOUND",
        httpStatus: 404,
        queriedHandle: demoUsername,
        levenshteinMatch: "sajithnuski",
        similarityRatio: 0.82,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0D0E0C] text-[#FAFAF8] flex flex-col justify-between selection:bg-accent selection:text-[#0D0E0C]">
      <Header />

      <main className="w-full pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#21231D]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#9EAA96] bg-[#161813] px-2.5 py-0.5 rounded border border-[#262820]">
                Diagnostics &amp; Observability
              </span>
              <span className="font-mono text-xs text-accent flex items-center gap-1.5 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                Simulator Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              System States &amp; Error Handling
            </h1>
            <p className="text-xs sm:text-sm text-[#95988D] max-w-2xl">
              Live reference for runtime limits, API latency throttling, and username validation states as defined in the Hello-md specification.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#95988D] shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141611] rounded-md border border-[#25281E]">
              <FiServer className="w-3.5 h-3.5 text-accent" />
              <span>Gateway: api.hello-md.io</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141611] rounded-md border border-[#25281E]">
              <span className="text-[#686B60]">Sync:</span>
              <span className="text-white font-medium">99.98%</span>
            </div>
          </div>
        </div>

        {/* Simulator Filter Controls */}
        <div className="flex items-center justify-between gap-4 p-2 bg-[#12140F] border border-[#22251B] rounded-lg">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs font-mono text-[#787B70] px-2 hidden sm:inline">Focus State:</span>
            {(["all", "congestion", "quota", "user_not_found"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSimulatorTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  activeSimulatorTab === tab
                    ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D]"
                    : "text-[#888C80] hover:text-white"
                }`}
              >
                {tab === "all" ? "Show All (3)" : tab === "congestion" ? "01: Congestion" : tab === "quota" ? "02: Quota" : "03: Not Found"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsByokOpen(true)}
              className="h-8 px-3 bg-[#1A1D15] hover:bg-[#25291E] text-accent border border-[#303625] rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <span>Test BYOK Modal</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Grid (3 Distinct Frames) */}
        <div className="flex flex-col gap-10">
          {/* FRAME 01: ENGINE CONGESTION */}
          {(activeSimulatorTab === "all" || activeSimulatorTab === "congestion") && (
            <SystemStateBanner
              state="congestion"
              retryAfterSeconds={simulatedCountdown}
              onOpenByok={() => setIsByokOpen(true)}
            />
          )}

          {/* FRAME 02: GENERATION QUOTA */}
          {(activeSimulatorTab === "all" || activeSimulatorTab === "quota") && (
            <SystemStateBanner
              state="quota"
              resetsAtFormatted="4h 12m"
              onOpenByok={() => setIsByokOpen(true)}
            />
          )}

          {/* FRAME 03: GITHUB API LOOKUP */}
          {(activeSimulatorTab === "all" || activeSimulatorTab === "user_not_found") && (
            <SystemStateBanner
              state="user_not_found"
              username={demoUsername}
              onSelectSuggestion={(sug) => setDemoUsername(sug)}
            />
          )}
        </div>

        {/* Raw Payload Inspector Modal / Collapsible */}
        {showRawPayload && (
          <div className="p-4 bg-[#0A0B09] border border-[#25281E] rounded-xl font-mono text-xs text-[#A0A498] overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#202318] text-[#D8D9D2]">
              <span>Telemetry Diagnostic Response Payload</span>
              <button
                type="button"
                onClick={() => setShowRawPayload(false)}
                className="text-accent hover:underline text-[11px]"
              >
                Close
              </button>
            </div>
            <pre>{JSON.stringify(rawPayload, null, 2)}</pre>
          </div>
        )}

        {/* Micro Diagnostic Footer Utility */}
        <div className="p-4 rounded-xl bg-[#141611] border border-[#25281E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#1B1E16] border border-[#2C3123] flex items-center justify-center text-accent">
              <FiActivity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs sm:text-sm text-white">
                Developer Mode Simulator Active
              </span>
              <span className="text-[11px] text-[#8E9285]">
                All simulated edge-cases execute in client sandboxes without modifying real session tokens.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSimulatedCountdown(24);
                setDemoUsername("nonexistent-dev-999201");
              }}
              className="h-8 px-3 bg-[#1B1E16] hover:bg-[#25291E] text-[#D8D9D2] hover:text-white font-mono text-xs rounded-md border border-[#2A2E21] transition-colors inline-flex items-center gap-1.5"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRawPayload(!showRawPayload)}
              className="h-8 px-3 bg-[#24281E] hover:bg-[#2F3427] text-white font-mono text-xs rounded-md border border-[#3A402D] transition-colors inline-flex items-center gap-1.5"
            >
              <FiCode className="w-3.5 h-3.5 text-accent" />
              <span>{showRawPayload ? "Hide" : "View"} Raw Payload</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* BYOK Modal */}
      <ByokDialog isOpen={isByokOpen} onClose={() => setIsByokOpen(false)} />
    </div>
  );
}
