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
    <div className="flex flex-col gap-3 p-3 bg-surface-raised/40 border border-border/80 rounded-md text-xs">
      {/* Top Header: Title & Output Style Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiCpu className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-eyebrow font-semibold uppercase text-text-primary">
            Tech Stack & Badges
          </span>
        </div>

        {/* Style Selector: Icons vs Badges */}
        <div className="flex items-center bg-surface border border-border rounded p-0.5">
          <button
            type="button"
            onClick={() => onChange({ ...config, style: "icons" })}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
              (config.style || "icons") === "icons"
                ? "bg-text-primary text-accent font-semibold shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
            title="Skillicons.dev composite icons"
          >
            Icons
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, style: "badges" })}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
              config.style === "badges"
                ? "bg-text-primary text-accent font-semibold shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
            title="Shields.io for-the-badge badges"
          >
            Badges
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <FiSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter icons by label..."
          className="w-full h-8 pl-8 pr-7 bg-surface border border-border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
            title="Clear search"
          >
            <FiX className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category Tabs (Horizontal Scrollable) */}
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap thin-scrollbar pb-1 -mx-1 px-1">
        {TECH_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-1 rounded text-[10px] font-mono tracking-tight shrink-0 transition-colors cursor-pointer border ${
                isActive
                  ? "bg-text-primary text-accent border-text-primary font-medium shadow-xs"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Icon Grid: Fixed max-height: 220px; overflow-y: auto */}
      <div
        className="max-h-[220px] overflow-y-auto thin-scrollbar bg-surface/40 border border-border/80 rounded p-1.5"
        style={{ maxHeight: "220px" }}
      >
        {filteredCatalog.length === 0 ? (
          <div className="h-[120px] flex flex-col items-center justify-center text-center p-3 text-text-muted">
            <FiLayers className="w-6 h-6 mb-1 opacity-40" />
            <span className="text-[11px]">No technologies found for &ldquo;{searchQuery}&rdquo;</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-1.5 text-[10px] font-mono text-accent hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-1.5 justify-items-center">
            {filteredCatalog.map((item) => {
              const isSelected = selectedSet.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleIcon(item.id)}
                  title={`${item.label} (${item.id}) - Click to toggle`}
                  className={`w-11 h-11 rounded-md p-1 flex items-center justify-center relative transition-all cursor-pointer border select-none ${
                    isSelected
                      ? "bg-accent/15 border-accent ring-1.5 ring-accent shadow-xs"
                      : "bg-surface border-border/80 hover:border-border-hover hover:bg-surface-raised/80"
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
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-[#0D0E0C] flex items-center justify-center shadow-xs">
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
      <div className="flex flex-col gap-1.5 pt-1 border-t border-border/60">
        <div className="flex items-center justify-between text-meta">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-eyebrow text-text-secondary uppercase">
              Selected ({config.selected?.length || 0})
            </span>
            {config.selected?.length > 1 && (
              <span className="text-[10px] text-text-muted">· Drag to reorder</span>
            )}
          </div>

          {config.selected?.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 font-mono text-[10px] text-status-error hover:opacity-80 transition-opacity cursor-pointer"
              title="Remove all selected technologies"
            >
              <FiTrash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Chips Area */}
        {config.selected?.length === 0 ? (
          <div className="p-2 rounded bg-surface/70 border border-border text-[11px] text-text-muted leading-tight">
            No items selected. Sample stack (<code>js, react, nodejs, mongodb, git</code>) will be generated in README.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto thin-scrollbar p-1 bg-surface/30 border border-border/60 rounded">
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
                  className={`flex items-center gap-1 pl-1.5 pr-1 py-0.5 rounded border text-[11px] font-mono transition-all cursor-grab active:cursor-grabbing select-none ${
                    draggedIndex === index
                      ? "opacity-50 border-accent bg-accent/20"
                      : "bg-surface border-border text-text-primary hover:border-border-hover"
                  }`}
                  title={`${label} - Click X to remove, drag to reorder`}
                >
                  {/* Mini Skill Icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://skillicons.dev/icons?i=${id}`}
                    alt={label}
                    className="w-3.5 h-3.5 pointer-events-none object-contain"
                  />
                  <span className="text-[10px] truncate max-w-[80px]">{label}</span>

                  {/* Left / Right micro-arrows for accessible reordering */}
                  <div className="flex items-center -space-x-0.5 ml-0.5 text-text-muted">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveItem(index, "left");
                      }}
                      className="p-0.5 hover:text-text-primary disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move left"
                    >
                      <FiArrowLeft className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveItem(index, "right");
                      }}
                      className="p-0.5 hover:text-text-primary disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move right"
                    >
                      <FiArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(id);
                    }}
                    className="ml-0.5 text-text-muted hover:text-status-error p-0.5 rounded cursor-pointer transition-colors"
                    title={`Remove ${label}`}
                  >
                    <FiX className="w-3 h-3" />
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
