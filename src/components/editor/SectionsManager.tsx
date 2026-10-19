"use client";

import { useState } from "react";
import { GripVertical, Sparkles, Loader2 } from "lucide-react";
import { SectionItem } from "@/lib/db/collections";
import { SectionKey, Tone } from "@/lib/config";

interface SectionsManagerProps {
  sections: SectionItem[];
  selectedKey: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  onToggleEnabled: (key: SectionKey) => void;
  onRegenerateSection: (key: SectionKey, tone: Tone) => Promise<void>;
  isRegenerating: boolean;
}

const SECTION_LABELS: Record<SectionKey, string> = {
  intro: "Intro & Bio",
  about: "About Me",
  skills: "Tech Stack & Badges",
  projects: "Featured Projects",
  contact: "Connect & Socials",
};

export function SectionsManager({
  sections,
  selectedKey,
  onSelectSection,
  onToggleEnabled,
  onRegenerateSection,
  isRegenerating,
}: SectionsManagerProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>("professional");

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="w-[280px] shrink-0 bg-surface border-r border-border flex flex-col justify-between select-none">
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="h-10 px-3.5 flex items-center justify-between border-b border-border bg-surface-raised/30">
          <span className="font-mono text-eyebrow font-medium text-text-muted tracking-[0.04em] uppercase">
            SECTIONS
          </span>
          <span className="font-mono text-meta text-text-secondary">
            {activeCount}/{sections.length} ACTIVE
          </span>
        </div>

        {/* Section Rows */}
        <div className="flex flex-col py-2 gap-1 px-2">
          {sections.map((section) => {
            const isSelected = section.key === selectedKey;
            const label = SECTION_LABELS[section.key as SectionKey] || section.key;

            return (
              <div
                key={section.key}
                className={`rounded-sm transition-all ${
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

                  <div className="flex items-center gap-2.5 pl-1.5 overflow-hidden">
                    <GripVertical className="w-3.5 h-3.5 text-text-muted cursor-grab shrink-0" />
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
                      <span className="font-mono text-[10px] bg-surface text-text-secondary px-1.5 py-0.2 rounded-sm border border-border font-medium shrink-0">
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
                  <div className="px-3 pb-2.5 pt-1 border-t border-border/50 flex items-center justify-between text-nav text-text-secondary">
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => onRegenerateSection(section.key as SectionKey, selectedTone)}
                      className="flex items-center gap-1.5 text-meta font-medium text-text-primary hover:text-[#4A6700] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isRegenerating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-text-primary" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-text-primary stroke-[1.5]" />
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="p-3.5 bg-surface-raised/30 border-t border-border">
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
