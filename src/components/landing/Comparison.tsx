"use client";

import { useRef } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

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

      if (tableRef.current) {
        gsap.fromTo(
          tableRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const comparisons = [
    {
      feature: "Data Grounding",
      generic: "Guesses your skills, invents fake projects, and makes up work history",
      hellomd: "Queries official GitHub GraphQL v4 API for verified repos and star counts",
    },
    {
      feature: "Shields.io Badges",
      generic: "Generates broken Markdown links, invalid badge syntax, and outdated URLs",
      hellomd: "Deterministically constructs standardized, live SVG badges that never break",
    },
    {
      feature: "Languages & Stats",
      generic: "Estimated or assumed language percentages with no real telemetry",
      hellomd: "Exact byte-level language calculations parsed directly from your public repos",
    },
    {
      feature: "Editor & Preview",
      generic: "Raw plain text output; manual copy-pasting required to test formatting",
      hellomd: "CodeMirror 6 studio with synchronized GitHub-flavored markdown preview",
    },
    {
      feature: "Publish Workflow",
      generic: "Manual repo navigation, creating file manually, manual git commit",
      hellomd: "1-Click direct commit to your profile repo with automatic diff preview",
    },
  ];

  return (
    <section
      id="comparison"
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
            Architecture Difference
          </span>
          <span className="text-[#3A3D33]">|</span>
          <span className="font-mono text-xs text-accent font-semibold">
            Real vs Generic
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0D0E0C]">
          Why developers choose Hello-md over generic LLMs
        </h2>
        <p className="text-base sm:text-lg text-[#262822] leading-relaxed">
          Prompting ChatGPT to write your README results in hallucinated repositories and broken badge links. Hello-md is built specifically for GitHub profile synthesis.
        </p>
      </div>

      {/* Comparison Table / Grid */}
      <div
        ref={tableRef}
        className="w-full bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-[#0D0E0C] text-white p-4 sm:p-5 border-b border-[#262822] items-center">
          <div className="md:col-span-4 font-mono text-xs uppercase tracking-wider font-semibold text-[#A5A89D]">
            Capabilities
          </div>
          <div className="hidden md:block md:col-span-4 font-mono text-xs uppercase tracking-wider font-semibold text-white/60">
            Generic ChatGPT / Copilot
          </div>
          <div className="hidden md:block md:col-span-4 font-mono text-xs uppercase tracking-wider font-bold text-accent">
            Hello-md Precision Engine
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y divide-[#0D0E0C]/10">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 md:gap-4 items-center hover:bg-[#FAFAF8] transition-colors"
            >
              {/* Feature Title */}
              <div className="md:col-span-4 font-bold text-sm text-[#0D0E0C]">
                {item.feature}
              </div>

              {/* Generic LLM */}
              <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-[#31332C]">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FiX className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{item.generic}</span>
              </div>

              {/* Hello-md Engine */}
              <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-[#0D0E0C] font-medium">
                <div className="w-5 h-5 rounded-full bg-accent/30 text-[#0D0E0C] flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck className="w-3.5 h-3.5 text-[#0D0E0C] stroke-[3]" />
                </div>
                <span>{item.hellomd}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
