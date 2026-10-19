"use client";

import { useRef } from "react";
import { LuZap, LuSparkles } from "react-icons/lu";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function CtaBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
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
      const formCard = document.getElementById("generator-card");
      if (formCard) {
        gsap.fromTo(
          formCard,
          {
            scale: 0.98,
            borderColor: "rgba(197, 244, 103, 1)",
            boxShadow: "0 0 25px rgba(197, 244, 103, 0.4)",
          },
          {
            scale: 1,
            borderColor: "",
            boxShadow: "",
            duration: 1,
            ease: "elastic.out(1, 0.4)",
            delay: 0.35,
            onComplete: () => {
              input?.focus();
              input?.select();
            },
          }
        );
      } else {
        setTimeout(() => {
          input?.focus();
        }, 400);
      }
    }
  };

  return (
    <section className="w-full pt-10 pb-8 select-none">
      <div
        ref={bannerRef}
        className="relative w-full rounded-2xl bg-[#0D0E0C] border border-[#2B2E24] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center gap-7"
      >
        {/* Ambient Glow Spotlight */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(197,244,103,0.18),transparent_70%)] blur-2xl -z-10" />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171815] border border-[#2B2E24] shadow-xs">
          <LuSparkles className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
            Instant Synthesis
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-white max-w-2xl leading-[1.1]">
          Ready to make your GitHub profile look{" "}
          <span className="text-accent underline decoration-accent/40 decoration-4 underline-offset-4">
            elite
          </span>
          ?
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
          Transform your public repositories, verified contributions, and language metrics into a polished README in under 30 seconds.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleScrollToGenerator}
            className="h-12 px-8 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-bold text-base rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-[0_0_24px_rgba(197,244,103,0.5)] hover:scale-[1.02] cursor-pointer group"
          >
            <LuZap className="w-4 h-4 text-[#0D0E0C] fill-[#0D0E0C] group-hover:scale-110 transition-transform" />
            <span>Generate My README Now</span>
            <FiArrowDown className="w-4 h-4 text-[#0D0E0C] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 pt-3 text-xs font-medium text-white/80">
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[3]" />
            <span>100% Free &amp; Open Source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[3]" />
            <span>No Personal Tokens Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5 text-accent stroke-[3]" />
            <span>Instant GitHub Markdown Output</span>
          </div>
        </div>
      </div>
    </section>
  );
}
