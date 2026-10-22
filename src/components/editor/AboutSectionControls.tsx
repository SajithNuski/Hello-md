"use client";

import { useState, KeyboardEvent } from "react";
import { AboutConfig, AboutStyle } from "@/lib/aboutConfig";
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
  FiBriefcase,
  FiBookOpen,
} from "react-icons/fi";

interface AboutSectionControlsProps {
  config: AboutConfig;
  onChange: (updated: AboutConfig) => void;
}

const STYLES: { id: AboutStyle; label: string }[] = [
  { id: "hacker", label: "Hacker" },
  { id: "playful", label: "Playful" },
  { id: "professional", label: "Prof." },
  { id: "minimal", label: "Minimal" },
];

export function AboutSectionControls({
  config,
  onChange,
}: AboutSectionControlsProps) {
  const [newStackTag, setNewStackTag] = useState("");
  const [newFocusTag, setNewFocusTag] = useState("");

  const update = (partial: Partial<AboutConfig>) => {
    onChange({ ...config, ...partial });
  };

  // Style change handler: updates style, and handles emoji default rule
  const handleStyleChange = (newStyle: AboutStyle) => {
    // Rule: Emoji toggle default on; forced off for Professional and Minimal unless the user turns it on
    let nextEmoji = config.emoji;
    if (newStyle === "professional" || newStyle === "minimal") {
      // If moving to professional/minimal and emoji was default on, force off unless manually overridden
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
    <div className="flex flex-col gap-3 py-1 text-text-primary text-xs">
      {/* ---------------- 1. STYLE SELECTOR ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <label className="font-mono text-eyebrow text-text-secondary uppercase">
          Profile Style
        </label>
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-surface border border-border rounded-md">
          {STYLES.map(({ id, label }) => {
            const isSelected = config.style === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleStyleChange(id)}
                className={`py-1 text-[11px] font-mono rounded transition-colors text-center cursor-pointer ${
                  isSelected
                    ? "bg-accent text-[#0D0E0C] font-semibold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
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
          className="flex items-center justify-between cursor-pointer select-none pt-1"
        >
          <div className="flex items-center gap-1.5 text-meta text-text-secondary">
            <FiSmile className="w-3.5 h-3.5" />
            <span>Enable Emojis</span>
          </div>
          <div
            className={`w-7 h-4 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.emoji ? "bg-text-primary justify-end" : "bg-border justify-start"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. BASIC PROFILE INFO ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary border-b border-border/50 pb-1.5">
          <FiUser className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-nav">Identity &amp; Role</span>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Full Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Your Name"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Headline / Role
          </label>
          <input
            type="text"
            value={config.role}
            onChange={(e) => update({ role: e.target.value })}
            placeholder="Your Role | Your Specialty"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Education
          </label>
          <input
            type="text"
            value={config.education}
            onChange={(e) => update({ education: e.target.value })}
            placeholder="Your Degree @ Your University"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Freelance / Credentials */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Freelance / Status Badge
          </label>
          <input
            type="text"
            value={config.freelance}
            onChange={(e) => update({ freelance: e.target.value })}
            placeholder="Your Freelance / Work Status"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* ---------------- 3. TECH STACK (TAG INPUT) ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <FiCode className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-nav">Tech Stack</span>
          </div>
          <span className="font-mono text-meta text-text-muted">
            {config.stack.length}
          </span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
          {config.stack.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[11px] font-mono text-text-primary group"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveStackTag(item)}
                className="text-text-muted hover:text-status-error cursor-pointer"
                title={`Remove ${item}`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Tag Input */}
        <div className="flex items-center gap-1.5 mt-1">
          <input
            type="text"
            value={newStackTag}
            onChange={(e) => setNewStackTag(e.target.value)}
            onKeyDown={handleStackKeyDown}
            placeholder="Add technology (e.g. Next.js)..."
            className="flex-1 bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleAddStackTag}
            className="p-1.5 bg-surface border border-border hover:border-accent rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Add tech"
          >
            <FiPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------------- 4. FOCUS AREAS (TAG INPUT) ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <FiTarget className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-nav">Focus Areas</span>
          </div>
          <span className="font-mono text-meta text-text-muted">
            {config.focus.length}
          </span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto">
          {config.focus.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[11px] font-mono text-text-primary group"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveFocusTag(item)}
                className="text-text-muted hover:text-status-error cursor-pointer"
                title={`Remove ${item}`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Focus Input */}
        <div className="flex items-center gap-1.5 mt-1">
          <input
            type="text"
            value={newFocusTag}
            onChange={(e) => setNewFocusTag(e.target.value)}
            onKeyDown={handleFocusKeyDown}
            placeholder="Add focus (e.g. AI Engineer)..."
            className="flex-1 bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleAddFocusTag}
            className="p-1.5 bg-surface border border-border hover:border-accent rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Add focus"
          >
            <FiPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------------- 5. STATUS & LEARNING ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary border-b border-border/50 pb-1.5">
          <FiBookOpen className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-nav">Learning &amp; Availability</span>
        </div>

        {/* Currently Learning */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Currently Learning
          </label>
          <input
            type="text"
            value={config.currentlyLearning}
            onChange={(e) => update({ currentlyLearning: e.target.value })}
            placeholder="Currently learning Your Skill"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Current Status */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Current Status
          </label>
          <input
            type="text"
            value={config.status}
            onChange={(e) => update({ status: e.target.value })}
            placeholder="Open to opportunities 🎯"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* ---------------- 6. LINKS & SOCIALS ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-medium text-text-primary border-b border-border/50 pb-1.5">
          <FiGlobe className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-nav">Links</span>
        </div>

        {/* Portfolio URL */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Portfolio URL
          </label>
          <input
            type="text"
            value={config.portfolio}
            onChange={(e) => update({ portfolio: e.target.value })}
            placeholder="https://your-portfolio.com"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* LinkedIn URL */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            LinkedIn URL
          </label>
          <div className="flex items-center bg-surface border border-border rounded px-2 py-1 focus-within:border-accent">
            <FiLinkedin className="w-3.5 h-3.5 text-text-muted mr-1.5 shrink-0" />
            <input
              type="text"
              value={config.linkedin}
              onChange={(e) => update({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/your-username"
              className="bg-transparent w-full text-xs text-text-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ---------------- 7. OPTIONAL GIF ---------------- */}
      <div className="bg-surface-raised border border-border rounded-md p-2.5 flex flex-col gap-2 shadow-xs">
        {/* GIF Toggle */}
        <div
          onClick={() => update({ gifEnabled: !config.gifEnabled })}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <FiImage className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary transition-colors" />
            <span className="text-nav">Side GIF Animation</span>
          </div>
          <div
            className={`w-7 h-4 rounded-full p-[2px] transition-colors cursor-pointer shrink-0 flex items-center ${
              config.gifEnabled ? "bg-text-primary justify-end" : "bg-border justify-start"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
          </div>
        </div>

        {/* Enabled GIF Fields */}
        {config.gifEnabled && (
          <div className="pt-2 border-t border-border/60 flex flex-col gap-2 animate-in fade-in duration-150">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-eyebrow text-text-secondary uppercase">
                GIF Image URL
              </label>
              <input
                type="text"
                value={config.gifUrl}
                onChange={(e) => update({ gifUrl: e.target.value })}
                placeholder="https://media.giphy.com/.../giphy.gif"
                className="bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-eyebrow text-text-secondary uppercase">
                  Width: {config.gifWidth}px
                </label>
                <span className="font-mono text-[10px] text-text-muted">align=&quot;right&quot;</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="120"
                  max="450"
                  step="10"
                  value={config.gifWidth}
                  onChange={(e) => update({ gifWidth: parseInt(e.target.value, 10) || 300 })}
                  className="flex-1 accent-accent h-1.5 bg-surface rounded cursor-pointer"
                />
                <input
                  type="number"
                  min="120"
                  max="450"
                  value={config.gifWidth}
                  onChange={(e) => update({ gifWidth: parseInt(e.target.value, 10) || 300 })}
                  className="w-14 bg-surface border border-border rounded px-1.5 py-0.5 text-center font-mono text-xs text-text-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
