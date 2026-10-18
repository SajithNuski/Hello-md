"use client";

import { useState } from "react";
import { Download, RefreshCw, Check, Copy } from "lucide-react";

interface EditorTopBarProps {
  login: string;
  isSaving: boolean;
  lastSavedAt: Date | null;
  activeView: "split" | "editor" | "preview";
  onViewChange: (view: "split" | "editor" | "preview") => void;
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
  onExport,
  onCopy,
  copied,
}: EditorTopBarProps) {
  return (
    <div className="h-12 w-full bg-[#F0F0EC] border-b border-[#DEDFD8] flex items-center justify-between px-6 shrink-0 select-none">
      {/* User Metadata & Sync Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-[#FAFAF8] px-2.5 py-1 rounded-[6px] border border-[#DEDFD8]">
          <span className="font-mono text-xs font-semibold text-[#171815]">
            @{login}
          </span>
          <span className="font-mono text-[10px] bg-[#E2E3DD] text-[#65665F] px-1 py-0.2 rounded uppercase tracking-wider">
            main
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSaving ? "bg-[#B45309] animate-spin" : "bg-[#16A34A] animate-pulse"
            }`}
          ></span>
          <span className="text-xs text-[#65665F]">
            {isSaving
              ? "Saving changes..."
              : lastSavedAt
              ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Saved"}
          </span>
        </div>
      </div>

      {/* Center View Switcher */}
      <div className="hidden md:flex items-center bg-[#E2E3DD] p-0.5 rounded-[6px] border border-[#DEDFD8]">
        <button
          onClick={() => onViewChange("split")}
          className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-colors ${
            activeView === "split"
              ? "bg-[#FAFAF8] text-[#171815] shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          Split View
        </button>
        <button
          onClick={() => onViewChange("editor")}
          className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-colors ${
            activeView === "editor"
              ? "bg-[#FAFAF8] text-[#171815] shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          Editor Only
        </button>
        <button
          onClick={() => onViewChange("preview")}
          className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-colors ${
            activeView === "preview"
              ? "bg-[#FAFAF8] text-[#171815] shadow-xs"
              : "text-[#65665F] hover:text-[#171815]"
          }`}
        >
          Preview Only
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onCopy}
          className="h-8 px-3 bg-[#FAFAF8] text-[#171815] text-xs font-medium rounded-[6px] border border-[#DEDFD8] hover:bg-[#E2E3DD] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Copy Markdown"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#65665F]" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={onExport}
          className="h-8 px-3.5 bg-[#C5F467] hover:bg-[#A8D94E] text-[#171815] font-semibold text-xs rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 stroke-[2]" />
          <span>Export README</span>
        </button>
      </div>
    </div>
  );
}
