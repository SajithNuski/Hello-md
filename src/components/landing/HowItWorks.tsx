"use client";

import { useRef } from "react";
import { SiGithub } from "react-icons/si";
import { FiCheck, FiGitCommit, FiLayers } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: cardsRef.current,
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
      id="how-it-works"
      ref={sectionRef}
      className="w-full flex flex-col gap-10 pt-12 pb-2 border-t border-[#E2E3DC] scroll-mt-20 select-none"
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto"
      >
        <span className="text-xs font-semibold text-[#65665F] uppercase tracking-wider">
          Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
          How it works
        </h2>
        <p className="text-sm sm:text-base text-[#52534C] leading-relaxed">
          From your public GitHub handle to a structured README in three straightforward steps.
        </p>
      </div>

      {/* 3-Step Cards Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="flex flex-col justify-between gap-5 p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#65665F]">
                01
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <SiGithub className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-[#171815]">
              Ingest public activity
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Enter your username. The app queries the official GitHub GraphQL API to fetch verified repositories, contribution activity, and language byte counts.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E3DC] flex items-center gap-1.5 text-xs text-[#52534C]">
            <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>Public data only · No token required</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col justify-between gap-5 p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#65665F]">
                02
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiLayers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-[#171815]">
              Assemble content &amp; badges
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Structured summary text is generated strictly constrained to verified facts, while code deterministically formats live Shields.io badges.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E3DC] flex items-center gap-1.5 text-xs text-[#52534C]">
            <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>Grounded facts · Standardized badge URLs</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col justify-between gap-5 p-6 bg-white rounded-lg border border-[#E2E3DC] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#65665F]">
                03
              </span>
              <div className="w-8 h-8 rounded-md bg-[#F4F4F2] border border-[#E2E3DC] flex items-center justify-center text-[#171815]">
                <FiGitCommit className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-[#171815]">
              Edit and export
            </h3>

            <p className="text-sm text-[#52534C] leading-relaxed">
              Fine-tune markdown with synchronized live preview, reorder sections, and copy the output or commit straight to your profile repository.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E3DC] flex items-center gap-1.5 text-xs text-[#52534C]">
            <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>CodeMirror 6 editor · Direct commit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
