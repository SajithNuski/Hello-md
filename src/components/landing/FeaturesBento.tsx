"use client";

import { useRef } from "react";
import { FiCheck, FiCpu, FiCode, FiLayers, FiShield } from "react-icons/fi";
import { SiTypescript, SiReact, SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function FeaturesBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="w-full flex flex-col gap-10 pt-12 pb-2 border-t border-[#E2E3DC] scroll-mt-20 select-none"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto"
      >
        <span className="text-xs font-mono font-medium text-[#65665F] uppercase tracking-wider">
          Capabilities
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
          Built for accuracy and control
        </h2>
        <p className="text-sm sm:text-base text-[#52534C] leading-relaxed">
          Real metrics from GitHub, multi-model fallback, and deterministic Markdown assembly.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Card 1: Multi-Model AI Router (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 flex flex-col justify-between p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#65665F]">
                MODEL ROUTING
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiCpu className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#171815]">
              Groq Llama 3.3 with Gemini fallback
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed max-w-xl">
              Llama 3.3 70B runs on Groq for high-speed inference. If rate limits or network errors occur, the router fails over automatically to Gemini 1.5 Flash.
            </p>
          </div>

          {/* Router Status Preview */}
          <div className="mt-5 p-3 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#171815]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Primary: Groq Llama 3.3</span>
              <span className="text-[#91928A]">·</span>
              <span className="text-[#52534C]">Sub-2s response</span>
            </div>
            <span className="text-[11px] font-medium text-[#65665F] bg-white px-2 py-0.5 rounded border border-[#E2E3DC]">
              Automatic failover
            </span>
          </div>
        </div>

        {/* Card 2: Grounded Facts */}
        <div className="flex flex-col justify-between p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#65665F]">
                DATA INTEGRITY
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiShield className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#171815]">
              Verified GitHub facts
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Prose generation is constrained to data from the GitHub GraphQL API. Repositories, stars, and contribution metrics are factual and uninvented.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E3DC] flex items-center gap-1.5 text-xs text-[#52534C]">
            <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>100% verified against GitHub</span>
          </div>
        </div>

        {/* Card 3: Deterministic Shields.io Badges */}
        <div className="flex flex-col justify-between p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#65665F]">
                BADGES
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiLayers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#171815]">
              Deterministic badge builder
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Skill and tech stack badges are generated in pure code using safe URL encoding. The AI never writes URLs or image tags directly.
            </p>
          </div>

          {/* Badges Preview */}
          <div className="mt-4 flex flex-wrap gap-1.5 pt-2 select-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E2E3DC] font-mono text-[11px] text-[#171815]">
              <SiTypescript className="w-3 h-3 text-[#3178C6]" />
              <span>TypeScript</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E2E3DC] font-mono text-[11px] text-[#171815]">
              <SiReact className="w-3 h-3 text-[#087EA4]" />
              <span>React</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E2E3DC] font-mono text-[11px] text-[#171815]">
              <SiNextdotjs className="w-3 h-3 text-[#171815]" />
              <span>Next.js</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E2E3DC] font-mono text-[11px] text-[#171815]">
              <SiTailwindcss className="w-3 h-3 text-[#06B6D4]" />
              <span>Tailwind</span>
            </span>
          </div>
        </div>

        {/* Card 4: Live CodeMirror 6 Editor (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 flex flex-col justify-between p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#65665F]">
                WORKSPACE
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiCode className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#171815]">
              In-browser editor with synchronized preview
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed max-w-xl">
              CodeMirror 6 with syntax highlighting, live GitHub Dark/Light rendered preview, section reordering, and autosave to local state.
            </p>
          </div>

          {/* Mini Editor Mockup */}
          <div className="mt-4 p-3 rounded-md bg-[#0D0E0C] border border-[#262822] font-mono text-xs text-white/90 overflow-hidden flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#8E9285] border-b border-[#21231D] pb-1.5 mb-1 text-[11px]">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>README.md</span>
              </span>
              <span className="text-[#8E9285]">Live synchronized</span>
            </div>
            <div className="text-[#A5A89D]">
              <span className="text-accent font-semibold"># Hi, I&apos;m Developer</span>
            </div>
            <div className="text-white/80">
              Software engineer building web applications and developer tools.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
