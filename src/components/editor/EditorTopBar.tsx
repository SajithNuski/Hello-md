"use client";

import Link from "next/link";
import { FiDownload, FiCheck, FiCopy, FiEye, FiList, FiEdit3 } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { VscSplitHorizontal, VscCode } from "react-icons/vsc";

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
    <header className="sticky top-0 z-30 h-13 w-full bg-[#FFFFFF] border-b border-[#E2E3DC] flex items-center justify-between px-3 sm:px-5 shrink-0 select-none shadow-xs">
      {/* Left: Brand Mark, Back, Repo Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#52534C] hover:text-[#171815] transition-colors p-1 rounded-md hover:bg-[#F0F1EA]"
          title="Back to Generator"
        >
          <div className="w-7 h-7 rounded-md bg-[#171815] flex items-center justify-center text-white shrink-0 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Hello-md" className="w-5 h-5 object-contain" />
          </div>
          <span className="hidden md:inline font-bold text-sm text-[#171815] tracking-tight">
            Hello-md
          </span>
        </Link>

        <span className="hidden md:inline text-[#DEDFD8]">/</span>

        {/* User / Branch Pill */}
        <div className="flex items-center gap-1.5 bg-[#F0F1EA] px-2.5 py-1 rounded-md border border-[#E2E3DC] text-xs font-mono font-medium text-[#171815] shrink-0">
          <SiGithub className="w-3.5 h-3.5 text-[#52534C]" />
          <span className="truncate max-w-[120px] sm:max-w-[180px]">@{login || "profile"}</span>
          <span className="text-[10px] bg-[#FFFFFF] text-[#52534C] px-1.5 py-0.2 rounded border border-[#E2E3DC] uppercase tracking-wider font-semibold">
            README.md
          </span>
        </div>

        {/* Autosave Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-[#52534C]">
          <span
            className={`w-2 h-2 rounded-full ${
              isSaving ? "bg-[#B45309] animate-spin" : "bg-emerald-500"
            }`}
          />
          <span className="font-sans">
            {isSaving
              ? "Saving changes..."
              : lastSavedAt
              ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "All changes saved"}
          </span>
        </div>
      </div>

      {/* Center: View Switcher */}
      {/* 1. Desktop (>=1024px): Split / Editor / Preview */}
      <div className="hidden lg:flex items-center bg-[#F0F1EA] p-1 rounded-lg border border-[#E2E3DC]">
        <button
          type="button"
          onClick={() => onViewChange("split")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "split"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <VscSplitHorizontal className="w-3.5 h-3.5" />
          <span>Split View</span>
        </button>
        <button
          type="button"
          onClick={() => onViewChange("editor")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "editor"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <VscCode className="w-3.5 h-3.5" />
          <span>Editor Only</span>
        </button>
        <button
          type="button"
          onClick={() => onViewChange("preview")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeView === "preview"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Preview Only</span>
        </button>
      </div>

      {/* 2. Tablet (<1024px & >=640px): Sections / Editor / Preview */}
      <div className="hidden sm:flex lg:hidden items-center bg-[#F0F1EA] p-1 rounded-lg border border-[#E2E3DC]">
        <button
          type="button"
          onClick={() => onMobileTabChange("sections")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "sections"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <FiList className="w-3.5 h-3.5" />
          <span>Sections</span>
        </button>
        <button
          type="button"
          onClick={() => onMobileTabChange("editor")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "editor"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <FiEdit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => onMobileTabChange("preview")}
          className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "preview"
              ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
              : "text-[#52534C] hover:text-[#171815]"
          }`}
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: Copy & Export README */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Copy Markdown button */}
        <button
          type="button"
          onClick={onCopy}
          className="h-9 px-3.5 bg-[#FFFFFF] hover:bg-[#F0F1EA] text-[#171815] text-xs font-semibold rounded-lg border border-[#DEDFD8] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Copy full README Markdown to clipboard"
        >
          {copied ? (
            <>
              <FiCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="w-4 h-4 text-[#52534C]" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>

        {/* Export README button */}
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-4 bg-accent hover:bg-accent-hover text-[#171815] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#171815]/10"
        >
          <FiDownload className="w-4 h-4 stroke-[2.5]" />
          <span>Export README</span>
        </button>
      </div>
    </header>
  );
}
