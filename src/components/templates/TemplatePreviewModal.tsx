"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiLayers,
  FiFileText,
  FiEye,
  FiSliders,
} from "react-icons/fi";
import { PresetTemplate, renderTemplateMarkdown } from "@/lib/templates/templatesConfig";
import { TemplateMarkdownRenderer } from "./TemplateMarkdownRenderer";

interface TemplatePreviewModalProps {
  template: PresetTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: PresetTemplate) => void;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"rendered" | "raw">("rendered");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Lock body scroll and set up keyboard focus trap
  useEffect(() => {
    if (!template) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the modal container
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap logic
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [template, onClose]);

  if (!template) return null;

  // Single source of truth markdown
  const markdown = renderTemplateMarkdown(template);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = previewTheme === "dark";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 select-none animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#12140F] w-full max-w-4xl rounded-xl border border-[#2D3124] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] focus:outline-none"
      >
        {/* Top Header */}
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#22261C] bg-[#0E100C] shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: template.accentColor }}
              aria-hidden="true"
            />
            <div className="flex flex-col min-w-0">
              <h2 id="template-preview-title" className="font-semibold text-sm sm:text-base text-white truncate">
                {template.name}
              </h2>
              <span className="text-[11px] font-mono text-[#8E9285] truncate">
                {template.role} • {template.headerStyle.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab Switcher: Rendered vs Raw */}
            <div
              className="flex items-center bg-[#171A13] p-1 rounded-md border border-[#272B20]"
              role="tablist"
              aria-label="Preview Modes"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "rendered"}
                onClick={() => setActiveTab("rendered")}
                className={`h-7 px-2.5 sm:px-3 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "rendered"
                    ? "bg-[#252A1E] text-accent font-semibold shadow-xs"
                    : "text-[#8E9285] hover:text-white"
                }`}
              >
                <FiEye className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "raw"}
                onClick={() => setActiveTab("raw")}
                className={`h-7 px-2.5 sm:px-3 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "raw"
                    ? "bg-[#252A1E] text-accent font-semibold shadow-xs"
                    : "text-[#8E9285] hover:text-white"
                }`}
              >
                <FiFileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Raw Markdown</span>
              </button>
            </div>

            {/* GitHub Light/Dark Toggle */}
            <button
              type="button"
              onClick={() => setPreviewTheme(isDark ? "light" : "dark")}
              className="h-9 px-2.5 sm:px-3 bg-[#171A13] hover:bg-[#20251A] text-[#B0B4A7] hover:text-white border border-[#272B20] text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
              title={`Switch to GitHub ${isDark ? "Light" : "Dark"} mode`}
              aria-label={`Switch to GitHub ${isDark ? "Light" : "Dark"} mode`}
            >
              {isDark ? (
                <>
                  <FiSun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span className="hidden md:inline">GitHub Dark</span>
                </>
              ) : (
                <>
                  <FiMoon className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  <span className="hidden md:inline">GitHub Light</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#8E9285] hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Close modal"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 overflow-y-auto thin-scrollbar flex-1 bg-[#0A0B09]">
          {/* Metadata Bar: Font, Accent Color, Tags & Assembly Order */}
          <div className="p-3.5 rounded-lg bg-[#11130E] border border-[#20241A] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-text">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#A8AB9E]">
                <FiSliders className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span>Font:</span>
                <strong className="text-white font-semibold">
                  {template.font.replace(/\+/g, " ")}
                </strong>
              </span>

              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#A8AB9E]">
                <span>Accent:</span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40"
                  style={{ backgroundColor: template.accentColor }}
                  aria-hidden="true"
                />
                <code className="text-white">{template.accentColor}</code>
              </span>

              <span className="font-mono text-[11px] text-[#8E9285] bg-[#171A13] px-2 py-0.5 rounded border border-[#272B20]">
                {template.badgeStyle}
              </span>
            </div>

            {/* Section Order flow */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-[#6E7264] flex items-center gap-1">
                <FiLayers className="w-3 h-3 text-accent" aria-hidden="true" />
                <span>Order:</span>
              </span>
              {template.sectionOrder.map((section, idx) => (
                <span
                  key={section}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#9EA194] bg-[#161912] border border-[#25291E]"
                >
                  {idx + 1}.{section}
                </span>
              ))}
            </div>
          </div>

          {/* Rendered Preview or Raw Markdown Container */}
          {activeTab === "rendered" ? (
            <div
              className={`w-full rounded-lg border shadow-inner p-4 sm:p-7 transition-colors duration-200 select-text ${
                isDark
                  ? "bg-[#0D1117] border-[#30363D]"
                  : "bg-[#FFFFFF] border-[#D0D7DE]"
              }`}
            >
              <TemplateMarkdownRenderer markdown={markdown} mode="modal" theme={previewTheme} />
            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 sm:p-5 rounded-lg bg-[#0D1117] border border-[#30363D] text-[12px] font-mono text-[#E6EDF3] leading-relaxed whitespace-pre-wrap overflow-x-auto select-text thin-scrollbar max-h-[500px]">
                {markdown}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-16 px-4 sm:px-6 border-t border-[#22261C] bg-[#0E100C] flex items-center justify-between shrink-0 gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-3.5 bg-[#171A13] hover:bg-[#20251A] text-[#D0D3C7] hover:text-white border border-[#282C21] text-xs font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4 text-status-success stroke-[2.5]" aria-hidden="true" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="h-9 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          >
            <span>Use this template</span>
            <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
