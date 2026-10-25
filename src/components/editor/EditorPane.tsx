"use client";

import { useState } from "react";
import { SectionKey, Tone } from "@/lib/config";
import { SectionItem } from "@/lib/db/collections";
import { MarkdownEditor } from "./MarkdownEditor";
import { IntroConfig } from "@/lib/introConfig";
import { IntroSectionControls } from "./IntroSectionControls";
import { AboutConfig } from "@/lib/aboutConfig";
import { AboutSectionControls } from "./AboutSectionControls";
import { TechStackConfig } from "@/lib/techStackConfig";
import { TechStackSectionControls } from "./TechStackSectionControls";
import { StatsConfig } from "@/lib/statsConfig";
import { StatsSectionControls } from "./StatsSectionControls";
import { SocialConfig } from "@/lib/socialConfig";
import { ConnectSectionControls } from "./ConnectSectionControls";
import { ProjectsSectionControls, ProjectCardItem } from "./ProjectsSectionControls";
import {
  FiSliders,
  FiCode,
  FiRotateCcw,
  FiRotateCw,
  FiRefreshCw,
  FiAlertTriangle,
  FiX,
  FiUser,
  FiInfo,
  FiCpu,
  FiFolder,
  FiBarChart2,
  FiShare2,
} from "react-icons/fi";

interface EditorPaneProps {
  currentSection: SectionItem;
  markdown: string;
  onMarkdownChange: (newMd: string) => void;
  // Visual form configs & handlers
  introConfig: IntroConfig;
  onIntroConfigChange: (updated: IntroConfig) => void;
  aboutConfig: AboutConfig;
  onAboutConfigChange: (updated: AboutConfig) => void;
  techStackConfig: TechStackConfig;
  onTechStackConfigChange: (updated: TechStackConfig) => void;
  statsConfig: StatsConfig;
  onStatsConfigChange: (updated: StatsConfig) => void;
  socialConfig: SocialConfig;
  onSocialConfigChange: (updated: SocialConfig) => void;
  projectsList: ProjectCardItem[];
  onProjectsListChange: (updated: ProjectCardItem[]) => void;
  // History & Actions
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onResetSection: () => void;
  onRegenerateSection: (key: SectionKey, tone: Tone) => Promise<void>;
  isRegenerating: boolean;
  currentTone: Tone;
  username: string;
}

const SECTION_LABELS: Record<SectionKey, string> = {
  intro: "Intro & Bio",
  about: "About Me",
  skills: "Tech Stack & Badges",
  projects: "Featured Projects",
  stats: "GitHub Analytics",
  contact: "Connect & Socials",
};

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  intro: FiUser,
  about: FiInfo,
  skills: FiCpu,
  projects: FiFolder,
  stats: FiBarChart2,
  contact: FiShare2,
};

export function EditorPane({
  currentSection,
  markdown,
  onMarkdownChange,
  introConfig,
  onIntroConfigChange,
  aboutConfig,
  onAboutConfigChange,
  techStackConfig,
  onTechStackConfigChange,
  statsConfig,
  onStatsConfigChange,
  socialConfig,
  onSocialConfigChange,
  projectsList,
  onProjectsListChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onResetSection,
  onRegenerateSection,
  isRegenerating,
  currentTone,
  username,
}: EditorPaneProps) {
  // Mode per section: "form" (visual controls) vs "markdown" (raw editor)
  const [editorMode, setEditorMode] = useState<"form" | "markdown">("form");
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sectionKey = currentSection.key as SectionKey;
  const label = SECTION_LABELS[sectionKey] || currentSection.key;
  const SectionIcon = SECTION_ICONS[sectionKey] || FiFolder;

  const handleRegenerateClick = () => {
    // Rule: User edits are never overwritten by regenerate. Ask before replacing.
    if (currentSection.source === "user") {
      setShowRegenConfirm(true);
    } else {
      onRegenerateSection(sectionKey, currentTone);
    }
  };

  const handleConfirmRegenerate = async () => {
    setShowRegenConfirm(false);
    await onRegenerateSection(sectionKey, currentTone);
  };

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    onResetSection();
  };

  return (
    <div className="flex-1 min-w-0 bg-[#FFFFFF] border-r border-[#E2E3DC] flex flex-col h-full overflow-hidden select-none">
      {/* Sticky Top Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-[#E2E3DC] bg-[#FAFAF8] shrink-0 z-10 gap-3">
        {/* Left: Section Title & Form/Markdown Segmented Control */}
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <SectionIcon className="w-3.5 h-3.5 text-[#52534C]" />
            <span className="font-semibold text-xs text-[#171815] truncate">
              {label}
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-[#E2E3DC] shrink-0"></div>

          {/* Form / Markdown Segmented Control */}
          <div className="flex items-center bg-[#EAEBE5] border border-[#DEDFD8] rounded-md p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode("form")}
              className={`h-6 px-2.5 rounded text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                editorMode === "form"
                  ? "bg-[#FFFFFF] text-[#171815] shadow-xs font-semibold"
                  : "text-[#65665F] hover:text-[#171815]"
              }`}
              title="Visual Form Controls"
            >
              <FiSliders className="w-3 h-3" />
              <span>Form</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("markdown")}
              className={`h-6 px-2.5 rounded text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                editorMode === "markdown"
                  ? "bg-[#FFFFFF] text-[#171815] shadow-xs font-semibold"
                  : "text-[#65665F] hover:text-[#171815]"
              }`}
              title="Raw Markdown Editor"
            >
              <FiCode className="w-3 h-3" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Right: Undo, Redo, Reset to Default, Regenerate */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Undo */}
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="w-7 h-7 rounded flex items-center justify-center text-[#65665F] hover:text-[#171815] hover:bg-[#F0F1EA] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Redo */}
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="w-7 h-7 rounded flex items-center justify-center text-[#65665F] hover:text-[#171815] hover:bg-[#F0F1EA] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <FiRotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-[1px] bg-[#E2E3DC] mx-1"></div>

          {/* Reset section to default */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="h-7 px-2 rounded flex items-center gap-1 text-[11px] font-medium text-[#65665F] hover:text-[#171815] hover:bg-[#F0F1EA] border border-[#E2E3DC] transition-colors cursor-pointer"
            title="Reset this section to its default structure"
          >
            <FiRefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Regenerate Section */}
          <button
            type="button"
            disabled={isRegenerating}
            onClick={handleRegenerateClick}
            className="h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-medium bg-[#FFFFFF] hover:bg-[#F0F1EA] text-[#171815] border border-[#DEDFD8] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Regenerate this section"
          >
            <FiRotateCw
              className={`w-3 h-3 text-[#171815] ${
                isRegenerating ? "animate-spin" : ""
              }`}
            />
            <span className="hidden md:inline">
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Single Scroll Container */}
      <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col bg-[#FAFAF8]">
        {editorMode === "form" ? (
          <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto flex flex-col gap-4">
            {/* Visual Form Controls based on Section Key */}
            {sectionKey === "intro" && (
              <IntroSectionControls
                config={introConfig}
                onChange={onIntroConfigChange}
                defaultUsername={username}
              />
            )}

            {sectionKey === "about" && (
              <AboutSectionControls
                config={aboutConfig}
                onChange={onAboutConfigChange}
              />
            )}

            {sectionKey === "skills" && (
              <TechStackSectionControls
                config={techStackConfig}
                onChange={onTechStackConfigChange}
              />
            )}

            {sectionKey === "projects" && (
              <ProjectsSectionControls
                projects={projectsList}
                onChange={onProjectsListChange}
                username={username}
              />
            )}

            {sectionKey === "stats" && (
              <StatsSectionControls
                config={statsConfig}
                onChange={onStatsConfigChange}
                username={username}
              />
            )}

            {sectionKey === "contact" && (
              <ConnectSectionControls
                config={socialConfig}
                onChange={onSocialConfigChange}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <MarkdownEditor
              value={markdown}
              onChange={onMarkdownChange}
              sectionTitle={label}
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog: Regenerate Overwrites Custom Edits */}
      {showRegenConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E3DC] rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-[#B45309]">
                <FiAlertTriangle className="w-5 h-5 shrink-0" />
                <h4 className="font-semibold text-base text-[#171815]">Replace custom edits?</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRegenConfirm(false)}
                className="text-[#91928A] hover:text-[#171815] p-1 rounded-md"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#52534C] leading-relaxed">
              You made custom changes to <strong>{label}</strong>. Regenerating this section with AI will replace your edits with freshly generated text.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRegenConfirm(false)}
                className="h-9 px-4 rounded-lg border border-[#DEDFD8] text-sm font-medium text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRegenerate}
                className="h-9 px-4 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-sm font-semibold text-white transition-colors cursor-pointer shadow-xs"
              >
                Regenerate & Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Reset to Default */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E3DC] rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-[#171815]">
                <FiRefreshCw className="w-5 h-5 text-accent shrink-0" />
                <h4 className="font-semibold text-base text-[#171815]">Reset {label}?</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="text-[#91928A] hover:text-[#171815] p-1 rounded-md"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Are you sure you want to reset <strong>{label}</strong> to its default configuration?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="h-9 px-4 rounded-lg border border-[#DEDFD8] text-sm font-medium text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="h-9 px-4 rounded-lg bg-[#171815] hover:bg-[#31322E] text-sm font-semibold text-[#FAFAF8] transition-colors cursor-pointer shadow-xs"
              >
                Reset Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
