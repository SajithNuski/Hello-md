"use client";

import { useState, useEffect } from "react";
import { FiClock, FiKey, FiAlertCircle, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { suggestClosestUsername } from "@/lib/levenshtein";

export type SystemStateType = "congestion" | "quota" | "user_not_found";

interface SystemStateBannerProps {
  state: SystemStateType;
  retryAfterSeconds?: number;
  username?: string;
  resetsAtFormatted?: string;
  onOpenByok?: () => void;
  onSelectSuggestion?: (username: string) => void;
  onDismiss?: () => void;
  className?: string;
}

export function SystemStateBanner({
  state,
  retryAfterSeconds = 24,
  username = "username",
  resetsAtFormatted = "4h 12m",
  onOpenByok,
  onSelectSuggestion,
  onDismiss,
  className = "",
}: SystemStateBannerProps) {
  // Live countdown timer for State 01 (Engine Congestion)
  const [secondsRemaining, setSecondsRemaining] = useState(retryAfterSeconds);

  useEffect(() => {
    setSecondsRemaining(retryAfterSeconds);
    if (state !== "congestion") return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfterSeconds, state]);

  const formattedCountdown = `00:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;

  // Suggestion calculation for State 03 (User Not Found)
  const { suggestion, score } = suggestClosestUsername(username);

  // --- RENDER STATE 01: ENGINE CONGESTION ---
  if (state === "congestion") {
    return (
      <div
        className={`flex flex-col gap-2.5 w-full text-left font-sans ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-[#7A7E72] font-semibold tracking-wider">
              State 01: Engine Congestion
            </span>
            <span className="font-mono text-xs text-[#44473C]">/</span>
            <span className="font-mono text-xs text-[#8E9285]">HTTP 503 AI Busy / Throttled</span>
          </div>
          <span className="font-mono text-xs text-[#7A7E72] hidden sm:inline">
            Trigger: Token-Bucket Exhaustion
          </span>
        </div>

        <div className="bg-[#141611] border border-[#2B2F23] rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(23,24,21,0.25)]">
          {/* Main Warning Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg bg-[#191C15] border border-[#2C3024]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-md bg-[#23271D] flex items-center justify-center shrink-0 border border-[#3A402E] text-[#F59E0B]">
                <FiClock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="font-medium text-sm text-white">
                  High demand on generation engine. Try again in {secondsRemaining}s.
                </span>
                <span
                  id="rate-limit-badge"
                  className="font-mono text-xs font-semibold bg-[#24281E] text-white px-2.5 py-1 rounded inline-flex items-center gap-1.5 w-fit border border-[#3A402D]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  <span id="countdown-text">{formattedCountdown}</span>
                </span>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenByok && (
                <button
                  type="button"
                  onClick={onOpenByok}
                  className="h-9 px-3.5 bg-[#20241A] hover:bg-[#2A3022] text-white font-medium text-xs border border-[#3A402D] hover:border-accent/50 rounded-md transition-all inline-flex items-center gap-2 shadow-xs group"
                >
                  <FiKey className="w-3.5 h-3.5 text-accent group-hover:rotate-12 transition-transform" />
                  <span>Use your own API key</span>
                </button>
              )}
            </div>
          </div>

          {/* Micro Telemetry & Preservation Note */}
          <div className="mt-4 pt-4 border-t border-[#22251C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8E9285]">
            <div className="flex items-center gap-2 text-[#9EA394]">
              <FiShield className="w-4 h-4 text-accent shrink-0" />
              <span>Your current draft in the editor is preserved and will auto-resume.</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#707567]">
              <span>Backoff: Exponential (Jittered)</span>
              <span>Worker Node: #edge-iad-04</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER STATE 02: GENERATION QUOTA ---
  if (state === "quota") {
    return (
      <div
        className={`flex flex-col gap-2.5 w-full text-left font-sans ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-[#7A7E72] font-semibold tracking-wider">
              State 02: Generation Quota
            </span>
            <span className="font-mono text-xs text-[#44473C]">/</span>
            <span className="font-mono text-xs text-[#8E9285]">Anonymous Daily Throttle</span>
          </div>
          <span className="font-mono text-xs text-[#7A7E72] hidden sm:inline">
            Resets 00:00 UTC
          </span>
        </div>

        <div className="bg-[#141611] border border-[#2B2F23] rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(23,24,21,0.25)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              {/* Quota Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20241A] text-white font-mono text-xs border border-[#3A402D]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-semibold text-white">0 of 3 generations left today</span>
              </div>

              {/* Primary Alert Message */}
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-white">
                  Daily anonymous generation limit reached.
                </h3>
                <p className="text-xs text-[#9EAA96] leading-relaxed">
                  Anonymous IP allocations reset automatically at 00:00 UTC (in{" "}
                  <span className="font-mono text-accent font-medium">{resetsAtFormatted}</span>).
                </p>
              </div>

              {/* UX Assurance */}
              <div className="inline-flex items-center gap-2.5 p-3 rounded-lg bg-[#191C15] border border-[#2B2F23]">
                <FiCheckCircle className="w-4 h-4 text-accent shrink-0" />
                <p className="font-medium text-xs text-[#C5C8BD]">
                  Markdown editor and export features remain 100% usable.
                </p>
              </div>
            </div>

            {/* Quota Visual Progress Box */}
            <div className="w-full md:w-56 p-4 rounded-lg bg-[#191C15] border border-[#2C3024] flex flex-col justify-between gap-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8E9285]">Tier: Anonymous</span>
                <span className="text-red-400 font-semibold">100% used</span>
              </div>
              <div className="w-full bg-[#24281E] h-2 rounded overflow-hidden">
                <div className="bg-red-500 w-full h-full rounded transition-all duration-500" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7E72]">
                <span>Free Plan</span>
                <span className="text-white font-medium">3/3 Used</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Group */}
          <div className="mt-6 pt-5 border-t border-[#22251C] flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/login"
              className="h-9 px-4 bg-accent hover:bg-[#a8d94e] text-[#0D0E0C] font-semibold text-xs rounded-md flex items-center gap-2 transition-all shadow-xs"
            >
              <SiGithub className="w-3.5 h-3.5" />
              <span>Sign in with GitHub for unlimited generations</span>
            </a>

            {onOpenByok && (
              <button
                type="button"
                onClick={onOpenByok}
                className="h-9 px-3.5 bg-[#20241A] hover:bg-[#2A3022] text-[#D8D9D2] hover:text-white border border-[#3A402D] rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <FiKey className="w-3.5 h-3.5 text-accent" />
                <span>Bring your own API key</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER STATE 03: GITHUB API LOOKUP (USER_NOT_FOUND) ---
  return (
    <div
      className={`flex flex-col gap-2.5 w-full text-left font-sans ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase text-[#7A7E72] font-semibold tracking-wider">
            State 03: GitHub API Lookup
          </span>
          <span className="font-mono text-xs text-[#44473C]">/</span>
          <span className="font-mono text-xs text-[#8E9285]">Validation / User Not Found</span>
        </div>
        <span className="font-mono text-xs text-red-400 hidden sm:inline">
          Octokit::NotFound (404)
        </span>
      </div>

      <div className="bg-[#141611] border border-[#2B2F23] rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(23,24,21,0.25)]">
        <div className="max-w-xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#C0C3BA]">GitHub username query</span>
            <span className="font-mono text-[11px] text-[#7A7E72]">Resolver: REST v3</span>
          </div>

          {/* Input Box Visual with Error Highlighting */}
          <div className="relative flex items-center rounded-md border border-red-500 bg-[#0D0E0C] transition-all">
            <span className="inline-flex items-center px-3 h-9 bg-[#191C15] border-r border-red-500/70 font-mono text-xs text-[#8E9285] select-none">
              @
            </span>
            <div className="w-full h-9 px-3 flex items-center font-mono text-xs text-red-200">
              {username}
            </div>
            <div className="pr-3 text-red-400 flex items-center">
              <FiAlertCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Inline Error Details */}
          <div className="flex items-start gap-2 pt-0.5 text-xs text-red-400">
            <FiAlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="leading-snug">
              GitHub user &lsquo;<strong className="text-white font-mono">@{username}</strong>&rsquo; not found.
              Please verify spelling or check if the account is private.
            </span>
          </div>

          {/* Quick Action Suggestion */}
          <div className="mt-2 p-2.5 rounded bg-[#191C15] border border-[#2C3024] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8E9285]">Did you mean:</span>
              <button
                type="button"
                onClick={() => onSelectSuggestion?.(suggestion)}
                className="font-mono text-accent font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>@{suggestion}</span>
              </button>
            </div>
            <span className="font-mono text-[10px] text-[#7A7E72] uppercase tracking-wider">
              Match: Levenshtein {score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
