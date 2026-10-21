"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { THEMES, ThemeId, PERSONA_PRESETS } from "@/lib/assemble/themes";
import { FiLayout, FiArrowRight, FiCode } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

export default function TemplatesPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>("violet");
  const [activePersonaFilter, setActivePersonaFilter] = useState<string>("all");

  const themeList = Object.entries(THEMES) as [ThemeId, (typeof THEMES)[ThemeId]][];

  const filteredThemes = activePersonaFilter === "all"
    ? themeList
    : themeList.filter(([id]) => {
        const preset = PERSONA_PRESETS[activePersonaFilter];
        return preset ? preset.theme === id : true;
      });

  return (
    <div className="min-h-screen bg-[#0D0E0C] text-[#FAFAF8] flex flex-col justify-between selection:bg-accent selection:text-[#0D0E0C]">
      <Header />

      <main className="w-full pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#21231D]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent bg-[#161C10] px-2.5 py-0.5 rounded border border-[#2D3A1F] flex items-center gap-1.5 font-semibold">
                <FiLayout className="w-3.5 h-3.5" />
                Visual Themes &amp; Styles
              </span>
              <span className="font-mono text-xs text-[#8E9285]">
                {themeList.length} Precision Layouts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Profile README Templates
            </h1>
            <p className="text-xs sm:text-sm text-[#95988D] max-w-2xl">
              Choose from dynamic wave headers, retro hacker terminal aesthetics, or ultra-clean minimal monospace styles.
            </p>
          </div>

          <Link
            href="/#generator"
            className="h-10 px-4 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <LuSparkles className="w-4 h-4" />
            <span>Generate README</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Persona Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#141611] border border-[#23261D] rounded-lg">
          <span className="text-xs font-mono text-[#787B70] px-2 hidden sm:inline">Role Filter:</span>
          {[
            { id: "all", label: "All Themes" },
            { id: "fullstack", label: "Fullstack" },
            { id: "devops", label: "DevOps & Cloud" },
            { id: "ai", label: "AI & ML" },
            { id: "opensource", label: "Open Source" },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActivePersonaFilter(filter.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                activePersonaFilter === filter.id
                  ? "bg-[#23271D] text-accent font-semibold border border-[#3A402D] shadow-xs"
                  : "text-[#888C80] hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map(([id, theme]) => {
            const isSelected = selectedThemeId === id;
            return (
              <div
                key={id}
                onClick={() => setSelectedThemeId(id)}
                className={`bg-[#141611] border rounded-xl p-5 flex flex-col justify-between gap-5 transition-all cursor-pointer group hover:border-[#3D4233] ${
                  isSelected
                    ? "border-accent shadow-[0_0_20px_rgba(197,244,103,0.15)] ring-1 ring-accent"
                    : "border-[#23261D]"
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: `#${theme.accent}` }}
                      />
                      <span className="font-semibold text-sm text-white group-hover:text-accent transition-colors">
                        {theme.label}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E9285] bg-[#1A1D15] px-2 py-0.5 rounded border border-[#2B2F23]">
                      {theme.header} Header
                    </span>
                  </div>

                  {/* Visual Simulation Preview Box */}
                  <div className="w-full h-36 bg-[#0D0E0C] rounded-lg border border-[#22251B] p-3 flex flex-col justify-between overflow-hidden relative font-mono text-[11px]">
                    {theme.header === "wave" && (
                      <div className="space-y-2">
                        <div
                          className="w-full h-6 rounded-md opacity-85 flex items-center px-2 text-[10px] text-white font-sans font-bold"
                          style={{
                            background: `linear-gradient(90deg, #${theme.from}, #${theme.to})`,
                          }}
                        >
                          Hi, I&apos;m Developer 👋
                        </div>
                        <div className="text-[10px] text-[#A5A89D]">
                          &gt; Full-stack developer building modern web apps
                        </div>
                        <div className="flex gap-1.5 pt-1">
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] text-white"
                            style={{ backgroundColor: `#${theme.accent}33`, borderColor: `#${theme.accent}66` }}
                          >
                            Followers: 1.2k
                          </span>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] text-white"
                            style={{ backgroundColor: `#${theme.accent}33`, borderColor: `#${theme.accent}66` }}
                          >
                            Views: 8.4k
                          </span>
                        </div>
                      </div>
                    )}

                    {theme.header === "terminal" && (
                      <div className="space-y-1.5 text-accent font-mono text-[10px]">
                        <div className="text-[#656A5B]">$ whoami</div>
                        <div className="text-white font-bold">&gt; developer.dev</div>
                        <div className="text-[#9EAA96]">&gt; Terminal Green • JetBrains Mono</div>
                        <div className="flex gap-1 pt-1">
                          <span className="text-accent bg-[#152210] px-1 rounded border border-[#253A18]">
                            bash
                          </span>
                          <span className="text-accent bg-[#152210] px-1 rounded border border-[#253A18]">
                            linux
                          </span>
                        </div>
                      </div>
                    )}

                    {theme.header === "minimal" && (
                      <div className="space-y-2 font-mono text-[10px]">
                        <div className="text-white font-bold text-xs"># Developer</div>
                        <div className="text-[#8E9285]">
                          Focused on clean algorithms, performance, and deterministic systems.
                        </div>
                        <div className="text-[9px] text-[#55584E]">
                          [Minimal Monospace • Shields.io]
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#1C1F16] flex items-center justify-between text-[10px] text-[#727568]">
                      <span>Font: {theme.font.replace(/\+/g, " ")}</span>
                      <span>#{theme.accent}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-[#1E2218] flex items-center justify-between">
                  <span className="text-xs text-[#8E9285] font-mono">
                    {isSelected ? "Active Selection" : "Click to select"}
                  </span>

                  <Link
                    href={`/?theme=${id}#generator`}
                    className="h-8 px-3 bg-[#1C2017] hover:bg-[#272D1E] text-accent hover:text-white font-medium text-xs rounded-md border border-[#2E3424] transition-colors flex items-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <FiArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Banner */}
        <div className="p-6 rounded-xl bg-[#141611] border border-[#25281E] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <FiCode className="w-4 h-4 text-accent" />
              <span>100% Code-Assembled &amp; Deterministic</span>
            </h3>
            <p className="text-xs text-[#8E9285] max-w-xl">
              Templates do not rely on fragile AI markdown formatting. Every wave banner, badge layout, and 2-column project grid is strictly built in code.
            </p>
          </div>

          <Link
            href="/#generator"
            className="h-10 px-5 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold text-xs rounded-md transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <LuSparkles className="w-4 h-4" />
            <span>Launch Generator</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
