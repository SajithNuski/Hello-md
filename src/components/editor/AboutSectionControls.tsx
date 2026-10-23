"use client";

import { useState, KeyboardEvent } from "react";
import { AboutConfig, AboutStyle, GIF_PRESETS } from "@/lib/aboutConfig";
import {
  FiUser,
  FiCode,
  FiTarget,
  FiGlobe,
  FiLinkedin,
  FiSmile,
  FiImage,
  FiPlus,
  FiX,
  FiBookOpen,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiCheck,
} from "react-icons/fi";

interface AboutSectionControlsProps {
  config: AboutConfig;
  onChange: (updated: AboutConfig) => void;
}

const STYLES: { id: AboutStyle; label: string; desc: string }[] = [
  { id: "hacker", label: "Hacker", desc: "Console & code symbols" },
  { id: "playful", label: "Playful", desc: "Dynamic badges & emojis" },
  { id: "professional", label: "Professional", desc: "Clean markdown lists" },
  { id: "minimal", label: "Minimal", desc: "Distraction-free text" },
];

export function AboutSectionControls({
  config,
  onChange,
}: AboutSectionControlsProps) {
  const [newStackTag, setNewStackTag] = useState("");
  const [newFocusTag, setNewFocusTag] = useState("");
  const [gifGender, setGifGender] = useState<"male" | "female">(() => {
    if (GIF_PRESETS.female.some((p) => p.url === config.gifUrl)) {
      return "female";
    }
    return "male";
  });

  const update = (partial: Partial<AboutConfig>) => {
    onChange({ ...config, ...partial });
  };

  // Style change handler: updates style, and handles emoji default rule
  const handleStyleChange = (newStyle: AboutStyle) => {
    let nextEmoji = config.emoji;
    if (newStyle === "professional" || newStyle === "minimal") {
      nextEmoji = false;
    } else if (newStyle === "hacker" || newStyle === "playful") {
      nextEmoji = true;
    }
    update({ style: newStyle, emoji: nextEmoji });
  };

  // Stack tag helpers
  const handleAddStackTag = () => {
    const val = newStackTag.trim();
    if (val && !config.stack.includes(val)) {
      update({ stack: [...config.stack, val] });
      setNewStackTag("");
    }
  };

  const handleRemoveStackTag = (tag: string) => {
    update({ stack: config.stack.filter((t) => t !== tag) });
  };

  const handleStackKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddStackTag();
    }
  };

  // Focus tag helpers
  const handleAddFocusTag = () => {
    const val = newFocusTag.trim();
    if (val && !config.focus.includes(val)) {
      update({ focus: [...config.focus, val] });
      setNewFocusTag("");
    }
  };

  const handleRemoveFocusTag = (tag: string) => {
    update({ focus: config.focus.filter((t) => t !== tag) });
  };

  const handleFocusKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFocusTag();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#FFFFFF] border border-[#E2E3DC] rounded-lg text-sm text-[#171815]">
      {/* ---------------- 1. STYLE SELECTOR ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3">
        <div>
          <h4 className="text-sm font-semibold text-[#171815]">
            Profile Presentation Style
          </h4>
          <p className="text-xs text-[#52534C] mt-0.5">
            Choose how your introductory sentences, icons, and bullets are formatted.
          </p>
        </div>

        {/* 4 Segmented options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-[#F0F1EA] border border-[#E2E3DC] rounded-lg">
          {STYLES.map(({ id, label }) => {
            const isSelected = config.style === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleStyleChange(id)}
                className={`h-9 px-3 text-xs font-medium rounded-md transition-all text-center cursor-pointer ${
                  isSelected
                    ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
                    : "text-[#52534C] hover:text-[#171815]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Emoji Toggle */}
        <div
          onClick={() => update({ emoji: !config.emoji })}
          className="flex items-center justify-between cursor-pointer select-none pt-2 border-t border-[#E2E3DC]"
        >
          <div className="flex items-center gap-2 text-sm text-[#171815] font-medium">
            <FiSmile className="w-4 h-4 text-[#52534C]" />
            <span>Enable Emojis in Bullets</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.emoji}
            className={`w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.emoji ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
            }`}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs"></div>
          </button>
        </div>
      </div>

      {/* ---------------- 2. BASIC PROFILE INFO ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-[#E2E3DC] pb-2">
          <FiUser className="w-4 h-4 text-[#171815]" />
          <h4 className="text-sm font-semibold text-[#171815]">Identity &amp; Role</h4>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Full Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Your Name"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Headline / Role
          </label>
          <input
            type="text"
            value={config.role}
            onChange={(e) => update({ role: e.target.value })}
            placeholder="Full Stack Engineer | React & Node.js"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Education
          </label>
          <input
            type="text"
            value={config.education}
            onChange={(e) => update({ education: e.target.value })}
            placeholder="B.Sc. in Computer Science @ University"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>

        {/* Freelance / Credentials */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Freelance / Status Badge
          </label>
          <input
            type="text"
            value={config.freelance}
            onChange={(e) => update({ freelance: e.target.value })}
            placeholder="Open for Freelance & Contract Projects"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>
      </div>

      {/* ---------------- 3. TECH STACK (TAG INPUT) ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#E2E3DC] pb-2">
          <div className="flex items-center gap-2">
            <FiCode className="w-4 h-4 text-[#171815]" />
            <h4 className="text-sm font-semibold text-[#171815]">Highlighted Tech Skills</h4>
          </div>
          <span className="font-mono text-xs text-[#52534C] bg-[#F0F1EA] px-2 py-0.5 rounded border border-[#E2E3DC]">
            {config.stack.length} skills
          </span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto thin-scrollbar p-2.5 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg">
          {config.stack.length === 0 ? (
            <span className="text-xs text-[#91928A] italic">No skills added yet. Type below and press Enter.</span>
          ) : (
            config.stack.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0F1EA] border border-[#DEDFD8] text-xs font-medium text-[#171815] group"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStackTag(item)}
                  className="text-[#91928A] hover:text-[#DC2626] cursor-pointer transition-colors"
                  title={`Remove ${item}`}
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Tag Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newStackTag}
            onChange={(e) => setNewStackTag(e.target.value)}
            onKeyDown={handleStackKeyDown}
            placeholder="Add technology (e.g. Next.js, GraphQL)..."
            className="flex-1 h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
          <button
            type="button"
            onClick={handleAddStackTag}
            className="h-10 px-4 bg-[#171815] hover:bg-[#2A2B27] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Add technology"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ---------------- 4. FOCUS AREAS (TAG INPUT) ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#E2E3DC] pb-2">
          <div className="flex items-center gap-2">
            <FiTarget className="w-4 h-4 text-[#171815]" />
            <h4 className="text-sm font-semibold text-[#171815]">Focus &amp; Specialization Areas</h4>
          </div>
          <span className="font-mono text-xs text-[#52534C] bg-[#F0F1EA] px-2 py-0.5 rounded border border-[#E2E3DC]">
            {config.focus.length} areas
          </span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto thin-scrollbar p-2.5 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg">
          {config.focus.length === 0 ? (
            <span className="text-xs text-[#91928A] italic">No focus areas added yet. Type below and press Enter.</span>
          ) : (
            config.focus.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0F1EA] border border-[#DEDFD8] text-xs font-medium text-[#171815] group"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFocusTag(item)}
                  className="text-[#91928A] hover:text-[#DC2626] cursor-pointer transition-colors"
                  title={`Remove ${item}`}
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Focus Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newFocusTag}
            onChange={(e) => setNewFocusTag(e.target.value)}
            onKeyDown={handleFocusKeyDown}
            placeholder="Add specialization (e.g. Distributed Systems, UI/UX)..."
            className="flex-1 h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
          <button
            type="button"
            onClick={handleAddFocusTag}
            className="h-10 px-4 bg-[#171815] hover:bg-[#2A2B27] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Add focus area"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ---------------- 5. STATUS & LEARNING ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-[#E2E3DC] pb-2">
          <FiBookOpen className="w-4 h-4 text-[#171815]" />
          <h4 className="text-sm font-semibold text-[#171815]">Learning &amp; Availability</h4>
        </div>

        {/* Currently Learning */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Currently Learning
          </label>
          <input
            type="text"
            value={config.currentlyLearning}
            onChange={(e) => update({ currentlyLearning: e.target.value })}
            placeholder="Currently diving deep into Rust and WebAssembly"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>

        {/* Current Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Current Status
          </label>
          <input
            type="text"
            value={config.status}
            onChange={(e) => update({ status: e.target.value })}
            placeholder="Open to full-time and contract opportunities 🎯"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>
      </div>

      {/* ---------------- 6. LINKS & SOCIALS ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-[#E2E3DC] pb-2">
          <FiGlobe className="w-4 h-4 text-[#171815]" />
          <h4 className="text-sm font-semibold text-[#171815]">Primary Profile Links</h4>
        </div>

        {/* Portfolio URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            Portfolio URL
          </label>
          <input
            type="text"
            value={config.portfolio}
            onChange={(e) => update({ portfolio: e.target.value })}
            placeholder="https://your-portfolio.com"
            className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
          />
        </div>

        {/* LinkedIn URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#171815]">
            LinkedIn URL
          </label>
          <div className="flex items-center bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg px-3 h-10 focus-within:border-[#171815] transition-colors">
            <FiLinkedin className="w-4 h-4 text-[#0A66C2] mr-2 shrink-0" />
            <input
              type="text"
              value={config.linkedin}
              onChange={(e) => update({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/your-username"
              className="bg-transparent w-full text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ---------------- 7. OPTIONAL GIF ---------------- */}
      <div className="bg-[#FBFBFA] border border-[#E2E3DC] rounded-lg p-4 flex flex-col gap-3.5">
        {/* GIF Toggle */}
        <div
          onClick={() => update({ gifEnabled: !config.gifEnabled })}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <FiImage className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-semibold text-[#171815]">Side GIF Animation</h4>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.gifEnabled}
            className={`w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.gifEnabled ? "bg-[#171815] justify-end" : "bg-[#DEDFD8] justify-start"
            }`}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs"></div>
          </button>
        </div>

        {/* Enabled GIF Fields */}
        {config.gifEnabled && (
          <div className="pt-3 border-t border-[#E2E3DC] flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Gender Switch Tabs (Male / Female) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171815]">
                Character Persona
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#F0F1EA] border border-[#E2E3DC] rounded-lg">
                <button
                  type="button"
                  onClick={() => setGifGender("male")}
                  className={`h-9 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    gifGender === "male"
                      ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
                      : "text-[#52534C] hover:text-[#171815]"
                  }`}
                >
                  👨 Male (4 GIFs)
                </button>
                <button
                  type="button"
                  onClick={() => setGifGender("female")}
                  className={`h-9 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    gifGender === "female"
                      ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
                      : "text-[#52534C] hover:text-[#171815]"
                  }`}
                >
                  👩 Female (4 GIFs)
                </button>
              </div>
            </div>

            {/* 4 Preset GIF Cards */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#171815]">
                  Select Preset Animation
                </label>
                <span className="font-mono text-xs text-[#52534C]">
                  4 options
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {GIF_PRESETS[gifGender].map((preset) => {
                  const isSelected = config.gifUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => update({ gifUrl: preset.url, gifEnabled: true })}
                      className={`relative rounded-lg border p-1.5 flex flex-col items-center gap-1.5 transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#171815] ring-2 ring-accent bg-[#F0F1EA] shadow-xs"
                          : "border-[#E2E3DC] bg-[#FFFFFF] hover:border-[#171815]"
                      }`}
                    >
                      <div className="w-full h-20 rounded-md overflow-hidden bg-black/10 flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-[#171815] text-accent p-1 rounded-full shadow">
                            <FiCheck className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#171815] truncate w-full text-center">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GIF Placement (Left / Center / Right) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171815]">
                GIF Alignment in README
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#F0F1EA] border border-[#E2E3DC] rounded-lg">
                {(
                  [
                    { id: "left", label: "Left", icon: FiAlignLeft },
                    { id: "center", label: "Center", icon: FiAlignCenter },
                    { id: "right", label: "Right", icon: FiAlignRight },
                  ] as const
                ).map((opt) => {
                  const active = (config.gifPlacement || "right") === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update({ gifPlacement: opt.id })}
                      className={`h-9 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#171815] text-[#FAFAF8] font-semibold shadow-xs"
                          : "text-[#52534C] hover:text-[#171815]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom GIF URL input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171815]">
                Custom GIF Image URL
              </label>
              <input
                type="text"
                value={config.gifUrl}
                onChange={(e) => update({ gifUrl: e.target.value })}
                placeholder="https://media.giphy.com/.../giphy.gif"
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
              />
            </div>

            {/* Width Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-[#171815]">
                  GIF Width: {config.gifWidth}px
                </label>
                <span className="text-[#52534C] capitalize">
                  align=&quot;{config.gifPlacement || "right"}&quot;
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="120"
                  max="450"
                  step="10"
                  value={config.gifWidth}
                  onChange={(e) => update({ gifWidth: parseInt(e.target.value, 10) || 300 })}
                  className="flex-1 accent-[#171815] h-2 bg-[#E2E3DC] rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="120"
                  max="450"
                  value={config.gifWidth}
                  onChange={(e) => update({ gifWidth: parseInt(e.target.value, 10) || 300 })}
                  className="w-16 h-9 bg-[#FFFFFF] border border-[#DEDFD8] rounded-lg text-center text-xs font-mono text-[#171815] focus:outline-none focus:border-[#171815]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
