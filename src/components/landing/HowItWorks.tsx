"use client";

import { useRef } from "react";
import { SiGithub } from "react-icons/si";
import { LuSparkles, LuCheck } from "react-icons/lu";
import { FiGitCommit, FiTerminal } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Reveal Header on Scroll
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

      // Staggered Cards Reveal on Scroll
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const handleCardMouseEnter = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: -6,
      borderColor: "rgba(13, 14, 12, 0.4)",
      boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.12)",
      duration: 0.3,
      ease: "power2.out",
    });

    const icon = card.querySelector(".icon-box");
    if (icon) {
      gsap.to(icon, {
        scale: 1.08,
        backgroundColor: "#0D0E0C",
        duration: 0.3,
        ease: "back.out(2)",
      });
    }
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: 0,
      borderColor: "",
      boxShadow: "",
      duration: 0.4,
      ease: "power2.out",
    });

    const icon = card.querySelector(".icon-box");
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        backgroundColor: "#171815",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full flex flex-col gap-10 pt-14 pb-4 border-t border-border/80 scroll-mt-24 select-none"
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0E0C] border border-[#2B2E24] shadow-xs">
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
            Workflow Architecture
          </span>
          <span className="text-[#3A3D33]">|</span>
          <span className="font-mono text-xs text-accent font-semibold">
            3 Simple Steps
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0D0E0C]">
          How It Works
        </h2>
        <p className="text-base sm:text-lg text-[#262822] leading-relaxed">
          From your public GitHub handle to a high-converting profile README in under 30 seconds.
        </p>
      </div>

      {/* 3-Step Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div
          ref={(el) => {
            cardsRef.current[0] = el;
          }}
          onMouseEnter={() => handleCardMouseEnter(0)}
          onMouseLeave={() => handleCardMouseLeave(0)}
          className="flex flex-col justify-between gap-6 p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-general text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                STEP 01
              </span>
              <div className="icon-box w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs transition-transform">
                <SiGithub className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              Connect GitHub
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822]">
              Enter your username. We query the official GitHub GraphQL API to parse verified repositories, contribution activity, languages, and star metrics.
            </p>
          </div>

          <div className="pt-3 border-t border-[#0D0E0C]/10 flex items-center gap-1.5 text-xs font-general font-medium text-[#0D0E0C]">
            <LuCheck className="w-4 h-4 text-accent stroke-[3]" />
            <span>Public Data Only · No Token Required</span>
          </div>
        </div>

        {/* Step 2 */}
        <div
          ref={(el) => {
            cardsRef.current[1] = el;
          }}
          onMouseEnter={() => handleCardMouseEnter(1)}
          onMouseLeave={() => handleCardMouseLeave(1)}
          className="flex flex-col justify-between gap-6 p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-general text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                STEP 02
              </span>
              <div className="icon-box w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs transition-transform">
                <LuSparkles className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              AI &amp; Badge Synthesis
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822]">
              Llama 3.3 and Gemini synthesize structured prose grounded strictly in your real repos, while deterministic code generates live Shields.io stats cards.
            </p>
          </div>

          <div className="pt-3 border-t border-[#0D0E0C]/10 flex items-center gap-1.5 text-xs font-general font-medium text-[#0D0E0C]">
            <LuCheck className="w-4 h-4 text-accent stroke-[3]" />
            <span>Zero Hallucinations · Verified Facts</span>
          </div>
        </div>

        {/* Step 3 */}
        <div
          ref={(el) => {
            cardsRef.current[2] = el;
          }}
          onMouseEnter={() => handleCardMouseEnter(2)}
          onMouseLeave={() => handleCardMouseLeave(2)}
          className="flex flex-col justify-between gap-6 p-7 bg-white rounded-xl border border-[#0D0E0C]/15 shadow-sm transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-general text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 px-2.5 py-1 rounded">
                STEP 03
              </span>
              <div className="icon-box w-10 h-10 rounded-lg bg-[#171815] text-accent flex items-center justify-center shadow-xs transition-transform">
                <FiGitCommit className="w-5 h-5 text-accent" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0D0E0C]">
              Edit &amp; Direct Publish
            </h3>

            <p className="text-[15px] leading-relaxed text-[#262822]">
              Fine-tune markdown with split CodeMirror 6 preview, reorder sections, regenerate blocks, then copy, download, or commit straight to your profile repo.
            </p>
          </div>

          <div className="pt-3 border-t border-[#0D0E0C]/10 flex items-center gap-1.5 text-xs font-general font-medium text-[#0D0E0C]">
            <LuCheck className="w-4 h-4 text-accent stroke-[3]" />
            <span>Live Editor · 1-Click Commit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
