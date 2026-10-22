"use client";

import {
  StatsConfig,
  STATS_THEMES,
} from "@/lib/statsConfig";
import {
  FiBarChart2,
  FiCode,
  FiZap,
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
    <div className="flex flex-col gap-3.5 p-3 bg-surface-raised/40 border border-border/80 rounded-md text-xs">
      {/* Dynamic Data Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiBarChart2 className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-eyebrow font-semibold uppercase text-text-primary">
            GitHub Analytics
          </span>
        </div>
        <span className="font-mono text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
          @{username || "username"}
        </span>
      </div>

      {/* Cards Toggles */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-eyebrow text-text-secondary uppercase">
          Active Analytics Cards ({activeCount}/3)
        </label>

        {/* 1. GitHub Stats */}
        <label
          className={`flex items-start gap-2.5 p-2 rounded border transition-all cursor-pointer select-none ${
            config.showStats
              ? "bg-accent/10 border-accent/40 text-text-primary"
              : "bg-surface border-border text-text-secondary hover:border-border-hover"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showStats}
            onChange={(e) => update({ showStats: e.target.checked })}
            className="mt-0.5 rounded border-border text-accent focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <FiBarChart2 className="w-3.5 h-3.5 text-accent" />
                GitHub Stats
              </span>
              <span className="font-mono text-[10px] text-text-muted">anuraghazra</span>
            </div>
            <span className="text-[11px] text-text-secondary mt-0.5">
              Stars, total commits, pull requests, issues, and contributions.
            </span>
          </div>
        </label>

        {/* 2. Most Used Languages */}
        <label
          className={`flex items-start gap-2.5 p-2 rounded border transition-all cursor-pointer select-none ${
            config.showLangs
              ? "bg-accent/10 border-accent/40 text-text-primary"
              : "bg-surface border-border text-text-secondary hover:border-border-hover"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showLangs}
            onChange={(e) => update({ showLangs: e.target.checked })}
            className="mt-0.5 rounded border-border text-accent focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <FiCode className="w-3.5 h-3.5 text-accent" />
                Most Used Languages
              </span>
              <span className="font-mono text-[10px] text-text-muted">compact</span>
            </div>
            <span className="text-[11px] text-text-secondary mt-0.5">
              Top languages breakdown from all public repositories.
            </span>
          </div>
        </label>

        {/* 3. Streak Stats */}
        <label
          className={`flex items-start gap-2.5 p-2 rounded border transition-all cursor-pointer select-none ${
            config.showStreak
              ? "bg-accent/10 border-accent/40 text-text-primary"
              : "bg-surface border-border text-text-secondary hover:border-border-hover"
          }`}
        >
          <input
            type="checkbox"
            checked={config.showStreak}
            onChange={(e) => update({ showStreak: e.target.checked })}
            className="mt-0.5 rounded border-border text-accent focus:ring-0 cursor-pointer"
          />
          <div className="flex flex-col flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <FiZap className="w-3.5 h-3.5 text-accent" />
                Streak Stats
              </span>
              <span className="font-mono text-[10px] text-text-muted">DenverCoder1</span>
            </div>
            <span className="text-[11px] text-text-secondary mt-0.5">
              Total contributions, current commit streak, and longest streak.
            </span>
          </div>
        </label>
      </div>

      {/* Theme Selector */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Card Theme
          </label>
          <span className="font-mono text-[10px] text-accent font-medium">
            {config.theme || "dark"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {STATS_THEMES.map((th) => {
            const isSelected = (config.theme || "dark") === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => update({ theme: th.id })}
                className={`flex flex-col items-center gap-1 p-1.5 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-accent/15 border-accent text-accent font-semibold shadow-xs"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
                }`}
              >
                <div
                  className="w-full h-3 rounded flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: th.bg }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: th.accent }}
                  />
                  {isSelected && (
                    <FiCheck className="w-2.5 h-2.5 text-white absolute right-0.5" />
                  )}
                </div>
                <span className="font-mono text-[10px] truncate max-w-full">
                  {th.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Status Info */}
      <div className="flex items-center gap-1.5 p-2 rounded bg-surface/70 border border-border text-text-muted text-[11px]">
        <FiInfo className="w-3.5 h-3.5 shrink-0 text-text-secondary" />
        <span className="truncate">{layoutSummary}</span>
      </div>
    </div>
  );
}
