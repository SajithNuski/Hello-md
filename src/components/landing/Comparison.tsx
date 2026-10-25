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
      className="w-full flex flex-col gap-10 pt-12 pb-2 border-t border-[#E2E3DC] scroll-mt-20 select-none"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto"
      >
        <span className="text-xs font-mono font-medium text-[#65665F] uppercase tracking-wider">
          Comparison
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
          Why developers choose Hello-md
        </h2>
        <p className="text-sm sm:text-base text-[#52534C] leading-relaxed">
          Comparing fact-grounded generation against ungrounded chat prompts.
        </p>
      </div>

      {/* Comparison Table */}
      <div
        ref={tableRef}
        className="w-full bg-white rounded-lg border border-[#E2E3DC] shadow-xs overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-[#F4F4F2] text-[#171815] p-3.5 sm:p-4 border-b border-[#E2E3DC] items-center text-xs font-mono font-semibold">
          <div className="md:col-span-4 text-[#65665F] uppercase tracking-wider">
            Capability
          </div>
          <div className="hidden md:block md:col-span-4 text-[#65665F] uppercase tracking-wider">
            Generic LLM prompt
          </div>
          <div className="hidden md:block md:col-span-4 text-[#171815] uppercase tracking-wider">
            Hello-md pipeline
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y divide-[#E2E3DC]">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 p-3.5 sm:p-4 gap-3 md:gap-4 items-center hover:bg-[#FAFAF8] transition-colors"
            >
              {/* Feature Title */}
              <div className="md:col-span-4 font-semibold text-xs sm:text-sm text-[#171815]">
                {item.feature}
              </div>

              {/* Generic LLM */}
              <div className="md:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-[#65665F]">
                <div className="w-4 h-4 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 border border-red-200">
                  <FiX className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{item.generic}</span>
              </div>

              {/* Hello-md Engine */}
              <div className="md:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-[#171815]">
                <div className="w-4 h-4 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <FiCheck className="w-3 h-3 stroke-[2.5]" />
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
