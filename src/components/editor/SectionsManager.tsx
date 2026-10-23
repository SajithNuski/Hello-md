"use client";

import {
  FiUser,
  FiInfo,
  FiCpu,
  FiFolder,
  FiShare2,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { LuGripVertical } from "react-icons/lu";
import { SectionItem } from "@/lib/db/collections";
import { SectionKey } from "@/lib/config";

interface SectionsManagerProps {
  sections: SectionItem[];
  selectedKey: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  onToggleEnabled: (key: SectionKey) => void;
  onMoveSection?: (key: SectionKey, direction: "up" | "down") => void;
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
  onMoveSection,
}: SectionsManagerProps) {
  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <aside className="w-[260px] min-w-[260px] max-w-[260px] shrink-0 bg-[#FBFBFA] border-r border-[#E2E3DC] flex flex-col select-none h-full overflow-hidden">
      {/* Header: Title and Active Count shown once */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#E2E3DC] bg-[#FAFAF8] shrink-0">
        <span className="text-xs font-mono font-semibold text-[#52534C] uppercase tracking-wider">
          Sections
        </span>
        <span className="text-xs font-mono font-medium text-[#171815] bg-[#F0F1EA] px-2 py-0.5 rounded-md border border-[#E2E3DC]">
          {activeCount} of {sections.length} active
        </span>
      </div>

      {/* Single Scrollable Section List (No nested scrollbars) */}
      <div className="flex-1 overflow-y-auto thin-scrollbar p-2 flex flex-col gap-1">
        {sections.map((section, idx) => {
          const isSelected = section.key === selectedKey;
          const label = SECTION_LABELS[section.key as SectionKey] || section.key;
          const SectionIcon = SECTION_ICONS[section.key as SectionKey] || FiFolder;
          const isFirst = idx === 0;
          const isLast = idx === sections.length - 1;

          return (
            <div
              key={section.key}
              onClick={() => onSelectSection(section.key as SectionKey)}
              className={`h-11 px-2.5 flex items-center justify-between rounded-lg transition-all cursor-pointer relative border ${
                isSelected
                  ? "bg-[#EAEBE4] border-[#D6D7CE] text-[#171815] font-medium shadow-xs"
                  : "bg-transparent hover:bg-[#F0F1EA] border-transparent text-[#52534C] hover:text-[#171815]"
              }`}
            >
              {/* Left Accent Bar on Selected Row */}
              {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent rounded-r" />
              )}

              {/* Row Left: Reorder, Icon, Label, Edited Dot */}
              <div className="flex items-center gap-2 pl-1 overflow-hidden min-w-0">
                {/* Reorder Arrows */}
                {onMoveSection ? (
                  <div
                    className="flex flex-col -space-y-1 mr-0.5 text-[#52534C]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => onMoveSection(section.key as SectionKey, "up")}
                      className="p-0.5 hover:text-[#171815] disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move section up"
                    >
                      <FiArrowUp className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => onMoveSection(section.key as SectionKey, "down")}
                      className="p-0.5 hover:text-[#171815] disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move section down"
                    >
                      <FiArrowDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <LuGripVertical className="w-3.5 h-3.5 text-[#91928A] cursor-grab shrink-0" />
                )}

                {/* Section Icon */}
                <SectionIcon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? "text-[#171815]" : "text-[#52534C]"
                  }`}
                />

                {/* Section Name */}
                <span
                  className={`text-sm truncate transition-colors ${
                    isSelected
                      ? "font-semibold text-[#171815]"
                      : section.enabled
                      ? "text-[#171815]"
                      : "text-[#91928A] line-through"
                  }`}
                >
                  {label}
                </span>

                {/* "Edited" Small Indicator Dot */}
                {section.source === "user" && (
                  <span
                    className="w-2 h-2 rounded-full bg-accent ring-1 ring-[#171815]/20 shrink-0"
                    title="Section manually edited"
                  />
                )}
              </div>

              {/* Row Right: Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={section.enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEnabled(section.key as SectionKey);
                }}
                className={`w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ml-2 ${
                  section.enabled ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
                }`}
                title={section.enabled ? "Disable section" : "Enable section"}
              >
                <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
