"use client";

import { useRef } from "react";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (headlineRef.current) {
        tl.from(headlineRef.current, {
          y: 16,
          opacity: 0,
          duration: 0.5,
        });
      }

      if (descRef.current) {
        tl.from(
          descRef.current,
          {
            y: 12,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.25"
        );
      }

      if (actionsRef.current) {
        tl.from(
          actionsRef.current,
          {
            y: 10,
            opacity: 0,
            duration: 0.35,
          },
          "-=0.2"
        );
      }

      if (cardRef.current) {
        tl.from(
          cardRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            clearProps: "all",
          },
          "-=0.3"
        );
      }
    },
    { scope: containerRef }
  );

  const handleScrollToGenerator = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault();
    const target = document.getElementById("generator");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("gh-username") as HTMLInputElement | null;
      input?.focus();
    }
  };

  // Tilt + Spotlight: card tilts gently toward cursor while a very soft light follows it
  const handleMouseEnter = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      scale: 1.008,
      borderColor: "#32352B",
      boxShadow:
        "0 14px 28px -8px rgba(0, 0, 0, 0.55), 0 0 16px -4px rgba(197, 244, 103, 0.06)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        opacity: 0.75,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates from -1 (left/top) to +1 (right/bottom)
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Subtle tilt TOWARD cursor (reduced to gentle 4.5 degrees)
    const maxTilt = 4.5;
    const rotateX = normY * maxTilt;
    const rotateY = -normX * maxTilt;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.25,
      ease: "power1.out",
      overwrite: "auto",
      transformPerspective: 1400,
    });

    // Update soft spotlight position following the cursor
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(255, 255, 255, 0.07), rgba(197, 244, 103, 0.025) 30%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      borderColor: "#262822",
      boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-12 pt-4">
      {/* 2-Column Hero Grid */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
        {/* Left Column: Typography and Action */}
        <div className="w-full lg:w-[50%] flex flex-col gap-5">
          {/* Tag */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#F0F1EA] border border-[#E2E3DC] text-xs font-medium text-[#52534C] w-fit">
            <span>Free and open source · No sign-up required</span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#171815] leading-[1.08]"
          >
            Generate a clean, fact-grounded GitHub profile README.
          </h1>

          {/* Description */}
          <p
            ref={descRef}
            className="text-base sm:text-lg text-[#52534C] leading-relaxed max-w-xl"
          >
            Connect your username to parse verified repositories, contribution activity, and language metrics into a structured, ready-to-commit README.
          </p>

          {/* Primary Action */}
          <div ref={actionsRef} className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              id="hero-generate-btn"
              onClick={handleScrollToGenerator}
              className="h-10 px-5 bg-accent hover:bg-accent-hover text-[#171815] font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Generate README</span>
              <FiArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Verified Feature Checks */}
          <div
            ref={featuresRef}
            className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#52534C]"
          >
            <div className="flex items-center gap-1.5">
              <FiCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>GraphQL API data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Shields.io badges</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>CodeMirror 6 editor</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Preview Mockup with Tilt + Spotlight */}
        <div className="w-full lg:w-[49%] flex flex-col" style={{ perspective: "1400px" }}>
          <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleScrollToGenerator}
            title="Click to jump to README generator"
            className="relative w-full bg-[#0D0E0C] rounded-lg border border-[#262822] shadow-sm overflow-hidden flex flex-col cursor-pointer transition-colors duration-200 select-none"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Soft Spotlight Overlay following cursor */}
            <div
              ref={spotlightRef}
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-200"
              style={{
                background:
                  "radial-gradient(circle 260px at 50% 50%, rgba(255, 255, 255, 0.07), rgba(197, 244, 103, 0.025) 30%, transparent 70%)",
              }}
            />

            {/* Window Header Bar */}
            <div className="h-9 px-3.5 bg-[#141611] border-b border-[#21231D] flex items-center justify-between select-none relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80"></span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#8E9285]">
                <span>github.com/profile</span>
              </div>

              <span className="text-[11px] font-medium text-accent bg-[#181A14] px-1.5 py-0.5 rounded border border-[#2A2E22]">
                README.md
              </span>
            </div>

            {/* Image Display */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0A0B09]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-image.jpeg"
                alt="Sample generated GitHub profile README"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
