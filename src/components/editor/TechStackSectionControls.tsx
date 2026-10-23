"use client";

import { useState, useMemo } from "react";
import {
  TechStackConfig,
  TechCategory,
  TECH_CATEGORIES,
  TECH_CATALOG,
  getTechItem,
} from "@/lib/techStackConfig";
import {
  FiCpu,
  FiSearch,
  FiX,
  FiCheck,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
  FiLayers,
} from "react-icons/fi";

interface TechStackSectionControlsProps {
  config: TechStackConfig;
  onChange: (updated: TechStackConfig) => void;
}

export function TechStackSectionControls({
  config,
  onChange,
}: TechStackSectionControlsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | TechCategory>("All");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const selectedSet = useMemo(() => new Set(config.selected || []), [config.selected]);

  // Filter catalog based on category tab & search query
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TECH_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Toggle selection of an icon
  const handleToggleIcon = (id: string) => {
    const current = config.selected || [];
    if (selectedSet.has(id)) {
      onChange({
        ...config,
        selected: current.filter((item) => item !== id),
      });
    } else {
      onChange({
        ...config,
        selected: [...current, id],
      });
    }
  };

  // Remove single selected item
  const handleRemoveItem = (id: string) => {
    const current = config.selected || [];
    onChange({
      ...config,
      selected: current.filter((item) => item !== id),
    });
  };

  // Clear all selected items
  const handleClearAll = () => {
    onChange({
      ...config,
      selected: [],
    });
  };

  // Move item within selected list (for reordering)
  const handleMoveItem = (index: number, direction: "left" | "right") => {
    const current = [...(config.selected || [])];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const [moved] = current.splice(index, 1);
    current.splice(targetIndex, 0, moved);
    onChange({ ...config, selected: current });
  };

  // Drag and drop reordering handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const current = [...(config.selected || [])];
    const [moved] = current.splice(draggedIndex, 1);
    current.splice(targetIndex, 0, moved);
    setDraggedIndex(null);
    onChange({ ...config, selected: current });
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#FFFFFF] border border-[#E2E3DC] rounded-lg text-sm text-[#171815]">
      {/* Top Header: Title & Output Style Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E3DC]">
        <div>
          <h3 className="text-base font-semibold text-[#171815] flex items-center gap-2">
            <FiCpu className="w-4 h-4 text-accent" />
            Tech Stack & Badges
          </h3>
          <p className="text-xs text-[#52534C] mt-0.5">
            Click icons to add or remove technologies. Reorder chips below.
          </p>
        </div>

        {/* Style Selector: Icons vs Badges (34px segmented control) */}
        <div className="flex items-center bg-[#F0F1EA] border border-[#E2E3DC] rounded-lg p-1 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onChange({ ...config, style: "icons" })}
            className={`h-8 px-3.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              (config.style || "icons") === "icons"
                ? "bg-[#171815] text-[#FAFAF8] shadow-xs font-semibold"
                : "text-[#52534C] hover:text-[#171815]"
            }`}
            title="Skillicons.dev composite icons"
          >
            Icons
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, style: "badges" })}
            className={`h-8 px-3.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              config.style === "badges"
                ? "bg-[#171815] text-[#FAFAF8] shadow-xs font-semibold"
                : "text-[#52534C] hover:text-[#171815]"
            }`}
            title="Shields.io for-the-badge badges"
          >
            Badges
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <FiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#91928A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter technologies by label (e.g. React, Python, Docker)..."
          className="w-full h-10 pl-9 pr-9 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#91928A] hover:text-[#171815] p-1 cursor-pointer"
            title="Clear search"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs (Horizontal Scrollable with 32px hit areas) */}
      <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap thin-scrollbar pb-1">
        {TECH_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`h-8 px-3 rounded-md text-xs font-medium tracking-tight shrink-0 transition-colors cursor-pointer border ${
                isActive
                  ? "bg-[#171815] text-[#FAFAF8] border-[#171815] shadow-xs"
                  : "bg-[#FBFBFA] border-[#E2E3DC] text-[#52534C] hover:text-[#171815] hover:border-[#DEDFD8]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Icon Grid: Fixed max-height: 220px; overflow-y: auto */}
      <div
        className="max-h-[220px] overflow-y-auto thin-scrollbar bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-2.5"
        style={{ maxHeight: "220px" }}
      >
        {filteredCatalog.length === 0 ? (
          <div className="h-[120px] flex flex-col items-center justify-center text-center p-3 text-[#52534C]">
            <FiLayers className="w-6 h-6 mb-1 opacity-40 text-[#91928A]" />
            <span className="text-xs">No technologies found for &ldquo;{searchQuery}&rdquo;</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-1.5 text-xs font-medium text-[#171815] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(46px,1fr))] gap-2 justify-items-center">
            {filteredCatalog.map((item) => {
              const isSelected = selectedSet.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleIcon(item.id)}
                  title={`${item.label} (${item.id}) - Click to toggle`}
                  className={`w-11 h-11 rounded-lg p-1 flex items-center justify-center relative transition-all cursor-pointer border select-none ${
                    isSelected
                      ? "bg-[#171815] border-[#171815] ring-2 ring-accent shadow-xs"
                      : "bg-[#FFFFFF] border-[#E2E3DC] hover:border-[#171815] hover:bg-[#F0F1EA]"
                  }`}
                >
                  {/* Skillicon preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://skillicons.dev/icons?i=${item.id}`}
                    alt={item.label}
                    className="w-7 h-7 pointer-events-none object-contain"
                    loading="lazy"
                  />

                  {/* Selected Check Badge */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[#0D0E0C] flex items-center justify-center shadow-xs">
                      <FiCheck className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Items Row */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E3DC]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#171815]">
              Selected Technologies ({config.selected?.length || 0})
            </span>
            {config.selected?.length > 1 && (
              <span className="text-xs text-[#52534C]">· Drag chips or use arrows to reorder</span>
            )}
          </div>

          {config.selected?.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:opacity-80 transition-opacity cursor-pointer font-medium"
              title="Remove all selected technologies"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Chips Area */}
        {config.selected?.length === 0 ? (
          <div className="p-3 rounded-lg bg-[#FBFBFA] border border-[#E2E3DC] text-xs text-[#52534C] leading-relaxed">
            No items selected. A sample stack (<code>js, react, nodejs, mongodb, git</code>) will be generated in README until you pick technologies.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto thin-scrollbar p-2 bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg">
            {config.selected.map((id, index) => {
              const item = getTechItem(id);
              const label = item ? item.label : id;
              const isFirst = index === 0;
              const isLast = index === config.selected.length - 1;

              return (
                <div
                  key={`${id}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`h-8 flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md border text-xs font-medium transition-all cursor-grab active:cursor-grabbing select-none ${
                    draggedIndex === index
                      ? "opacity-50 border-[#171815] bg-[#EAEBE4]"
                      : "bg-[#FFFFFF] border-[#DEDFD8] text-[#171815] hover:border-[#171815]"
                  }`}
                  title={`${label} - Click X to remove, drag to reorder`}
                >
                  {/* Mini Skill Icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://skillicons.dev/icons?i=${id}`}
                    alt={label}
                    className="w-4 h-4 pointer-events-none object-contain"
                  />
                  <span className="truncate max-w-[100px]">{label}</span>

                  {/* Left / Right micro-arrows for accessible reordering */}
                  <div className="flex items-center -space-x-0.5 ml-0.5 text-[#52534C]">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveItem(index, "left");
                      }}
                      className="p-0.5 hover:text-[#171815] disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move left"
                    >
                      <FiArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveItem(index, "right");
                      }}
                      className="p-0.5 hover:text-[#171815] disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move right"
                    >
                      <FiArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(id);
                    }}
                    className="ml-0.5 text-[#91928A] hover:text-[#DC2626] p-0.5 rounded cursor-pointer transition-colors"
                    title={`Remove ${label}`}
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
