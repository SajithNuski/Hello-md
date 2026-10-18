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
    <div className="w-[280px] shrink-0 bg-[#F0F0EC] border-r border-[#DEDFD8] flex flex-col justify-between select-none">
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="h-10 px-3.5 flex items-center justify-between border-b border-[#DEDFD8] bg-[#E2E3DD]/50">
          <span className="font-mono text-[11px] font-semibold text-[#65665F] tracking-wider uppercase">
            Sections
          </span>
          <span className="font-mono text-[11px] text-[#91928A]">
            {activeCount}/{sections.length} Active
          </span>
        </div>

        {/* Section Rows */}
        <div className="flex flex-col py-1.5 gap-1 px-1.5">
          {sections.map((section) => {
            const isSelected = section.key === selectedKey;
            const label = SECTION_LABELS[section.key as SectionKey] || section.key;

            return (
              <div
                key={section.key}
                className={`rounded-[6px] transition-all ${
                  isSelected
                    ? "bg-[#FAFAF8] border border-[#DEDFD8] shadow-xs"
                    : "hover:bg-[#FAFAF8]/60 border border-transparent"
                }`}
              >
                {/* Row Header */}
                <div
                  onClick={() => onSelectSection(section.key as SectionKey)}
                  className="p-2 flex items-center justify-between cursor-pointer relative"
                >
                  {/* Left Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#C5F467] rounded-r"></div>
                  )}

                  <div className="flex items-center gap-2 pl-1.5 overflow-hidden">
                    <GripVertical className="w-3.5 h-3.5 text-[#91928A] cursor-grab shrink-0" />
                    <span
                      className={`text-xs truncate ${
                        isSelected
                          ? "font-semibold text-[#171815]"
                          : section.enabled
                          ? "text-[#171815]"
                          : "text-[#91928A] line-through"
                      }`}
                    >
                      {label}
                    </span>
                    {section.source === "user" && (
                      <span className="font-mono text-[9px] bg-[#E2E3DD] text-[#65665F] px-1 py-0.2 rounded font-medium shrink-0">
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
                      section.enabled ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
                  </div>
                </div>

                {/* Selected Action Drawer */}
                {isSelected && (
                  <div className="px-3 pb-2.5 pt-1 border-t border-[#DEDFD8]/50 flex items-center justify-between text-xs text-[#65665F]">
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => onRegenerateSection(section.key as SectionKey, selectedTone)}
                      className="flex items-center gap-1 text-[11px] font-medium text-[#171815] hover:text-[#4A6700] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isRegenerating ? (
                        <Loader2 className="w-3 h-3 animate-spin text-[#171815]" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-[#171815] stroke-[1.5]" />
                      )}
                      <span>Regenerate</span>
                    </button>

                    <div className="flex items-center gap-1 bg-[#F0F0EC] px-1.5 py-0.5 rounded border border-[#DEDFD8]">
                      <span className="font-mono text-[10px] text-[#91928A]">Tone:</span>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as Tone)}
                        className="bg-transparent font-mono text-[10px] text-[#171815] focus:outline-none cursor-pointer"
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
      <div className="p-3 bg-[#E2E3DD]/40 border-t border-[#DEDFD8]">
        <div className="flex items-center justify-between text-[11px] text-[#65665F] font-mono">
          <span>Active Sections</span>
          <span className="text-[#171815] font-semibold">
            {activeCount} / {sections.length}
          </span>
        </div>
        <div className="w-full bg-[#DEDFD8] h-1 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#C5F467] h-full transition-all duration-300"
            style={{ width: `${(activeCount / Math.max(1, sections.length)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
