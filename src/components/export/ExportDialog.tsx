"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  FiX,
  FiCopy,
  FiDownload,
  FiCheck,
  FiGitCommit,
  FiAlertCircle,
  FiExternalLink,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import { SiGithub } from "react-icons/si";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  login: string;
  readmeId?: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  markdown,
  login,
  readmeId,
}: ExportDialogProps) {
  const { data: session, status } = useSession();

  const [copied, setCopied] = useState(false);
  const [commitMessage, setCommitMessage] = useState(
    "docs: update GitHub profile README.md via Hello-md"
  );

  // Publishing flow states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [diffConfirmation, setDiffConfirmation] = useState<{
    diff: string;
    sha?: string;
  } | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<{
    commitUrl: string;
    contentUrl: string;
  } | null>(null);

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

  const handlePublish = async (confirmOverwrite = false) => {
    setIsPublishing(true);
    setPublishError(null);

    const targetDraftId = readmeId || "default";

    try {
      const res = await fetch(`/api/readmes/${targetDraftId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commitMessage,
          confirmOverwrite,
          markdown,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.error?.code === "NEEDS_CONFIRMATION") {
        setDiffConfirmation({
          diff: data.error.diff,
          sha: data.error.sha,
        });
        setIsPublishing(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to commit README to GitHub");
      }

      setDiffConfirmation(null);
      setPublishSuccess({
        commitUrl: data.commitUrl || "",
        contentUrl: data.contentUrl || "",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during publishing";
      setPublishError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetModal = () => {
    setPublishError(null);
    setDiffConfirmation(null);
    setPublishSuccess(null);
    setIsPublishing(false);
    onClose();
  };

  const sessionUserLogin = session?.user?.login || session?.user?.name || login || "username";
  const targetRepoName = `${sessionUserLogin}/${sessionUserLogin}`;

  return (
    <div
      onClick={handleResetModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-raised w-full max-w-[620px] rounded-lg border border-border shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="h-12 px-6 flex items-center justify-between border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-nav text-text-primary">Export profile README</span>
            <span className="font-mono text-eyebrow text-text-secondary bg-surface-raised px-1.5 py-0.5 rounded-sm border border-border">
              @{sessionUserLogin}
            </span>
          </div>
          <button
            onClick={handleResetModal}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-raised transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto thin-scrollbar">
          {/* SUCCESS STATE */}
          {publishSuccess ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success shrink-0">
                <FiCheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base text-text-primary">
                  README committed to GitHub
                </h3>
                <p className="text-xs text-text-secondary max-w-md">
                  Your profile README has been successfully pushed to{" "}
                  <strong className="text-text-primary font-mono">{targetRepoName}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={publishSuccess.contentUrl || `https://github.com/${targetRepoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-text-primary font-medium text-xs rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>View on GitHub</span>
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleResetModal}
                  className="h-9 px-4 bg-surface hover:bg-surface-raised border border-border text-text-primary text-xs font-medium rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : diffConfirmation ? (
            /* DIFF CONFIRMATION STATE */
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#2A1F13] border border-[#48331A] text-xs text-[#FBBF24]">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Existing profile README found</span>
                  <p className="text-[#E0A82E] leading-relaxed">
                    A README already exists in <span className="font-mono">{targetRepoName}</span>.
                    Review the unified diff below before confirming overwrite.
                  </p>
                </div>
              </div>

              {/* Diff Viewer Window */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
                  <span>Unified diff</span>
                  <span>{targetRepoName}/README.md</span>
                </div>

                <div className="max-h-60 overflow-y-auto p-3 bg-[#0D0E0C] border border-[#2B2E24] rounded-md font-mono text-[11px] leading-relaxed text-[#D8D9D2] whitespace-pre-wrap select-text thin-scrollbar">
                  {diffConfirmation.diff.split("\n").map((line, idx) => {
                    const isAdd = line.startsWith("+") && !line.startsWith("+++");
                    const isDel = line.startsWith("-") && !line.startsWith("---");
                    const isHunk = line.startsWith("@@");

                    let colorClass = "text-[#A0A299]";
                    if (isAdd) colorClass = "text-emerald-400 bg-emerald-950/40";
                    if (isDel) colorClass = "text-red-400 bg-red-950/40";
                    if (isHunk) colorClass = "text-cyan-400";

                    return (
                      <div key={idx} className={`px-1 rounded-xs ${colorClass}`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>

              {publishError && (
                <div className="p-3 rounded-md bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{publishError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => setDiffConfirmation(null)}
                  className="h-9 px-4 bg-surface hover:bg-surface-raised border border-border text-text-primary text-xs font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => handlePublish(true)}
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-text-primary font-semibold text-xs rounded-md transition-colors flex items-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isPublishing ? (
                    <>
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      <span>Overwriting...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Confirm &amp; overwrite</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL EXPORT VIEW */
            <>
              {/* Option 1: Quick Actions (Copy & Download) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-14 p-3.5 bg-surface hover:bg-surface-raised border border-border rounded-md transition-colors flex items-center gap-3.5 text-left cursor-pointer shadow-xs"
                >
                  <div className="w-8 h-8 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0 shadow-xs">
                    {copied ? (
                      <FiCheck className="w-4 h-4 text-status-success stroke-[2.5]" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-nav font-medium text-text-primary">
                      {copied ? "Copied" : "Copy markdown"}
                    </span>
                    <span className="text-meta text-text-secondary">To clipboard</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="h-14 p-3.5 bg-surface hover:bg-surface-raised border border-border rounded-md transition-colors flex items-center gap-3.5 text-left cursor-pointer shadow-xs"
                >
                  <div className="w-8 h-8 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0 shadow-xs">
                    <FiDownload className="w-4 h-4 text-text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-nav font-medium text-text-primary">Download file</span>
                    <span className="text-meta text-text-secondary">README.md</span>
                  </div>
                </button>
              </div>

              {/* Option 2: Push to GitHub */}
              <div className="flex flex-col gap-3.5 p-5 bg-surface rounded-lg border border-border shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SiGithub className="w-4 h-4 text-text-primary" />
                    <span className="text-nav font-medium text-text-primary">
                      Push directly to GitHub repository
                    </span>
                  </div>

                  {status === "authenticated" && (
                    <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Connected
                    </span>
                  )}
                </div>

                {/* If Not Authenticated: Sign in prompt */}
                {status === "unauthenticated" ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Authenticate with GitHub to push your generated README directly to{" "}
                      <strong className="text-text-primary font-mono">{targetRepoName}</strong>.
                    </p>

                    <button
                      type="button"
                      onClick={() => signIn("github")}
                      className="h-10 w-full bg-[#171815] hover:bg-[#252723] text-white font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <SiGithub className="w-4 h-4" />
                      <span>Sign in with GitHub</span>
                    </button>
                  </div>
                ) : status === "loading" ? (
                  <div className="flex items-center justify-center py-4 text-xs text-text-muted gap-2">
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Checking GitHub authorization...</span>
                  </div>
                ) : (
                  /* Authenticated Commit Form */
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-eyebrow font-mono text-text-secondary uppercase tracking-[0.04em]">
                        Target repository
                      </label>
                      <div className="h-9 px-3 bg-surface-raised rounded-md border border-border flex items-center font-mono text-meta text-text-primary shadow-xs">
                        {targetRepoName}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-eyebrow font-mono text-text-secondary uppercase tracking-[0.04em]">
                        Commit message
                      </label>
                      <input
                        type="text"
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        placeholder="Commit message..."
                        className="h-9 px-3 bg-surface-raised rounded-md border border-border font-mono text-meta text-text-primary focus:outline-none focus:border-text-primary shadow-xs"
                      />
                    </div>

                    {publishError && (
                      <div className="p-3 rounded-md bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4 shrink-0" />
                        <span>{publishError}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={() => handlePublish(false)}
                      className="h-10 w-full bg-accent hover:bg-accent-hover text-text-primary font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {isPublishing ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          <span>Pushing to GitHub...</span>
                        </>
                      ) : (
                        <>
                          <FiGitCommit className="w-4 h-4 stroke-[2]" />
                          <span>Commit &amp; push to {targetRepoName}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
