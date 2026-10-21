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
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
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
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
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
      className="w-full flex flex-col gap-12 pt-14 pb-4 border-t border-border/80 scroll-mt-24 select-none"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0E0C] border border-[#2B2E24] shadow-xs">
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
            Core Capabilities
          </span>
          <span className="text-[#3A3D33]">|</span>
          <span className="font-mono text-xs text-accent font-semibold">
            Precision Tooling
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0D0E0C]">
          Engineered for developer precision
        </h2>
        <p className="text-base sm:text-lg text-[#262822] leading-relaxed">
          Every component is designed to extract real metrics, prevent AI hallucination, and produce clean, ready-to-commit Markdown.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Card 1: Multi-Model AI Router (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 flex flex-col justify-between p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm hover:border-[#0D0E0C]/40 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                INTELLIGENT ROUTER
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FiCpu className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              Groq Llama 3.3 70B &amp; Gemini 2.0 Fallback
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822] max-w-xl">
              High-throughput Llama 3.3 70B processes your profile in under 1.5 seconds via Groq LPUs. If rate limits or network latency occur, the system automatically falls back to Gemini 2.0 Flash without interruption.
            </p>
          </div>

          {/* Interactive Router Status Preview */}
          <div className="mt-6 p-3.5 rounded-lg bg-[#0D0E0C] border border-[#262822] flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="font-semibold text-white">Primary: Groq Llama 3.3</span>
              <span className="text-[#55584D]">·</span>
              <span className="text-accent">&lt;1.5s latency</span>
            </div>
            <span className="bg-[#1C1F16] border border-[#2E3324] text-accent px-2 py-0.5 rounded text-[11px]">
              AUTO-FAILOVER READY
            </span>
          </div>
        </div>

        {/* Card 2: Zero Hallucination Guarantee */}
        <div className="flex flex-col justify-between p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm hover:border-[#0D0E0C]/40 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                ACCURACY
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FiShield className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              Zero AI Hallucinations
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822]">
              Unlike ChatGPT, Hello-md feeds strict GraphQL API facts into the model. The AI is strictly constrained to summarize your real projects with zero fabricated experience.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0D0E0C]/10 flex items-center gap-2 text-xs font-mono font-semibold text-[#0D0E0C]">
            <FiCheck className="w-4 h-4 text-accent stroke-[3]" />
            <span>100% Fact-Checked Against GitHub</span>
          </div>
        </div>

        {/* Card 3: Deterministic Shields.io Badges */}
        <div className="flex flex-col justify-between p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm hover:border-[#0D0E0C]/40 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                VISUAL BADGES
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FiLayers className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              Deterministic Badges
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822]">
              Badges and statistics are never generated by AI. They are deterministically constructed using standardized Shields.io syntax that never breaks or expires.
            </p>
          </div>

          {/* Badges Display Preview */}
          <div className="mt-4 flex flex-wrap gap-1.5 pt-2 select-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D0E0C] text-white font-mono text-[11px]">
              <SiTypescript className="w-3 h-3 text-[#3178C6]" />
              <span>TypeScript</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D0E0C] text-white font-mono text-[11px]">
              <SiReact className="w-3 h-3 text-[#61DAFB]" />
              <span>React</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D0E0C] text-white font-mono text-[11px]">
              <SiNextdotjs className="w-3 h-3 text-white" />
              <span>Next.js</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D0E0C] text-white font-mono text-[11px]">
              <SiTailwindcss className="w-3 h-3 text-[#38BDF8]" />
              <span>Tailwind</span>
            </span>
          </div>
        </div>

        {/* Card 4: Live CodeMirror 6 Editor (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 flex flex-col justify-between p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm hover:border-[#0D0E0C]/40 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                STUDIO WORKSPACE
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FiCode className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              CodeMirror 6 In-Browser Editor with Live Preview
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822] max-w-xl">
              Edit the generated markdown in real-time with synchronized split view, syntax highlighting, section reordering, and individual section regeneration without losing your manual changes.
            </p>
          </div>

          {/* Mini Editor Mockup */}
          <div className="mt-5 p-3 rounded-lg bg-[#0D0E0C] border border-[#262822] font-mono text-xs text-white/90 overflow-hidden flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#787B70] border-b border-[#21231D] pb-1.5 mb-1 text-[11px]">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span>profile.md</span>
              </span>
              <span className="text-accent">SYNCHRONIZED PREVIEW</span>
            </div>
            <div className="text-[#A5A89D]">
              <span className="text-accent font-bold"># Hi, I&apos;m Developer 👋</span>
            </div>
            <div className="text-white/80">
              Passionate software engineer building resilient, high-throughput systems.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
