"use client";

import { useState } from "react";
import { X, Copy, Download, GitCommit, Check } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#FAFAF8] w-full max-w-[560px] rounded-[8px] border border-[#DEDFD8] shadow-lg flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-[#DEDFD8] bg-[#F0F0EC]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#171815]">Export README</span>
            <span className="font-mono text-xs text-[#91928A]">@{login}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#65665F] hover:text-[#171815] rounded-[4px] hover:bg-[#E2E3DD] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-5">
          {/* Option 1: Quick Actions (Copy & Download) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="h-12 p-3 bg-[#F0F0EC] hover:bg-[#E2E3DD] border border-[#DEDFD8] rounded-[6px] transition-colors flex items-center gap-3 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-[4px] bg-[#FAFAF8] border border-[#DEDFD8] flex items-center justify-center shrink-0">
                {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#171815]" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171815]">{copied ? "Copied!" : "Copy Markdown"}</span>
                <span className="text-[11px] text-[#65665F]">To clipboard</span>
              </div>
            </button>

            <button
              onClick={handleDownload}
              className="h-12 p-3 bg-[#F0F0EC] hover:bg-[#E2E3DD] border border-[#DEDFD8] rounded-[6px] transition-colors flex items-center gap-3 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-[4px] bg-[#FAFAF8] border border-[#DEDFD8] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-[#171815]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#171815]">Download File</span>
                <span className="text-[11px] text-[#65665F]">README.md</span>
              </div>
            </button>
          </div>

          {/* Option 2: Push to GitHub */}
          <div className="flex flex-col gap-3 p-4 bg-[#F0F0EC] rounded-[6px] border border-[#DEDFD8]">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-[#171815]" />
              <span className="text-xs font-semibold text-[#171815]">Push directly to GitHub repo</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-[#65665F]">Target Repository</label>
              <div className="h-8 px-3 bg-[#FAFAF8] rounded-[4px] border border-[#DEDFD8] flex items-center font-mono text-xs text-[#171815]">
                {login}/{login}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-[#65665F]">Commit Message</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="h-8 px-3 bg-[#FAFAF8] rounded-[4px] border border-[#DEDFD8] font-mono text-xs text-[#171815] focus:outline-none focus:border-[#171815]"
              />
            </div>

            <button
              onClick={() => {
                alert("GitHub publishing with OAuth will be enabled in Milestone 7. You can Copy or Download your README.md right now!");
              }}
              className="h-9 w-full mt-1 bg-[#171815] hover:bg-[#31322E] text-[#C5F467] font-semibold text-xs rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <GitCommit className="w-3.5 h-3.5 stroke-[2]" />
              <span>Commit &amp; Push to {login}/{login}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
