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

interface IntroSectionControlsProps {
  config: IntroConfig;
  onChange: (updated: IntroConfig) => void;
  defaultUsername?: string;
}

export function IntroSectionControls({
  config,
  onChange,
  defaultUsername = "",
}: IntroSectionControlsProps) {
  void defaultUsername;
  const [colorInput, setColorInput] = useState<string>(config.animationColor || "A78BFA");

  const update = (partial: Partial<IntroConfig>) => {
    onChange({ ...config, ...partial });
  };

  // Profile photo handlers
  const handlePhotoToggle = () => {
    update({ photoEnabled: !config.photoEnabled });
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
      animationLines: [...config.animationLines, "Full Stack Developer ✨"],
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
    <div className="flex flex-col gap-4 p-5 bg-[#FFFFFF] border border-[#E2E3DC] rounded-lg text-sm text-[#171815]">
      {/* ---------------- 1. PROFILE PHOTO ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3">
        {/* Toggle Switch */}
        <div
          onClick={handlePhotoToggle}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-[#171815]" />
            <span className="font-semibold text-sm text-[#171815]">Profile Avatar Photo</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.photoEnabled}
            className={`w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.photoEnabled ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
            }`}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs"></div>
          </button>
        </div>

        {/* Enabled Fields */}
        {config.photoEnabled && (
          <div className="pt-3 border-t border-[#E2E3DC] flex flex-col gap-3 animate-in fade-in duration-150">
            {/* Size Slider & Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-[#171815]">
                  Avatar Size: {config.photoSize}px
                </label>
                <span className="text-[#52534C]">Square dimensions</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="60"
                  max="260"
                  step="5"
                  value={config.photoSize}
                  onChange={(e) => handlePhotoSizeChange(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[#171815] h-2 bg-[#E2E3DC] rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="60"
                  max="260"
                  value={config.photoSize}
                  onChange={(e) => handlePhotoSizeChange(parseInt(e.target.value, 10) || 150)}
                  className="w-16 h-9 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-center text-xs font-mono text-[#171815] focus:outline-none focus:border-[#171815]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 2. MAIN TITLE ANIMATION ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3.5">
        {/* Toggle Switch */}
        <div
          onClick={handleAnimationToggle}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <FiPlay className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm text-[#171815]">Typing Title Animation (SVG)</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.animationEnabled}
            className={`w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.animationEnabled ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
            }`}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs"></div>
          </button>
        </div>

        {/* Enabled Fields */}
        {config.animationEnabled && (
          <div className="pt-3 border-t border-[#E2E3DC] flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Lines Editor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#171815]">
                  Typing Phrases ({config.animationLines.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="h-8 px-3 rounded-md bg-[#F0F1EA] hover:bg-[#E2E3DC] text-xs font-medium text-[#171815] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Phrase</span>
                </button>
              </div>

              {/* Line items list */}
              <div className="flex flex-col gap-2">
                {config.animationLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg p-2"
                  >
                    <span className="font-mono text-xs text-[#91928A] w-5 text-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => handleLineChange(idx, e.target.value)}
                      placeholder="Enter typing text line..."
                      className="flex-1 bg-transparent text-sm text-[#171815] focus:outline-none min-w-0"
                    />

                    {/* Reorder & Delete Actions */}
                    <div className="flex items-center gap-1 shrink-0 text-[#52534C]">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1 hover:text-[#171815] disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <FiArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.animationLines.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1 hover:text-[#171815] disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <FiArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={config.animationLines.length <= 1}
                        onClick={() => handleRemoveLine(idx)}
                        className="p-1 hover:text-[#DC2626] disabled:opacity-30 cursor-pointer"
                        title="Delete Line"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E2E3DC]">
              {/* Font Select */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#171815]">
                  Font Family
                </label>
                <select
                  value={config.animationFont}
                  onChange={(e) => update({ animationFont: e.target.value })}
                  className="h-10 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 text-sm text-[#171815] focus:outline-none focus:border-[#171815] cursor-pointer"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#171815]">
                  Font Weight
                </label>
                <select
                  value={config.animationWeight}
                  onChange={(e) => update({ animationWeight: parseInt(e.target.value, 10) })}
                  className="h-10 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 text-sm text-[#171815] focus:outline-none focus:border-[#171815] cursor-pointer"
                >
                  {AVAILABLE_WEIGHTS.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#171815]">
                  Font Size (px)
                </label>
                <input
                  type="number"
                  min="12"
                  max="48"
                  value={config.animationSize}
                  onChange={(e) => update({ animationSize: parseInt(e.target.value, 10) || 22 })}
                  className="h-10 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 text-sm text-[#171815] focus:outline-none focus:border-[#171815]"
                />
              </div>

              {/* Pause (ms) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#171815]">
                  Pause Duration (ms)
                </label>
                <input
                  type="number"
                  min="300"
                  max="5000"
                  step="100"
                  value={config.animationPause}
                  onChange={(e) => update({ animationPause: parseInt(e.target.value, 10) || 1000 })}
                  className="h-10 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 text-sm text-[#171815] focus:outline-none focus:border-[#171815]"
                />
              </div>

              {/* Width */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#171815]">
                  SVG Canvas Width
                </label>
                <input
                  type="number"
                  min="200"
                  max="1000"
                  step="20"
                  value={config.animationWidth}
                  onChange={(e) => update({ animationWidth: parseInt(e.target.value, 10) || 600 })}
                  className="h-10 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 text-sm text-[#171815] focus:outline-none focus:border-[#171815]"
                />
              </div>
            </div>

            {/* Color Option */}
            <div className="flex flex-col gap-1.5 pt-3 border-t border-[#E2E3DC]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#171815]">
                  Typing Text Accent Color
                </label>
                <span className="font-mono text-xs text-[#52534C] bg-[#F0F1EA] px-2 py-0.5 rounded border border-[#E2E3DC]">
                  #{activeColorHex}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* HTML Color Picker */}
                <div className="relative w-10 h-10 rounded-lg border border-[#DEDFD8] overflow-hidden cursor-pointer shrink-0">
                  <input
                    type="color"
                    value={`#${activeColorHex}`}
                    onChange={(e) => handleColorPickerChange(e.target.value)}
                    className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0"
                    title="Choose typing color"
                  />
                </div>

                {/* Hex Text Input */}
                <div className="flex-1 flex items-center bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 h-10 focus-within:border-[#171815]">
                  <span className="text-[#91928A] font-mono mr-1.5">#</span>
                  <input
                    type="text"
                    maxLength={7}
                    value={colorInput}
                    onChange={(e) => handleColorTextChange(e.target.value)}
                    placeholder="A78BFA"
                    className="bg-transparent w-full text-sm font-mono uppercase text-[#171815] focus:outline-none"
                  />
                  {isValidHex(colorInput) && (
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />
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
