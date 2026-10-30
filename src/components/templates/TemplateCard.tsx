"use client";

import { FiEye, FiArrowRight } from "react-icons/fi";
import { PresetTemplate, renderTemplateMarkdown } from "@/lib/templates/templatesConfig";
import { TemplateMarkdownRenderer } from "./TemplateMarkdownRenderer";

interface TemplateCardProps {
  template: PresetTemplate;
  onPreview: (template: PresetTemplate) => void;
  onUseTemplate: (template: PresetTemplate) => void;
}

export function TemplateCard({
  template,
  onPreview,
  onUseTemplate,
}: TemplateCardProps) {
  // Deterministic markdown render from single source of truth
  const markdown = renderTemplateMarkdown(template);

  // At most 4 tags on a single row, remainder in a single "+N" chip
  const maxVisibleTags = 4;
  const visibleTags = template.tags.slice(0, maxVisibleTags);
  const remainingCount = template.tags.length - maxVisibleTags;
  const fullTagsList = template.tags.join(", ");

  return (
    <div className="bg-[#141611] border border-[#23261D] rounded-xl p-5 flex flex-col justify-between h-full transition-all duration-200 hover:border-[#3A4030] shadow-xs group">
      {/* Top Section */}
      <div className="flex flex-col gap-3.5">
        {/* Header: Name, Role & Layout Tag */}
        <div className="flex items-start justify-between gap-2 min-h-[46px]">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: template.accentColor }}
                aria-hidden="true"
              />
              <h3 className="font-semibold text-sm text-white group-hover:text-accent transition-colors leading-tight truncate">
                {template.name}
              </h3>
            </div>
            <span className="block font-mono text-[11px] text-[#A5A89D] truncate">
              {template.role}
            </span>
          </div>

          <span
            className="font-mono text-[10px] uppercase tracking-wider text-[#8E9285] bg-[#1A1D15] px-2 py-0.5 rounded border border-[#2B2F23] shrink-0 font-medium"
            aria-label={`Layout style: ${template.headerStyle}`}
          >
            {template.headerStyle}
          </span>
        </div>

        {/* Description: Clamped to 2 lines with fixed height */}
        <p className="text-xs text-[#888C80] line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {template.tagline}
        </p>

        {/* Thumbnail: Fixed aspect ratio, renders actual markdown, uncluttered */}
        <div
          onClick={() => onPreview(template)}
          className="w-full aspect-[16/10] bg-[#0D1117] rounded-lg border border-[#22251B] p-3 overflow-hidden relative cursor-pointer group-hover:border-[#383E2D] transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPreview(template);
            }
          }}
          aria-label={`Click to preview full README for ${template.name}`}
          title="Click to preview full README template"
        >
          {/* Real Markdown Preview Miniature */}
          <div className="w-full h-full pointer-events-none select-none overflow-hidden">
            <TemplateMarkdownRenderer markdown={markdown} mode="thumbnail" theme="dark" />
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-transparent pointer-events-none" />

          {/* Subtle Hover Overlay Hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-[#141611]/90 text-accent font-mono text-[10px] px-2.5 py-1 rounded-md border border-[#2B3022] shadow-sm flex items-center gap-1.5">
              <FiEye className="w-3 h-3" />
              <span>Inspect README</span>
            </span>
          </div>
        </div>

        {/* Tech Stack Tags: Single Row, strictly never wraps alone */}
        <div
          className="flex items-center flex-nowrap gap-1.5 overflow-hidden w-full pt-0.5"
          title={`Technologies: ${fullTagsList}`}
        >
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A5A89D] bg-[#191C14] border border-[#282C20] truncate shrink max-w-[85px]"
            >
              {tag}
            </span>
          ))}

          {remainingCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8E9285] bg-[#141611] border border-[#25281E] shrink-0 font-medium cursor-help"
              title={`Additional technologies: ${template.tags.slice(maxVisibleTags).join(", ")}`}
            >
              +{remainingCount}
            </span>
          )}
        </div>
      </div>

      {/* Card Actions: Pinned to bottom, identical height & alignment */}
      <div className="mt-4 pt-3.5 border-t border-[#1E2218] flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="h-8 px-3 bg-[#171A13] hover:bg-[#20251A] active:bg-[#12140F] text-[#B0B4A7] hover:text-white border border-[#272B20] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiEye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="h-8 px-3.5 bg-[#1C2017] hover:bg-[#272E1E] active:bg-[#151910] text-accent hover:text-white font-medium text-xs rounded-md border border-[#2E3524] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>Use template</span>
          <FiArrowRight className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
