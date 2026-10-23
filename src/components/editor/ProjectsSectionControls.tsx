"use client";

import { useState } from "react";
import { FiFolder, FiPlus, FiTrash2, FiExternalLink, FiList } from "react-icons/fi";

export interface ProjectCardItem {
  repo: string;
  pitch: string;
  highlights: string[];
}

export interface ProjectsSectionControlsProps {
  projects: ProjectCardItem[];
  onChange: (projects: ProjectCardItem[]) => void;
  username?: string;
}

export function ProjectsSectionControls({
  projects,
  onChange,
  username = "",
}: ProjectsSectionControlsProps) {
  const [activeHighlightInputs, setActiveHighlightInputs] = useState<Record<number, string>>({});

  const handleUpdateProject = (index: number, partial: Partial<ProjectCardItem>) => {
    const next = projects.map((p, i) => (i === index ? { ...p, ...partial } : p));
    onChange(next);
  };

  const handleAddProject = () => {
    if (projects.length >= 4) return;
    onChange([
      ...projects,
      {
        repo: `new-project-${projects.length + 1}`,
        pitch: "A modern developer tool built with TypeScript and React.",
        highlights: ["High performance architecture", "Clean user interface"],
      },
    ]);
  };

  const handleRemoveProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleAddHighlight = (index: number) => {
    const text = (activeHighlightInputs[index] || "").trim();
    if (!text) return;
    const project = projects[index];
    if (!project || project.highlights.length >= 4) return;
    handleUpdateProject(index, {
      highlights: [...project.highlights, text],
    });
    setActiveHighlightInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveHighlight = (projectIndex: number, highlightIndex: number) => {
    const project = projects[projectIndex];
    if (!project) return;
    handleUpdateProject(projectIndex, {
      highlights: project.highlights.filter((_, i) => i !== highlightIndex),
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-[#FFFFFF] rounded-lg border border-[#E2E3DC] text-sm text-[#171815]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E3DC]">
        <div>
          <h3 className="text-base font-semibold text-[#171815] flex items-center gap-2">
            <FiFolder className="w-4 h-4 text-accent" />
            Featured Projects
          </h3>
          <p className="text-xs text-[#52534C] mt-0.5">
            Showcase up to 4 featured repositories displayed as GitHub pin cards with pitches.
          </p>
        </div>
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#F0F1EA] text-[#52534C] border border-[#E2E3DC]">
          {projects.length} of 4 projects
        </span>
      </div>

      {/* Project Cards List */}
      <div className="flex flex-col gap-4">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-[#FBFBFA] border border-[#E2E3DC] flex flex-col gap-3.5 transition-all"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#171815] text-[#FAFAF8] text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-semibold text-sm text-[#171815]">Project Card</span>
              </div>
              <div className="flex items-center gap-2">
                {username && project.repo && (
                  <a
                    href={`https://github.com/${username}/${project.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#52534C] hover:text-[#171815] flex items-center gap-1 hover:underline"
                  >
                    <span>View repo</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveProject(idx)}
                  className="p-1 text-[#52534C] hover:text-[#DC2626] transition-colors rounded hover:bg-[#FEE2E2] cursor-pointer"
                  title="Remove project"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Repo Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#171815]">Repository Name</label>
              <input
                type="text"
                value={project.repo}
                onChange={(e) => handleUpdateProject(idx, { repo: e.target.value })}
                placeholder="repository-name"
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#DEDFD8] text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors"
              />
            </div>

            {/* Pitch Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#171815]">Project Pitch & Description</label>
              <textarea
                value={project.pitch}
                onChange={(e) => handleUpdateProject(idx, { pitch: e.target.value })}
                rows={2}
                placeholder="Brief pitch highlighting what this project does and key tech used..."
                className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#DEDFD8] text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Highlights List */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#52534C] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FiList className="w-3 h-3" />
                  Key Highlights ({project.highlights?.length || 0}/4)
                </span>
                <span className="text-[11px] text-[#91928A]">Bullets shown under the card</span>
              </label>

              {project.highlights && project.highlights.length > 0 && (
                <div className="flex flex-col gap-1.5 mb-1">
                  {project.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E2E3DC] text-xs text-[#171815]"
                    >
                      <span className="truncate flex-1">• {h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx, hIdx)}
                        className="text-[#91928A] hover:text-[#DC2626] p-0.5 cursor-pointer transition-colors"
                        title="Remove highlight"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!project.highlights || project.highlights.length < 4) && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activeHighlightInputs[idx] || ""}
                    onChange={(e) =>
                      setActiveHighlightInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlight(idx);
                      }
                    }}
                    placeholder="Add bullet highlight..."
                    className="flex-1 h-9 px-3 rounded-md bg-[#FFFFFF] border border-[#DEDFD8] text-xs text-[#171815] placeholder:text-[#91928A] focus:outline-none focus:border-[#171815]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(idx)}
                    className="h-9 px-3 rounded-md bg-[#F0F1EA] hover:bg-[#E2E3DC] text-xs font-medium text-[#171815] transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      {projects.length < 4 && (
        <button
          type="button"
          onClick={handleAddProject}
          className="h-10 px-4 rounded-lg border border-dashed border-[#DEDFD8] hover:border-[#171815] bg-[#FBFBFA] hover:bg-[#F0F1EA] text-sm font-medium text-[#171815] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Project Card ({projects.length}/4)</span>
        </button>
      )}
    </div>
  );
}
