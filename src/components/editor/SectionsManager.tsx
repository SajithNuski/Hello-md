
"use client";

import { useState } from "react";
import {
  FiRefreshCw,
  FiUser,
  FiInfo,
  FiCpu,
  FiFolder,
  FiShare2,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { LuGripVertical, LuSparkles } from "react-icons/lu";
import { SectionItem } from "@/lib/db/collections";
import { SectionKey, Tone } from "@/lib/config";
import { IntroConfig, getDefaultIntroConfig } from "@/lib/introConfig";
import { IntroSectionControls } from "./IntroSectionControls";
import { AboutConfig, DEFAULT_ABOUT_CONFIG, getDefaultAboutConfig } from "@/lib/aboutConfig";
import { AboutSectionControls } from "./AboutSectionControls";
import { StatsConfig, getDefaultStatsConfig } from "@/lib/statsConfig";
import { StatsSectionControls } from "./StatsSectionControls";

interface SectionsManagerProps {
  sections: SectionItem[];
  selectedKey: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  onToggleEnabled: (key: SectionKey) => void;
  onRegenerateSection: (key: SectionKey, tone: Tone) => Promise<void>;
  isRegenerating: boolean;
  onMoveSection?: (key: SectionKey, direction: "up" | "down") => void;
  introConfig?: IntroConfig;
  onIntroConfigChange?: (updated: IntroConfig) => void;
  aboutConfig?: AboutConfig;
  onAboutConfigChange?: (updated: AboutConfig) => void;
  statsConfig?: StatsConfig;
  onStatsConfigChange?: (updated: StatsConfig) => void;
  username?: string;
}

const SECTION_LABELS: Record<SectionKey, string> = {
  intro: "Intro & Bio",
  about: "About Me",
  skills: "Tech Stack & Badges",
  projects: "Featured Projects",
  stats: "GitHub Analytics",
  contact: "Connect & Socials",
};

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  intro: FiUser,
  about: FiInfo,
  skills: FiCpu,
  projects: FiFolder,
  stats: FiBarChart2,
  contact: FiShare2,
};

export function SectionsManager({
  sections,
  selectedKey,
  onSelectSection,
  onToggleEnabled,
  onRegenerateSection,
  isRegenerating,
  onMoveSection,
  introConfig,
  onIntroConfigChange,
  aboutConfig,
  onAboutConfigChange,
  statsConfig,
  onStatsConfigChange,
  username = "",
}: SectionsManagerProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>("professional");

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="w-[300px] sm:w-[320px] shrink-0 bg-surface border-r border-border flex flex-col justify-between select-none h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="h-10 px-3.5 flex items-center justify-between border-b border-border bg-surface-raised/30 shrink-0">
          <span className="font-mono text-eyebrow font-medium text-text-muted tracking-[0.04em] uppercase">
            SECTIONS
          </span>
          <span className="font-mono text-meta text-text-secondary">
            {activeCount}/{sections.length} ACTIVE
          </span>
        </div>

        {/* Section Rows */}
        <div className="flex flex-col py-2 gap-1.5 px-2">
          {sections.map((section, idx) => {
            const isSelected = section.key === selectedKey;
            const label = SECTION_LABELS[section.key as SectionKey] || section.key;
            const SectionIcon = SECTION_ICONS[section.key as SectionKey] || FiFolder;

            return (
              <div
                key={section.key}
                className={`rounded-md transition-all ${
                  isSelected
                    ? "bg-surface-raised border border-border shadow-xs"
                    : "hover:bg-surface-raised/50 border border-transparent"
                }`}
              >
                {/* Row Header */}
                <div
                  onClick={() => onSelectSection(section.key as SectionKey)}
                  className="p-2.5 flex items-center justify-between cursor-pointer relative"
                >
                  {/* Left Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-accent rounded-r"></div>
                  )}

                  <div className="flex items-center gap-1.5 pl-1 overflow-hidden">
                    {/* Reorder Arrows */}
                    {onMoveSection ? (
                      <div className="flex flex-col -space-y-1 mr-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onMoveSection(section.key as SectionKey, "up")}
                          className="text-text-muted hover:text-text-primary disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move section up"
                        >
                          <FiArrowUp className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={() => onMoveSection(section.key as SectionKey, "down")}
                          className="text-text-muted hover:text-text-primary disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move section down"
                        >
                          <FiArrowDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <LuGripVertical className="w-3.5 h-3.5 text-text-muted cursor-grab shrink-0" />
                    )}

                    <SectionIcon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-text-primary" : "text-text-secondary"
                      }`}
                    />
                    <span
                      className={`text-nav truncate ${
                        isSelected
                          ? "font-medium text-text-primary"
                          : section.enabled
                          ? "text-text-primary"
                          : "text-text-muted line-through"
                      }`}
                    >
                      {label}
                    </span>
                    {section.source === "user" && (
                      <span className="font-mono text-[9px] bg-surface text-text-secondary px-1 py-0.2 rounded-sm border border-border font-medium shrink-0">
                        Edited
                      </span>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEnabled(section.key as SectionKey);
                    }}
                    className={`w-7 h-4 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
                      section.enabled ? "bg-text-primary justify-end" : "bg-border justify-start"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
                  </div>
                </div>

                {/* Selected Action Drawer */}
                {isSelected && (
                  <div className="px-3 pb-3 pt-1 border-t border-border/50 flex flex-col gap-2">
                    {/* Regenerate Bar (only for AI-written sections: skills, projects, contact) */}
                    {section.key !== "intro" && section.key !== "about" && section.key !== "stats" && (
                      <div className="flex items-center justify-between text-nav text-text-secondary pt-1">
                        <button
                          type="button"
                          disabled={isRegenerating}
                          onClick={() => onRegenerateSection(section.key as SectionKey, selectedTone)}
                          className="flex items-center gap-1.5 text-meta font-medium text-text-primary hover:text-accent-hover transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isRegenerating ? (
                            <FiRefreshCw className="w-3.5 h-3.5 animate-spin text-text-primary" />
                          ) : (
                            <LuSparkles className="w-3.5 h-3.5 text-text-primary stroke-[1.5]" />
                          )}
                          <span>Regenerate</span>
                        </button>

                        <div className="flex items-center gap-1.5 bg-surface px-2 py-0.5 rounded-sm border border-border shadow-xs">
                          <span className="font-mono text-eyebrow text-text-muted">Tone:</span>
                          <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value as Tone)}
                            className="bg-transparent font-mono text-meta text-text-primary focus:outline-none cursor-pointer"
                          >
                            <option value="professional">Prof.</option>
                            <option value="playful">Playful</option>
                            <option value="minimal">Minimal</option>
                            <option value="hacker">Hacker</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Dedicated Intro & Bio Controls (Profile Photo, Title Animation, Color) */}
                    {section.key === "intro" && onIntroConfigChange && (
                      <div className="pt-1">
                        <IntroSectionControls
                          config={introConfig || getDefaultIntroConfig(username)}
                          onChange={onIntroConfigChange}
                          defaultUsername={username}
                        />
                      </div>
                    )}

                    {/* Dedicated About Me Controls (Hacker, Playful, Professional, Minimal) */}
                    {section.key === "about" && onAboutConfigChange && (
                      <div className="pt-1">
                        <AboutSectionControls
                          config={aboutConfig || getDefaultAboutConfig(username)}
                          onChange={onAboutConfigChange}
                        />
                      </div>
                    )}

                    {/* Dedicated GitHub Analytics Controls (Stats, Languages, Streak, Theme) */}
                    {section.key === "stats" && onStatsConfigChange && (
                      <div className="pt-1">
                        <StatsSectionControls
                          config={statsConfig || getDefaultStatsConfig(username)}
                          onChange={onStatsConfigChange}
                          username={username}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="p-3.5 bg-surface-raised/30 border-t border-border shrink-0">
        <div className="flex items-center justify-between text-meta text-text-secondary font-mono">
          <span>Active Sections</span>
          <span className="text-text-primary font-medium">
            {activeCount} / {sections.length}
          </span>
        </div>
        <div className="w-full bg-border h-1 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300"
            style={{ width: `${(activeCount / Math.max(1, sections.length)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
