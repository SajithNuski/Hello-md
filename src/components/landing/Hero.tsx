"use client";

import { useRef } from "react";
import { LuZap } from "react-icons/lu";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Coordinated Entrance Timeline (Safe guarded)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.from(badgeRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
        });
      }

      if (headlineRef.current) {
        tl.from(
          headlineRef.current,
          {
            y: 35,
            opacity: 0,
            duration: 0.85,
          },
          "-=0.4"
        );
      }

      if (descRef.current) {
        tl.from(
          descRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.75,
          },
          "-=0.6"
        );
      }

      const actionButtons = actionsRef.current
        ? Array.from(actionsRef.current.children).filter(Boolean)
        : [];
      if (actionButtons.length > 0) {
        tl.fromTo(
          actionButtons,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.4)",
            clearProps: "all",
          },
          "-=0.5"
        );
      }

      const featureItems = featuresRef.current
        ? Array.from(featuresRef.current.children).filter(Boolean)
        : [];
      if (featureItems.length > 0) {
        tl.from(
          featureItems,
          {
            y: 12,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          "-=0.4"
        );
      }

      if (cardRef.current) {
        tl.from(
          cardRef.current,
          {
            y: 45,
            scale: 0.94,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
          },
          "-=0.7"
        );
      }

      // 2. Ambient Subtle Glow Pulsation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.1,
          opacity: 0.9,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 3. Gentle Ambient Floating on Showcase Card
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: "-=6",
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: containerRef }
  );

  // 3D Interactive Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !cardContainerRef.current) return;

    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5; // max -5.5 to +5.5 deg
    const rotateY = ((x - centerX) / centerX) * 5.5; // max -5.5 to +5.5 deg

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.75,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  // Quick Access: Instant smooth scroll + focus input
  const handleQuickAccess = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
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
    <div ref={containerRef} className="relative w-full flex flex-col gap-14 sm:gap-18 pt-2">
      {/* Background Atmosphere: Subtle Radial Grid Mask & Spotlight */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(197,244,103,0.12),transparent_75%)] blur-2xl -z-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262822_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_60%,transparent_100%)] opacity-30 -z-10" />

      {/* Main 2-Column Hero Grid */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
        {/* Left Column: High-Impact Typography, CTAs, and High-Contrast Indicators */}
        <div className="w-full lg:w-[50%] flex flex-col gap-6">
          {/* Release Eyebrow Capsule */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0E0C] border border-[#2B2E24] shadow-xs select-none w-fit"
          >
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
              GitHub GraphQL Engine
            </span>
            <span className="text-[#3A3D33]">|</span>
            <span className="font-mono text-xs text-accent font-semibold">
              Zero Hallucinations
            </span>
          </div>

          {/* Short & Big Font Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-extrabold tracking-[-0.04em] leading-[1.02] text-[#0D0E0C]"
          >
            Turn your GitHub into an{" "}
            <span className="relative inline-block text-[#0D0E0C] bg-accent px-3 py-0.5 rounded-lg -rotate-1 shadow-xs">
              elite README
            </span>
            .
          </h1>

          {/* Value Prop Lead Description (High-contrast, Crisp Black) */}
          <p
            ref={descRef}
            className="text-lg sm:text-xl font-normal leading-[1.55] text-[#171815] max-w-xl"
          >
            Connect your username. We parse verified repos, contributions, and language metrics into a structured, ready-to-commit profile README.
          </p>

          {/* Action CTAs */}
          <div ref={actionsRef} className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Primary Action Button: Generate Readme.md */}
            <button
              type="button"
              id="hero-generate-btn"
              onClick={handleQuickAccess}
              className="h-12 px-6 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-bold text-base rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-[0_0_22px_rgba(197,244,103,0.5)] hover:scale-[1.01] cursor-pointer group select-none"
            >
              <LuZap className="w-4 h-4 text-[#0D0E0C] fill-[#0D0E0C] group-hover:scale-110 transition-transform" />
              <span>Generate Readme.md</span>
              <FiArrowDown className="w-4 h-4 text-[#0D0E0C] group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* High-Contrast Obsidian Feature Badges */}
          <div
            ref={featuresRef}
            className="flex flex-wrap items-center gap-2.5 pt-2 select-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0E0C] text-white text-xs font-mono font-medium shadow-xs">
              <FiCheck className="w-4 h-4 text-accent stroke-[2.5]" />
              <span>GraphQL Verified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0E0C] text-white text-xs font-mono font-medium shadow-xs">
              <FiCheck className="w-4 h-4 text-accent stroke-[2.5]" />
              <span>Shields.io Badges</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0E0C] text-white text-xs font-mono font-medium shadow-xs">
              <FiCheck className="w-4 h-4 text-accent stroke-[2.5]" />
              <span>1-Click Git Push</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Preview Showcase with 3D Tilt */}
        <div
          ref={cardContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full lg:w-[49%] flex flex-col cursor-pointer relative pt-4 pb-2"
          style={{ perspective: 1200 }}
        >
          {/* Ambient Glow Spotlight */}
          <div
            ref={glowRef}
            className="absolute -inset-2 bg-gradient-to-tr from-accent/35 via-accent/10 to-transparent rounded-2xl blur-2xl opacity-65 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          />

          {/* Professional Mockup Window Card with GSAP 3D Transform */}
          <div
            ref={cardRef}
            className="w-full bg-[#0D0E0C] rounded-xl border border-[#262822] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_32px_85px_-15px_rgba(0,0,0,0.55)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Sleek Window Header Bar */}
            <div className="h-10 px-4 bg-[#141611] border-b border-[#21231D] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90"></span>
              </div>

              {/* IDE Tab */}
              <div className="flex items-center gap-2 bg-[#0D0E0C] px-3.5 py-1 rounded-md border border-[#262822] text-xs font-mono text-white/90">
                <span>github.com/profile</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/70 hidden sm:inline">
                  git:(main)
                </span>
                <span className="text-xs font-mono font-medium text-accent bg-[#181A14] px-2 py-0.5 rounded border border-[#2A2E22]">
                  README.md
                </span>
              </div>
            </div>

            {/* Image Showcase Display */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0A0B09]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-image.jpeg"
                alt="Sample Generated GitHub Profile README"
                className="w-full h-full object-cover object-top hover:scale-[1.01] transition-transform duration-300 ease-out"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
