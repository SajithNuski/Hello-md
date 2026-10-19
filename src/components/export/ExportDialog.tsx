"use client";

import { useState } from "react";
import { FiX, FiCopy, FiDownload, FiCheck, FiGitCommit } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  login: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  markdown,
  login,
}: ExportDialogProps) {
  const [copied, setCopied] = useState(false);
  const [commitMessage, setCommitMessage] = useState("docs: update GitHub profile README.md via Hello-md");

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-surface-raised w-full max-w-[560px] rounded-lg border border-border shadow-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="h-12 px-6 flex items-center justify-between border-b border-border bg-surface">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-nav text-text-primary">Export Profile README</span>
            <span className="font-mono text-eyebrow text-text-secondary bg-surface-raised px-1.5 py-0.2 rounded-sm border border-border">
              @{login}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-sm hover:bg-surface-raised transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Option 1: Quick Actions (Copy & Download) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCopy}
              className="h-14 p-3.5 bg-surface hover:bg-surface-raised border border-border rounded-sm transition-colors flex items-center gap-3.5 text-left cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-sm bg-surface-raised border border-border flex items-center justify-center shrink-0 shadow-xs">
                {copied ? <FiCheck className="w-4 h-4 text-status-success" /> : <FiCopy className="w-4 h-4 text-text-primary" />}
              </div>
              <div className="flex flex-col">
                <span className="text-nav font-medium text-text-primary">{copied ? "Copied!" : "Copy Markdown"}</span>
                <span className="text-meta text-text-secondary">To clipboard</span>
              </div>
            </button>

            <button
              onClick={handleDownload}
              className="h-14 p-3.5 bg-surface hover:bg-surface-raised border border-border rounded-sm transition-colors flex items-center gap-3.5 text-left cursor-pointer shadow-xs"
            >
              <div className="w-8 h-8 rounded-sm bg-surface-raised border border-border flex items-center justify-center shrink-0 shadow-xs">
                <FiDownload className="w-4 h-4 text-text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-nav font-medium text-text-primary">Download File</span>
                <span className="text-meta text-text-secondary">README.md</span>
              </div>
            </button>
          </div>

          {/* Option 2: Push to GitHub */}
          <div className="flex flex-col gap-3.5 p-5 bg-surface rounded-sm border border-border shadow-xs">
            <div className="flex items-center gap-2">
              <SiGithub className="w-4 h-4 text-text-primary" />
              <span className="text-nav font-medium text-text-primary">Push directly to GitHub repo</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-eyebrow font-mono text-text-secondary uppercase tracking-[0.04em]">
                Target Repository
              </label>
              <div className="h-9 px-3 bg-surface-raised rounded-sm border border-border flex items-center font-mono text-meta text-text-primary shadow-xs">
                {login}/{login}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-eyebrow font-mono text-text-secondary uppercase tracking-[0.04em]">
                Commit Message
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="h-9 px-3 bg-surface-raised rounded-sm border border-border font-mono text-meta text-text-primary focus:outline-none focus:border-text-primary shadow-xs"
              />
            </div>

            <button
              onClick={() => {
                alert("GitHub publishing with OAuth will be enabled in Milestone 7. You can Copy or Download your README.md right now!");
              }}
              className="h-10 w-full mt-1.5 bg-accent hover:bg-accent-hover text-text-primary font-medium text-nav rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <FiGitCommit className="w-4 h-4 stroke-[2]" />
              <span>Commit &amp; Push to {login}/{login}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
