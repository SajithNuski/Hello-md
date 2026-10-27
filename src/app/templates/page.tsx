"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { THEMES, ThemeId } from "@/lib/assemble/themes";
import { PRESET_TEMPLATES, PresetTemplate } from "@/lib/templates/presetTemplates";
import {
  FiLayout,
  FiArrowRight,
  FiCode,
  FiSearch,
  FiX,
  FiEye,
  FiCopy,
  FiCheck,
  FiLayers,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ROLE_FILTERS = [
  { id: "all", label: "All Roles" },
  { id: "fullstack", label: "Fullstack" },
  { id: "ai", label: "AI & ML" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "opensource", label: "Open Source" },
  { id: "designer", label: "Frontend & UI" },
  { id: "backend", label: "Backend Systems" },
  { id: "security", label: "Cybersecurity" },
];

const STYLE_FILTERS = [
  { id: "all", label: "All Layouts" },
  { id: "wave", label: "Wave Banner" },
  { id: "terminal", label: "Retro Terminal" },
  { id: "minimal", label: "Minimal Monospace" },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PresetTemplate[]>(PRESET_TEMPLATES);
  const [activeRole, setActiveRole] = useState<string>("all");
  const [activeStyle, setActiveStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<PresetTemplate | null>(null);
  const [previewTab, setPreviewTab] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch templates from API with automatic fallback
  useEffect(() => {
    let mounted = true;
    async function loadTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.templates && data.templates.length > 0) {
            setTemplates(data.templates);
          }
        }
      } catch {
        // Fallback to PRESET_TEMPLATES
      }
    }
    loadTemplates();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      // Role filter
      if (activeRole !== "all" && t.persona !== activeRole) {
        return false;
      }

      // Style filter based on theme header style
      if (activeStyle !== "all") {
        const themeDef = THEMES[t.theme as ThemeId];
        if (themeDef && themeDef.header !== activeStyle) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = t.name.toLowerCase().includes(query);
        const roleMatch = (t.role || "").toLowerCase().includes(query);
        const tagMatch = (t.tags || []).some((tag) => tag.toLowerCase().includes(query));
        if (!nameMatch && !roleMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [templates, activeRole, activeStyle, searchQuery]);

  // Copy raw markdown to clipboard
  const handleCopyMarkdown = (markdown: string) => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewTemplate(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0E0C] text-[#FAFAF8] flex flex-col justify-between selection:bg-accent selection:text-[#0D0E0C]">
      <Header />

      <main className="w-full pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#21231D]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent bg-[#161C10] px-2.5 py-0.5 rounded border border-[#2D3A1F] flex items-center gap-1.5 font-semibold">
                <FiLayout className="w-3.5 h-3.5" aria-hidden="true" />
                Templates Gallery
              </span>
              <span className="font-mono text-xs text-[#8E9285]">
                {filteredTemplates.length} curated {filteredTemplates.length === 1 ? "layout" : "layouts"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              GitHub Profile README Templates
            </h1>
            <p className="text-xs sm:text-sm text-[#95988D] max-w-2xl leading-relaxed">
              Production-ready templates with dynamic wave banners, terminal aesthetics, and minimal monospace layouts. Fully grounded in verified GitHub metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#generator"
              className="h-10 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Generate Custom README</span>
              <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Filter Toolbar: Role Tabs, Header Style Pills, & Search Bar */}
        <div className="flex flex-col gap-3.5 p-4 bg-[#141611] border border-[#23261D] rounded-lg shadow-xs">
          {/* Top Row: Search and Style Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7E72]" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by role or tech (e.g. React, Python, Rust)..."
                aria-label="Search templates by role or tech"
                className="h-9 w-full pl-9 pr-8 bg-[#0D0E0C] border border-[#272B20] rounded-md font-mono text-xs text-[#FAFAF8] placeholder-[#65695D] focus:outline-none focus:border-accent shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7E72] hover:text-white"
                  aria-label="Clear search query"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Layout Style Segmented Pills */}
            <div className="flex items-center gap-1 bg-[#0D0E0C] p-1 rounded-md border border-[#25281E]" role="tablist" aria-label="Layout Styles">
              {STYLE_FILTERS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStyle === style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeStyle === style.id
                      ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D]"
                      : "text-[#888C80] hover:text-white"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F2218]" role="tablist" aria-label="Role Filters">
            <span className="text-[11px] font-mono text-[#787B70] mr-1 hidden sm:inline">Roles:</span>
            {ROLE_FILTERS.map((role) => (
              <button
                key={role.id}
                type="button"
                role="tab"
                aria-selected={activeRole === role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeRole === role.id
                    ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D] shadow-xs"
                    : "text-[#888C80] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3 bg-[#141611] rounded-lg border border-[#23261D]">
            <FiSearch className="w-8 h-8 text-[#5E6255]" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-white">No templates match your filters</h3>
              <p className="text-xs text-[#8E9285] max-w-sm">
                Try resetting your search query or choosing another role filter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveRole("all");
                setActiveStyle("all");
                setSearchQuery("");
              }}
              className="mt-2 h-8 px-3 bg-[#1C2017] hover:bg-[#252B1E] border border-[#2E3524] text-accent text-xs font-medium rounded-md transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const themeDef = THEMES[template.theme as ThemeId] || THEMES.violet;
              return (
                <div
                  key={template.slug}
                  className="bg-[#141611] border border-[#23261D] rounded-lg p-5 flex flex-col justify-between gap-5 transition-all hover:border-[#3E4333] shadow-xs group"
                >
                  <div className="space-y-3.5">
                    {/* Card Header: Color Indicator, Name & Style Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: template.accentColor }}
                            aria-hidden="true"
                          />
                          <h3 className="font-semibold text-sm text-white group-hover:text-accent transition-colors leading-tight">
                            {template.name}
                          </h3>
                        </div>
                        <span className="block font-mono text-[11px] text-[#A5A89D]">
                          {template.role}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E9285] bg-[#1A1D15] px-2 py-0.5 rounded border border-[#2B2F23] shrink-0">
                        {themeDef.header}
                      </span>
                    </div>

                    <p className="text-xs text-[#888C80] line-clamp-2 leading-relaxed">
                      {template.tagline}
                    </p>

                    {/* Visual Simulation Preview Box */}
                    <div
                      onClick={() => setPreviewTemplate(template)}
                      className="w-full h-36 bg-[#0D0E0C] rounded-lg border border-[#22251B] p-3 flex flex-col justify-between overflow-hidden relative font-mono text-[11px] cursor-pointer group-hover:border-[#353A2C] transition-colors"
                      title="Click to preview full template"
                    >
                      {themeDef.header === "wave" && (
                        <div className="space-y-2">
                          <div
                            className="w-full h-7 rounded-md opacity-90 flex items-center px-2.5 text-[10px] text-white font-sans font-bold shadow-xs truncate"
                            style={{
                              background: `linear-gradient(90deg, #${themeDef.from}, #${themeDef.to})`,
                            }}
                          >
                            Hi, I&apos;m {template.role}
                          </div>
                          <div className="text-[10px] text-[#A5A89D] truncate">
                            &gt; Building distributed systems and scalable applications
                          </div>
                          <div className="flex gap-1.5 pt-1">
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] text-white font-mono"
                              style={{
                                backgroundColor: `${template.accentColor}33`,
                                border: `1px solid ${template.accentColor}66`,
                              }}
                            >
                              Followers: 1.2k
                            </span>
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] text-white font-mono"
                              style={{
                                backgroundColor: `${template.accentColor}33`,
                                border: `1px solid ${template.accentColor}66`,
                              }}
                            >
                              Views: 14.8k
                            </span>
                          </div>
                        </div>
                      )}

                      {themeDef.header === "terminal" && (
                        <div className="space-y-1.5 text-accent font-mono text-[10px]">
                          <div className="text-[#656A5B]">$ whoami</div>
                          <div className="text-white font-bold">&gt; {template.role.toLowerCase().replace(/\s+/g, "_")}</div>
                          <div className="text-[#9EAA96] truncate">&gt; Terminal Green • Deterministic algorithms only</div>
                          <div className="flex gap-1 pt-1">
                            <span className="text-accent bg-[#152210] px-1 rounded border border-[#253A18] text-[9px]">
                              system_active
                            </span>
                            <span className="text-accent bg-[#152210] px-1 rounded border border-[#253A18] text-[9px]">
                              rust
                            </span>
                          </div>
                        </div>
                      )}

                      {themeDef.header === "minimal" && (
                        <div className="space-y-2 font-mono text-[10px]">
                          <div className="text-white font-bold text-xs truncate"># {template.role}</div>
                          <div className="text-[#8E9285] line-clamp-2 text-[10px] leading-relaxed">
                            Focused on clean algorithms, performance, and deterministic systems.
                          </div>
                          <div className="text-[9px] text-[#55584E]">
                            [Minimal Monospace • Shields.io]
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#1C1F16] flex items-center justify-between text-[10px] text-[#727568]">
                        <span className="truncate">Font: {themeDef.font.replace(/\+/g, " ")}</span>
                        <span className="font-mono">{template.accentColor}</span>
                      </div>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {template.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A5A89D] bg-[#191C14] border border-[#282C20]"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 5 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#6E7264] bg-[#141611]">
                          +{template.tags.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-[#1E2218] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(template)}
                      className="h-8 px-2.5 bg-[#171A13] hover:bg-[#20241A] text-[#B0B4A7] hover:text-white border border-[#272B20] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview</span>
                    </button>

                    <Link
                      href={`/?theme=${template.theme}&persona=${template.persona}#generator`}
                      className="h-8 px-3 bg-[#1C2017] hover:bg-[#272D1E] text-accent hover:text-white font-medium text-xs rounded-md border border-[#2E3424] transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Use template</span>
                      <FiArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feature Banner */}
        <div className="p-6 rounded-lg bg-[#141611] border border-[#25281E] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <FiCode className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>Deterministic code templates</span>
            </h3>
            <p className="text-xs text-[#8E9285] max-w-xl leading-relaxed">
              Templates do not rely on fragile AI markdown formatting. Every wave banner, badge layout, and multi-column project grid is strictly built in code.
            </p>
          </div>

          <Link
            href="/#generator"
            className="h-10 px-5 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Open generator</span>
            <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </main>

      {/* Modal: Template Detailed Preview & Code Inspection */}
      {previewTemplate && (
        <div
          onClick={() => setPreviewTemplate(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#12140F] w-full max-w-[760px] rounded-lg border border-[#2C3024] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="h-14 px-6 flex items-center justify-between border-b border-[#24271D] bg-[#0E100C] shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: previewTemplate.accentColor }}
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-white">{previewTemplate.name}</span>
                  <span className="text-[11px] font-mono text-[#8E9285]">{previewTemplate.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tab Switcher: Rendered vs Raw */}
                <div className="flex items-center bg-[#171A13] p-0.5 rounded-md border border-[#2A2E22]">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("rendered")}
                    className={`h-7 px-3 rounded text-xs font-mono transition-colors ${
                      previewTab === "rendered"
                        ? "bg-[#252A1E] text-accent font-semibold"
                        : "text-[#8E9285] hover:text-white"
                    }`}
                  >
                    Rendered
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("raw")}
                    className={`h-7 px-3 rounded text-xs font-mono transition-colors ${
                      previewTab === "raw"
                        ? "bg-[#252A1E] text-accent font-semibold"
                        : "text-[#8E9285] hover:text-white"
                    }`}
                  >
                    Raw Markdown
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 text-[#8E9285] hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto thin-scrollbar flex-1">
              {/* Section Order Pill Flow */}
              <div className="flex flex-col gap-1.5 p-3 rounded-md bg-[#0D0E0C] border border-[#22251B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#737769] flex items-center gap-1.5">
                  <FiLayers className="w-3 h-3 text-accent" />
                  <span>Section Assembly Order</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {previewTemplate.sectionOrder.map((section, idx) => (
                    <span
                      key={section}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A8AB9F] bg-[#161812] border border-[#2A2E22]"
                    >
                      {idx + 1}. {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview Content */}
              {previewTab === "rendered" ? (
                <div className="p-5 rounded-lg bg-[#0A0B09] border border-[#22251B] text-xs font-sans leading-relaxed text-[#D2D4CB] markdown-body select-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {previewTemplate.previewMarkdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-[#0A0B09] border border-[#22251B] text-[11px] font-mono text-[#D2D4CB] leading-relaxed whitespace-pre-wrap overflow-x-auto select-text thin-scrollbar max-h-96">
                    {previewTemplate.previewMarkdown}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="h-14 px-6 border-t border-[#24271D] bg-[#0E100C] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleCopyMarkdown(previewTemplate.previewMarkdown)}
                className="h-9 px-3.5 bg-[#171A13] hover:bg-[#20241A] text-[#D0D3C7] border border-[#2A2E22] text-xs font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-3.5 h-3.5 text-status-success stroke-[2.5]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <Link
                href={`/?theme=${previewTemplate.theme}&persona=${previewTemplate.persona}#generator`}
                className="h-9 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Use this template</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
