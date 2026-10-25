"use client";

import { useRef } from "react";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function CtaBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: bannerRef }
  );

  const handleScrollToGenerator = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("generator");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("gh-username") as HTMLInputElement | null;
      setTimeout(() => {
        input?.focus();
        input?.select();
      }, 300);
    }
  };

  return (
    <section className="w-full pt-8 pb-12 select-none">
      <div
        ref={bannerRef}
        className="relative w-full rounded-lg bg-[#0D0E0C] border border-[#2B2E24] p-8 sm:p-12 lg:p-14 flex flex-col items-center text-center gap-6"
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#171815] border border-[#2B2E24]">
          <span className="font-mono text-xs uppercase tracking-wider text-[#A0A299]">
            Get started
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white max-w-2xl leading-tight">
          Generate your GitHub profile README in seconds
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#A0A299] max-w-xl leading-relaxed">
          Transform your public repositories, verified contributions, and language metrics into a structured markdown README.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          <button
            type="button"
            onClick={handleScrollToGenerator}
            className="h-10 px-6 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Generate README</span>
            <FiArrowDown className="w-4 h-4 text-[#0D0E0C]" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-2 text-xs text-[#A0A299]">
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[2.5]" />
            <span>Open source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[2.5]" />
            <span>No personal tokens required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[2.5]" />
            <span>Standard GitHub markdown output</span>
          </div>
        </div>
      </div>
    </section>
  );
}

