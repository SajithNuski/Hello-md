"use client";

import Link from "next/link";
import { FiDownload, FiCheck, FiCopy, FiEye, FiList, FiEdit3, FiColumns, FiCode } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

interface EditorTopBarProps {
  login: string;
  isSaving: boolean;
  lastSavedAt: Date | null;
  activeView: "split" | "editor" | "preview";
  onViewChange: (view: "split" | "editor" | "preview") => void;
  mobileTab: "sections" | "editor" | "preview";
  onMobileTabChange: (tab: "sections" | "editor" | "preview") => void;
  onExport: () => void;
  onCopy: () => void;
  copied: boolean;
}

export function EditorTopBar({
  login,
  isSaving,
  lastSavedAt,
  activeView,
  onViewChange,
  mobileTab,
  onMobileTabChange,
  onExport,
  onCopy,
  copied,
}: EditorTopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-12 w-full bg-[#FFFFFF] border-b border-[#E2E3DC] flex items-center justify-between px-3 sm:px-4 shrink-0 select-none">
      {/* Left: Brand Mark, Back, Repo Breadcrumb & Save Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#52534C] hover:text-[#171815] transition-colors p-1 rounded-md hover:bg-[#F0F1EA]"
          title="Back to Generator"
        >
          <div className="w-6 h-6 rounded-md bg-[#171815] flex items-center justify-center text-white shrink-0 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Hello-md" className="w-4 h-4 object-contain" />
          </div>
          <span className="hidden md:inline font-bold text-sm text-[#171815] tracking-tight">
            Hello-md
          </span>
        </Link>

        <span className="hidden md:inline text-[#DEDFD8]">/</span>

        {/* User Repository Pill */}
        <div className="flex items-center gap-1.5 bg-[#F4F4F2] px-2.5 py-1 rounded-md border border-[#E2E3DC] text-xs font-mono text-[#171815] shrink-0">
          <SiGithub className="w-3.5 h-3.5 text-[#52534C]" />
          <span className="truncate max-w-[120px] sm:max-w-[180px] font-medium">@{login || "profile"}</span>
        </div>

        {/* Autosave Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#65665F]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSaving ? "bg-[#B45309] animate-spin" : "bg-emerald-500"
            }`}
          />
          <span className="font-sans">
            {isSaving
              ? "Saving..."
              : lastSavedAt
              ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Saved"}
          </span>
        </div>
      </div>

      {/* Center: View Switcher (Linear/macOS style segmented pill) */}
      {/* 1. Desktop (>=1024px): Split / Editor / Preview */}
      <div className="hidden lg:flex items-center bg-[#EAEBE5] p-0.5 rounded-lg border border-[#DEDFD8]">
        <button
          type="button"
          onClick={() => onViewChange("split")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "split"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiColumns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>
        <button
          type="button"
          onClick={() => onViewChange("editor")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "editor"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiCode className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => onViewChange("preview")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "preview"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* 2. Tablet (<1024px & >=640px): Sections / Editor / Preview */}
      <div className="hidden sm:flex lg:hidden items-center bg-[#EAEBE5] p-0.5 rounded-lg border border-[#DEDFD8]">
        <button
          type="button"
          onClick={() => onMobileTabChange("sections")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "sections"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiList className="w-3.5 h-3.5" />
          <span>Sections</span>
        </button>
        <button
          type="button"
          onClick={() => onMobileTabChange("editor")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "editor"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiEdit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => onMobileTabChange("preview")}
          className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "preview"
              ? "bg-[#FFFFFF] text-[#171815] font-semibold shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: Copy & Export README */}
      <div className="flex items-center gap-2">
        {/* Copy Markdown button */}
        <button
          type="button"
          onClick={onCopy}
          className="h-8 px-3 bg-[#FFFFFF] hover:bg-[#F0F1EA] text-[#171815] text-xs font-medium rounded-md border border-[#DEDFD8] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Copy full README Markdown to clipboard"
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span className="text-emerald-700 font-medium">Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5 text-[#65665F]" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>

        {/* Export README button */}
        <button
          type="button"
          onClick={onExport}
          className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-[#171815] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#171815]/10"
        >
          <FiDownload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export README</span>
        </button>
      </div>
    </header>
  );
}
