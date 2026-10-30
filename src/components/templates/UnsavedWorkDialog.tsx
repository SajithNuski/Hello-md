"use client";

import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface UnsavedWorkDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  templateName?: string;
}

export function UnsavedWorkDialog({
  isOpen,
  onConfirm,
  onCancel,
  templateName = "this template",
}: UnsavedWorkDialogProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when opened
    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#141611] border border-[#2D3125] w-full max-w-md rounded-lg p-5 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FiAlertTriangle className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h3 id="unsaved-dialog-title" className="font-semibold text-sm text-white">
                Overwrite Unsaved Work?
              </h3>
              <p className="text-xs text-[#8E9285] mt-0.5">
                Existing draft detected in your browser session.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-[#7A7E72] hover:text-white p-1 rounded transition-colors"
            aria-label="Close dialog"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#A8AB9E] leading-relaxed">
          Loading <strong className="text-white font-medium">{templateName}</strong> will replace your
          current in-progress README draft. Any unsaved edits will be lost.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#22261C]">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-3.5 bg-[#1C2017] hover:bg-[#252B1E] border border-[#2E3524] text-[#A8AB9E] hover:text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="h-8 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
          >
            Continue & Load Template
          </button>
        </div>
      </div>
    </div>
  );
}
