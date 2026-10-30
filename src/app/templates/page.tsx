"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import {
  TEMPLATES_CONFIG,
  PresetTemplate,
} from "@/lib/templates/templatesConfig";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { UnsavedWorkDialog } from "@/components/templates/UnsavedWorkDialog";
import {
  FiLayout,
  FiArrowRight,
  FiCode,
  FiSearch,
  FiX,
  FiRotateCcw,
  FiLoader,
} from "react-icons/fi";

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

function TemplatesGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial filter values from URL query string
  const initialRole = searchParams.get("role") || "all";
  const initialLayout = searchParams.get("layout") || searchParams.get("style") || "all";
  const initialSearch = searchParams.get("q") || searchParams.get("search") || "";

  const [activeRole, setActiveRole] = useState<string>(initialRole);
  const [activeStyle, setActiveStyle] = useState<string>(initialLayout);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Modal states
  const [previewTemplate, setPreviewTemplate] = useState<PresetTemplate | null>(null);
  const [pendingTemplateToUse, setPendingTemplateToUse] = useState<PresetTemplate | null>(null);
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState<boolean>(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState<boolean>(false);

  // Sync state to URL search parameters for refresh and back-navigation persistence
  const updateUrlParams = useCallback(
    (role: string, layout: string, query: string) => {
      const params = new URLSearchParams();
      if (role !== "all") params.set("role", role);
      if (layout !== "all") params.set("layout", layout);
      if (query.trim()) params.set("q", query.trim());

      const qs = params.toString();
      const newPath = qs ? `/templates?${qs}` : "/templates";
      window.history.replaceState(null, "", newPath);
    },
    []
  );

  const handleRoleChange = (roleId: string) => {
    setActiveRole(roleId);
    updateUrlParams(roleId, activeStyle, searchQuery);
  };

  const handleStyleChange = (styleId: string) => {
    setActiveStyle(styleId);
    updateUrlParams(activeRole, styleId, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrlParams(activeRole, activeStyle, query);
  };

  const handleResetFilters = () => {
    setActiveRole("all");
    setActiveStyle("all");
    setSearchQuery("");
    updateUrlParams("all", "all", "");
  };

  const isAnyFilterActive =
    activeRole !== "all" || activeStyle !== "all" || searchQuery.trim().length > 0;

  // Strict AND filtering logic across role, layout, and search query
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_CONFIG.filter((t) => {
      // 1. Role filter
      if (activeRole !== "all" && t.persona.toLowerCase() !== activeRole.toLowerCase()) {
        return false;
      }

      // 2. Layout style filter
      if (activeStyle !== "all" && t.headerStyle !== activeStyle) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const nameMatch = t.name.toLowerCase().includes(q);
        const roleMatch = (t.role || "").toLowerCase().includes(q);
        const taglineMatch = (t.tagline || "").toLowerCase().includes(q);
        const tagMatch = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!nameMatch && !roleMatch && !taglineMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activeRole, activeStyle, searchQuery]);

  // Execute loading the template into the editor
  const executeUseTemplate = async (template: PresetTemplate) => {
    try {
      setIsApplyingTemplate(true);
      const res = await fetch("/api/templates/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: template.slug }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize template draft");
      }

      const data = await res.json();
      if (data.redirectUrl) {
        // Clear unsaved work flags since a fresh draft is being initialized
        if (typeof window !== "undefined") {
          localStorage.removeItem("hellomd_unsaved_work");
          localStorage.setItem("hellomd_active_draft_id", data.readmeId);
        }
        router.push(data.redirectUrl);
      }
    } catch {
      // Fallback: route to generator with pre-filled theme and persona
      router.push(`/?theme=${template.theme}&persona=${template.persona}&template=${template.slug}#generator`);
    } finally {
      setIsApplyingTemplate(false);
      setPendingTemplateToUse(null);
      setIsUnsavedDialogOpen(false);
      setPreviewTemplate(null);
    }
  };

  // Check for unsaved work before loading template
  const handleUseTemplate = (template: PresetTemplate) => {
    let hasUnsaved = false;
    if (typeof window !== "undefined") {
      const unsavedFlag = localStorage.getItem("hellomd_unsaved_work");
      const activeDraftId = localStorage.getItem("hellomd_active_draft_id");
      if (unsavedFlag === "true" || activeDraftId) {
        hasUnsaved = true;
      }
    }

    if (hasUnsaved) {
      setPendingTemplateToUse(template);
      setIsUnsavedDialogOpen(true);
    } else {
      executeUseTemplate(template);
    }
  };

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
              className="h-10 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Generate Custom README</span>
              <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Filter Toolbar: Search, Layout Styles, & Role Filter Pills */}
        <div className="flex flex-col gap-3.5 p-4 bg-[#141611] border border-[#23261D] rounded-xl shadow-xs">
          {/* Top Row: Search input and Layout Style Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7E72]" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search templates by role or tech (e.g. React, Python, Rust)..."
                aria-label="Search templates by role or tech"
                className="h-9 w-full pl-9 pr-8 bg-[#0D0E0C] border border-[#272B20] rounded-md font-mono text-xs text-[#FAFAF8] placeholder-[#65695D] focus:outline-none focus:border-accent shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7E72] hover:text-white cursor-pointer"
                  aria-label="Clear search query"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Layout Style Segmented Pills & Clear Button */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 bg-[#0D0E0C] p-1 rounded-md border border-[#25281E]"
                role="tablist"
                aria-label="Layout Styles"
              >
                {STYLE_FILTERS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    role="tab"
                    aria-selected={activeStyle === style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      activeStyle === style.id
                        ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D]"
                        : "text-[#888C80] hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-8 px-2.5 bg-[#1C2017] hover:bg-[#252B1E] border border-[#2D3323] text-accent hover:text-white text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Clear all filters"
                >
                  <FiRotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Role Filter Pills */}
          <div
            className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F2218]"
            role="tablist"
            aria-label="Role Filters"
          >
            <span className="text-[11px] font-mono text-[#787B70] mr-1 hidden sm:inline">Roles:</span>
            {ROLE_FILTERS.map((role) => (
              <button
                key={role.id}
                type="button"
                role="tab"
                aria-selected={activeRole === role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
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

        {/* Templates Grid or Empty State */}
        {filteredTemplates.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-[#141611] rounded-xl border border-[#23261D]">
            <div className="p-3 rounded-full bg-[#1A1D15] border border-[#2B2F23]">
              <FiSearch className="w-6 h-6 text-[#727668]" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">No templates match your filters</h3>
              <p className="text-xs text-[#8E9285] max-w-sm">
                Try searching with different keywords, selecting another role, or resetting filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-1 h-9 px-4 bg-[#1C2017] hover:bg-[#252B1E] border border-[#2E3524] text-accent text-xs font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        ) : (
          /* Consistent Grid: 3 columns desktop, 2 columns tablet, 1 column mobile with equal gaps */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.slug}
                template={template}
                onPreview={(t) => setPreviewTemplate(t)}
                onUseTemplate={(t) => handleUseTemplate(t)}
              />
            ))}
          </div>
        )}

        {/* Feature Banner */}
        <div className="p-6 rounded-xl bg-[#141611] border border-[#25281E] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
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
            className="h-10 px-5 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shrink-0 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Open generator</span>
            <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </main>

      {/* Template Detailed Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(t) => handleUseTemplate(t)}
      />

      {/* Confirmation Dialog for Unsaved Work */}
      <UnsavedWorkDialog
        isOpen={isUnsavedDialogOpen}
        templateName={pendingTemplateToUse?.name}
        onConfirm={() => {
          if (pendingTemplateToUse) {
            executeUseTemplate(pendingTemplateToUse);
          }
        }}
        onCancel={() => {
          setIsUnsavedDialogOpen(false);
          setPendingTemplateToUse(null);
        }}
      />

      {/* Global Loading Overlay while creating draft */}
      {isApplyingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs select-none">
          <div className="bg-[#141611] border border-[#2D3125] p-5 rounded-lg flex items-center gap-3 shadow-xl">
            <FiLoader className="w-5 h-5 text-accent animate-spin" />
            <span className="text-xs font-mono text-white">Initializing editable template draft...</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0E0C] text-[#FAFAF8] flex items-center justify-center">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8E9285]">
            <FiLoader className="w-4 h-4 animate-spin text-accent" />
            <span>Loading Templates Gallery...</span>
          </div>
        </div>
      }
    >
      <TemplatesGalleryContent />
    </Suspense>
  );
}
