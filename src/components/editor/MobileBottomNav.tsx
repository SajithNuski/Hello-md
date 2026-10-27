"use client";

import { FiList, FiEdit3, FiEye } from "react-icons/fi";

export type EditorMobileTab = "sections" | "editor" | "preview";

interface MobileBottomNavProps {
  activeTab: EditorMobileTab;
  onTabChange: (tab: EditorMobileTab) => void;
  activeSectionsCount: number;
  totalSectionsCount: number;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  activeSectionsCount,
  totalSectionsCount,
}: MobileBottomNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Editor Mobile Panes"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#FFFFFF]/95 dark:bg-[#12130F]/95 backdrop-blur-md border-t border-[#E2E3DC] dark:border-[#262820] z-30 flex items-center justify-around px-2 select-none shadow-lg"
    >
      {/* Sections Tab */}
      <button
        role="tab"
        id="tab-sections"
        aria-selected={activeTab === "sections"}
        aria-controls="pane-sections"
        type="button"
        onClick={() => onTabChange("sections")}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer relative ${
          activeTab === "sections"
            ? "text-[#171815] dark:text-[#FAFAF8] font-semibold"
            : "text-[#52534C] dark:text-[#8E9285] hover:text-[#171815] dark:hover:text-white"
        }`}
      >
        <div className="relative">
          <FiList className="w-5 h-5" aria-hidden="true" />
          <span className="absolute -top-1 -right-3.5 min-w-4 h-4 px-1 rounded-full bg-[#171815] dark:bg-accent text-[#FAFAF8] dark:text-[#0D0E0C] text-[9px] font-mono font-bold flex items-center justify-center">
            {activeSectionsCount}/{totalSectionsCount}
          </span>
        </div>
        <span className="text-[11px] leading-none">Sections</span>
      </button>

      {/* Editor Tab */}
      <button
        role="tab"
        id="tab-editor"
        aria-selected={activeTab === "editor"}
        aria-controls="pane-editor"
        type="button"
        onClick={() => onTabChange("editor")}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer relative ${
          activeTab === "editor"
            ? "text-[#171815] dark:text-[#FAFAF8] font-semibold"
            : "text-[#52534C] dark:text-[#8E9285] hover:text-[#171815] dark:hover:text-white"
        }`}
      >
        <FiEdit3 className="w-5 h-5" aria-hidden="true" />
        <span className="text-[11px] leading-none">Editor</span>
      </button>

      {/* Preview Tab */}
      <button
        role="tab"
        id="tab-preview"
        aria-selected={activeTab === "preview"}
        aria-controls="pane-preview"
        type="button"
        onClick={() => onTabChange("preview")}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer relative ${
          activeTab === "preview"
            ? "text-[#171815] dark:text-[#FAFAF8] font-semibold"
            : "text-[#52534C] dark:text-[#8E9285] hover:text-[#171815] dark:hover:text-white"
        }`}
      >
        <FiEye className="w-5 h-5" aria-hidden="true" />
        <span className="text-[11px] leading-none">Preview</span>
      </button>
    </nav>
  );
}
