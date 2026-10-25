"use client";

import {
  StatsConfig,
  STATS_THEMES,
} from "@/lib/statsConfig";
import {
  FiCheck,
  FiInfo,
} from "react-icons/fi";

interface StatsSectionControlsProps {
  config: StatsConfig;
  onChange: (updated: StatsConfig) => void;
  username?: string;
}

export function StatsSectionControls({
  config,
  onChange,
  username = "",
}: StatsSectionControlsProps) {
  const update = (partial: Partial<StatsConfig>) => {
    onChange({ ...config, ...partial });
  };

  const activeCount = [config.showStats, config.showLangs, config.showStreak].filter(Boolean).length;

  // Determine active layout message
  let layoutSummary = "Section omitted (all cards disabled)";
  if (config.showStats && config.showLangs && config.showStreak) {
    layoutSummary = "Side-by-side 2-cell table + Streak full-width below";
  } else if (config.showStats && config.showLangs) {
    layoutSummary = "Side-by-side 2-cell HTML table";
  } else if (activeCount === 2) {
    layoutSummary = "Stacked centered cards";
  } else if (activeCount === 1) {
    layoutSummary = "Single centered card";
  }

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#FFFFFF] border border-[#E2E3DC] rounded-lg text-sm text-[#171815]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E3DC]">
        <div>
          <h3 className="text-base font-semibold text-[#171815]">
            GitHub Analytics
          </h3>
          <p className="text-xs text-[#52534C] mt-0.5">
            Toggle dynamic analytics cards and customize the card color theme.
          </p>
        </div>
        <span className="font-mono text-xs text-[#52534C] bg-[#F0F1EA] px-2.5 py-1 rounded-md border border-[#E2E3DC]">
          @{username || "username"}
        </span>
      </div>

      {/* Cards Toggles */}
      <div className="flex flex-col gap-2.5">
        <label className="text-sm font-semibold text-[#171815]">
          Active Analytics Cards ({activeCount} of 3 active)
        </label>

        {/* 1. GitHub Stats */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
            config.showStats
              ? "bg-[#171815] text-[#FAFAF8] border-[#171815] shadow-xs"
              : "bg-[#FBFBFA] border-[#E2E3DC] text-[#52534C] hover:border-[#171815]"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showStats}
            onChange={(e) => update({ showStats: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-[#DEDFD8] text-[#171815] focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${config.showStats ? "text-white" : "text-[#171815]"}`}>
                GitHub Stats Card
              </span>
              <span className={`text-xs font-mono ${config.showStats ? "text-white/60" : "text-[#91928A]"}`}>anuraghazra</span>
            </div>
            <span className={`text-xs mt-1 ${config.showStats ? "text-white/80" : "text-[#52534C]"}`}>
              Stars, total commits, pull requests, issues, and contributions summary.
            </span>
          </div>
        </label>

        {/* 2. Most Used Languages */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
            config.showLangs
              ? "bg-[#171815] text-[#FAFAF8] border-[#171815] shadow-xs"
              : "bg-[#FBFBFA] border-[#E2E3DC] text-[#52534C] hover:border-[#171815]"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showLangs}
            onChange={(e) => update({ showLangs: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-[#DEDFD8] text-[#171815] focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${config.showLangs ? "text-white" : "text-[#171815]"}`}>
                Most Used Languages
              </span>
              <span className={`text-xs font-mono ${config.showLangs ? "text-white/60" : "text-[#91928A]"}`}>compact</span>
            </div>
            <span className={`text-xs mt-1 ${config.showLangs ? "text-white/80" : "text-[#52534C]"}`}>
              Top languages breakdown calculated across your public repositories.
            </span>
          </div>
        </label>

        {/* 3. Streak Stats */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
            config.showStreak
              ? "bg-[#171815] text-[#FAFAF8] border-[#171815] shadow-xs"
              : "bg-[#FBFBFA] border-[#E2E3DC] text-[#52534C] hover:border-[#171815]"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showStreak}
            onChange={(e) => update({ showStreak: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-[#DEDFD8] text-[#171815] focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${config.showStreak ? "text-white" : "text-[#171815]"}`}>
                Streak Stats
              </span>
              <span className={`text-xs font-mono ${config.showStreak ? "text-white/60" : "text-[#91928A]"}`}>DenverCoder1</span>
            </div>
            <span className={`text-xs mt-1 ${config.showStreak ? "text-white/80" : "text-[#52534C]"}`}>
              Total contributions, current commit streak, and longest streak.
            </span>
          </div>
        </label>
      </div>

      {/* Theme Selector */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E3DC]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#171815]">
            Card Theme
          </label>
          <span className="font-mono text-xs text-[#171815] font-semibold uppercase bg-[#F0F1EA] px-2 py-0.5 rounded border border-[#E2E3DC]">
            {config.theme || "dark"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATS_THEMES.map((th) => {
            const isSelected = (config.theme || "dark") === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => update({ theme: th.id })}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#171815] text-white border-[#171815] shadow-xs"
                    : "bg-[#FBFBFA] border-[#E2E3DC] text-[#52534C] hover:text-[#171815] hover:border-[#DEDFD8]"
                }`}
              >
                <div
                  className="w-full h-4 rounded flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: th.bg }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: th.accent }}
                  />
                  {isSelected && (
                    <FiCheck className="w-3 h-3 text-white absolute right-1" />
                  )}
                </div>
                <span className="font-mono text-xs font-medium truncate max-w-full">
                  {th.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Status Info */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FBFBFA] border border-[#E2E3DC] text-[#52534C] text-xs">
        <FiInfo className="w-4 h-4 shrink-0 text-[#171815]" />
        <span className="truncate">{layoutSummary}</span>
      </div>
    </div>
  );
}
