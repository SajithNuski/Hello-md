"use client";

import { useState } from "react";
import {
  IntroConfig,
  AVAILABLE_FONTS,
  AVAILABLE_WEIGHTS,
  isValidHex,
  normalizeHex,
} from "@/lib/introConfig";
import {
  FiUser,
  FiPlay,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

interface IntroSectionControlsProps {
  config: IntroConfig;
  onChange: (updated: IntroConfig) => void;
  defaultUsername?: string;
}

export function IntroSectionControls({
  config,
  onChange,
  defaultUsername = "sajithnuski",
}: IntroSectionControlsProps) {
  const [colorInput, setColorInput] = useState<string>(config.animationColor || "A78BFA");

  const update = (partial: Partial<IntroConfig>) => {
    onChange({ ...config, ...partial });
  };

  // Profile photo handlers
  const handlePhotoToggle = () => {
    update({ photoEnabled: !config.photoEnabled });
  };

  const handlePhotoUsernameChange = (val: string) => {
    update({ photoUsername: val.trim() });
  };

  const handlePhotoSizeChange = (size: number) => {
    update({ photoSize: Math.max(40, Math.min(300, size)) });
  };

  // Animation handlers
  const handleAnimationToggle = () => {
    update({ animationEnabled: !config.animationEnabled });
  };

  const handleLineChange = (index: number, val: string) => {
    const nextLines = [...config.animationLines];
    nextLines[index] = val;
    update({ animationLines: nextLines });
  };

  const handleAddLine = () => {
    update({
      animationLines: [...config.animationLines, "New typing statement ✨"],
    });
  };

  const handleRemoveLine = (index: number) => {
    if (config.animationLines.length <= 1) return;
    const nextLines = config.animationLines.filter((_, i) => i !== index);
    update({ animationLines: nextLines });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const nextLines = [...config.animationLines];
    const temp = nextLines[index - 1];
    nextLines[index - 1] = nextLines[index];
    nextLines[index] = temp;
    update({ animationLines: nextLines });
  };

  const handleMoveDown = (index: number) => {
    if (index >= config.animationLines.length - 1) return;
    const nextLines = [...config.animationLines];
    const temp = nextLines[index + 1];
    nextLines[index + 1] = nextLines[index];
    nextLines[index] = temp;
    update({ animationLines: nextLines });
  };

  // Color picker handler
  const handleColorTextChange = (val: string) => {
    setColorInput(val);
    const clean = val.replace(/^#/, "").trim();
    if (isValidHex(clean)) {
      update({ animationColor: normalizeHex(clean) });
    }
  };

  const handleColorPickerChange = (val: string) => {
    const clean = val.replace(/^#/, "").toUpperCase();
    setColorInput(clean);
    update({ animationColor: clean });
  };

  const activeColorHex = normalizeHex(config.animationColor, "A78BFA");

  return (
    <div className="flex flex-col gap-3 py-2 text-text-primary text-xs">
      {/* ---------------- 1. PROFILE PHOTO ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-3 flex flex-col gap-2.5 shadow-xs">
        {/* Toggle Switch */}
        <div
          onClick={handlePhotoToggle}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <FiUser className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary transition-colors" />
            <span className="text-nav">Profile Photo</span>
          </div>
          <div
            className={`w-7 h-4 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.photoEnabled ? "bg-text-primary justify-end" : "bg-border justify-start"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
          </div>
        </div>

        {/* Enabled Fields */}
        {config.photoEnabled && (
          <div className="pt-2 border-t border-border/60 flex flex-col gap-2.5 animate-in fade-in duration-150">
            {/* Username Input */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-eyebrow text-text-secondary uppercase">
                GitHub Username
              </label>
              <div className="flex items-center bg-surface border border-border rounded px-2 py-1 focus-within:border-accent transition-colors">
                <span className="text-text-muted font-mono mr-1">@</span>
                <input
                  type="text"
                  value={config.photoUsername ?? defaultUsername}
                  onChange={(e) => handlePhotoUsernameChange(e.target.value)}
                  placeholder={defaultUsername}
                  className="bg-transparent w-full text-xs font-mono text-text-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Size Slider & Input */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Size: {config.photoSize}px
                </label>
                <span className="font-mono text-[10px] text-text-muted">Square W×H</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="60"
                  max="260"
                  step="5"
                  value={config.photoSize}
                  onChange={(e) => handlePhotoSizeChange(parseInt(e.target.value, 10))}
                  className="flex-1 accent-accent h-1.5 bg-surface rounded cursor-pointer"
                />
                <input
                  type="number"
                  min="60"
                  max="260"
                  value={config.photoSize}
                  onChange={(e) => handlePhotoSizeChange(parseInt(e.target.value, 10) || 150)}
                  className="w-14 bg-surface border border-border rounded px-1.5 py-0.5 text-center font-mono text-xs text-text-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 2. MAIN TITLE ANIMATION ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-3 flex flex-col gap-2.5 shadow-xs">
        {/* Toggle Switch */}
        <div
          onClick={handleAnimationToggle}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <FiPlay className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary transition-colors" />
            <span className="text-nav">Title Animation</span>
          </div>
          <div
            className={`w-7 h-4 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.animationEnabled ? "bg-text-primary justify-end" : "bg-border justify-start"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
          </div>
        </div>

        {/* Enabled Fields */}
        {config.animationEnabled && (
          <div className="pt-2 border-t border-border/60 flex flex-col gap-3 animate-in fade-in duration-150">
            {/* Lines Editor */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Typing Lines ({config.animationLines.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent-hover hover:underline cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" />
                  <span>Add Line</span>
                </button>
              </div>

              {/* Line items list */}
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-0.5">
                {config.animationLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-surface border border-border rounded p-1.5"
                  >
                    <span className="font-mono text-[10px] text-text-muted w-3 text-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => handleLineChange(idx, e.target.value)}
                      placeholder="Enter typing text line..."
                      className="flex-1 bg-transparent text-xs text-text-primary focus:outline-none min-w-0"
                    />

                    {/* Reorder & Delete Actions */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <FiArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.animationLines.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <FiArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={config.animationLines.length <= 1}
                        onClick={() => handleRemoveLine(idx)}
                        className="p-1 text-text-secondary hover:text-status-error disabled:opacity-30 cursor-pointer"
                        title="Delete Line"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Dimensions */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
              {/* Font Select */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Font Family
                </label>
                <select
                  value={config.animationFont}
                  onChange={(e) => update({ animationFont: e.target.value })}
                  className="bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Weight
                </label>
                <select
                  value={config.animationWeight}
                  onChange={(e) => update({ animationWeight: parseInt(e.target.value, 10) })}
                  className="bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_WEIGHTS.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Size (px)
                </label>
                <input
                  type="number"
                  min="12"
                  max="48"
                  value={config.animationSize}
                  onChange={(e) => update({ animationSize: parseInt(e.target.value, 10) || 22 })}
                  className="bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none"
                />
              </div>

              {/* Pause (ms) */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Pause (ms)
                </label>
                <input
                  type="number"
                  min="300"
                  max="5000"
                  step="100"
                  value={config.animationPause}
                  onChange={(e) => update({ animationPause: parseInt(e.target.value, 10) || 1000 })}
                  className="bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none"
                />
              </div>

              {/* Width */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  SVG Width
                </label>
                <input
                  type="number"
                  min="200"
                  max="1000"
                  step="20"
                  value={config.animationWidth}
                  onChange={(e) => update({ animationWidth: parseInt(e.target.value, 10) || 600 })}
                  className="bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Center & vCenter Checkboxes */}
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
                <input
                  type="checkbox"
                  checked={config.animationCenter !== false}
                  onChange={(e) => update({ animationCenter: e.target.checked })}
                  className="accent-accent rounded cursor-pointer"
                />
                <span className="font-mono text-eyebrow uppercase">Center</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
                <input
                  type="checkbox"
                  checked={config.animationVCenter !== false}
                  onChange={(e) => update({ animationVCenter: e.target.checked })}
                  className="accent-accent rounded cursor-pointer"
                />
                <span className="font-mono text-eyebrow uppercase">vCenter</span>
              </label>
            </div>

            {/* ---------------- 3. COLOR OPTION ---------------- */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Typing Text Color
                </label>
                <span className="font-mono text-[10px] text-text-muted">
                  #{activeColorHex}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* HTML Color Picker */}
                <div className="relative w-8 h-8 rounded border border-border overflow-hidden cursor-pointer shrink-0">
                  <input
                    type="color"
                    value={`#${activeColorHex}`}
                    onChange={(e) => handleColorPickerChange(e.target.value)}
                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0"
                    title="Choose typing color"
                  />
                </div>

                {/* Hex Text Input */}
                <div className="flex-1 flex items-center bg-surface border border-border rounded px-2 py-1 focus-within:border-accent">
                  <span className="text-text-muted font-mono mr-1">#</span>
                  <input
                    type="text"
                    maxLength={7}
                    value={colorInput}
                    onChange={(e) => handleColorTextChange(e.target.value)}
                    placeholder="A78BFA"
                    className="bg-transparent w-full text-xs font-mono uppercase text-text-primary focus:outline-none"
                  />
                  {isValidHex(colorInput) && (
                    <FiCheck className="w-3.5 h-3.5 text-status-success shrink-0 ml-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
