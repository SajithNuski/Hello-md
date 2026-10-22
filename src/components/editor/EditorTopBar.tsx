"use client";

import { FiDownload, FiCheck, FiCopy, FiEye } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { VscSplitHorizontal, VscCode } from "react-icons/vsc";

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
    <div className="h-12 w-full bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 select-none">
      {/* User Metadata & Sync Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-raised px-2.5 py-1 rounded-sm border border-border shadow-xs">
          <SiGithub className="w-3.5 h-3.5 text-text-secondary" />
          <span className="font-mono text-meta font-medium text-text-primary">
            @{login}
          </span>
          <span className="font-mono text-[10px] bg-surface text-text-secondary px-1 py-0.2 rounded-sm border border-border uppercase tracking-wider">
            main
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSaving ? "bg-status-warning animate-spin" : "bg-status-success"
            }`}
          ></span>
          <span className="text-nav text-text-secondary font-sans">
            {isSaving
              ? "Saving changes..."
              : lastSavedAt
              ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Saved to local cache"}
          </span>
        </div>
      </div>

      {/* Center View Switcher */}
      <div className="hidden md:flex items-center bg-surface p-0.5 rounded-sm border border-border shadow-xs">
        <button
          onClick={() => onViewChange("split")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-nav font-medium transition-colors ${
            activeView === "split"
              ? "bg-surface-raised text-text-primary shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <VscSplitHorizontal className="w-3.5 h-3.5" />
          <span>Split View</span>
        </button>
        <button
          onClick={() => onViewChange("editor")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-nav font-medium transition-colors ${
            activeView === "editor"
              ? "bg-surface-raised text-text-primary shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <VscCode className="w-3.5 h-3.5" />
          <span>Editor Only</span>
        </button>
        <button
          onClick={() => onViewChange("preview")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-nav font-medium transition-colors ${
            activeView === "preview"
              ? "bg-surface-raised text-text-primary shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <FiEye className="w-3.5 h-3.5" />
          <span>Preview Only</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCopy}
          className="h-8 px-3.5 bg-surface-raised hover:bg-surface text-text-primary text-nav font-medium rounded-sm border border-border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Copy Markdown"
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5 text-text-secondary" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={onExport}
          className="h-8 px-4 bg-accent hover:bg-accent-hover text-text-primary font-medium text-nav rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <FiDownload className="w-3.5 h-3.5 stroke-[2]" />
          <span>Export README</span>
        </button>
      </div>
    </div>
  );
}
