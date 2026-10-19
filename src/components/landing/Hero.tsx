"use client";

import { useRef } from "react";
import { LuSparkles } from "react-icons/lu";
import { FiArrowDown, FiCheck, FiCheckCircle, FiGitCommit } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
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
  const floatingBadge1Ref = useRef<HTMLDivElement>(null);
  const floatingBadge2Ref = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Coordinated Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          headlineRef.current,
          {
            y: 35,
            opacity: 0,
            duration: 0.85,
          },
          "-=0.4"
        )
        .from(
          descRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.75,
          },
          "-=0.6"
        )
        .from(
          actionsRef.current ? actionsRef.current.children : [],
          {
            y: 18,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        )
        .from(
          featuresRef.current ? featuresRef.current.children : [],
          {
            y: 12,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          cardRef.current,
          {
            y: 45,
            scale: 0.94,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .from(
          [floatingBadge1Ref.current, floatingBadge2Ref.current],
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.8)",
          },
          "-=0.4"
        )
        .from(
          ribbonRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
          },
          "-=0.3"
        );

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

      // 4. Parallax Floating on Badge 1 (Top-Right)
      if (floatingBadge1Ref.current) {
        gsap.to(floatingBadge1Ref.current, {
          y: "-=8",
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3,
        });
      }

      // 5. Parallax Floating on Badge 2 (Bottom-Left)
      if (floatingBadge2Ref.current) {
        gsap.to(floatingBadge2Ref.current, {
          y: "+=7",
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6,
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

  // Smooth scroll & generator highlight trigger
  const handleScrollToGenerator = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("generator");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });

      // Highlight the generator card when scrolled
      const formCard = document.getElementById("generator-card");
      if (formCard) {
        gsap.fromTo(
          formCard,
          { scale: 0.99, borderColor: "rgba(197, 244, 103, 0.8)" },
          {
            scale: 1,
            borderColor: "",
            duration: 1.2,
            ease: "elastic.out(1, 0.4)",
            delay: 0.35,
          }
        );
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
          {/* Release Eyebrow Capsule (High-contrast Obsidian & Acid Lime) */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D0E0C] border border-[#2B2E24] shadow-xs select-none w-fit"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
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
            <a
              href="#generator"
              onClick={handleScrollToGenerator}
              className="h-12 px-7 bg-[#0D0E0C] hover:bg-[#23251E] text-white font-semibold text-base rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg group cursor-pointer"
            >
              <LuSparkles className="w-4 h-4 text-accent" />
              <span>Synthesize Profile</span>
              <FiArrowDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://github.com/SajithNuski/Hello-md"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 bg-white hover:bg-[#F5F6F0] border-2 border-[#0D0E0C] text-[#0D0E0C] font-semibold text-base rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <SiGithub className="w-4 h-4 text-[#0D0E0C]" />
              <span>Star on GitHub</span>
            </a>
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

        {/* Right Column: Hero Preview Showcase with 3D Tilt and Floating Badges */}
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

          {/* Floating Glass Badge 1 (Top-Right) */}
          <div
            ref={floatingBadge1Ref}
            className="absolute -top-2 -right-2 sm:-right-4 z-20 bg-[#0D0E0C]/95 backdrop-blur-md border border-[#2D3025] rounded-lg px-3 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.45)] flex items-center gap-2.5 select-none"
          >
            <div className="w-6 h-6 rounded bg-[#1C1E18] text-accent flex items-center justify-center border border-[#313528]">
              <FiCheckCircle className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xs text-white leading-tight">
                Real GitHub Data
              </span>
              <span className="font-mono text-[10px] text-accent font-medium leading-tight">
                Accurate &amp; verified
              </span>
            </div>
          </div>

          {/* Floating Glass Badge 2 (Bottom-Left) */}
          <div
            ref={floatingBadge2Ref}
            className="absolute -bottom-3 -left-2 sm:-left-4 z-20 bg-[#0D0E0C]/95 backdrop-blur-md border border-[#2D3025] rounded-lg px-3 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.45)] flex items-center gap-2.5 select-none"
          >
            <div className="w-6 h-6 rounded bg-[#1C1E18] text-accent flex items-center justify-center border border-[#313528]">
              <FiGitCommit className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xs text-white leading-tight">
                Ready to Publish
              </span>
              <span className="font-mono text-[10px] text-white/85 leading-tight">
                Copy or save to GitHub
              </span>
            </div>
          </div>

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
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
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

      {/* Tech Pipeline Feature Ribbon */}
      <div
        ref={ribbonRef}
        className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#0D0E0C]/15 select-none"
      >
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white border border-[#0D0E0C]/10 shadow-xs hover:border-[#0D0E0C]/40 transition-colors">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 w-fit px-2 py-0.5 rounded">
            01 / ROUTER
          </span>
          <span className="font-bold text-sm text-[#0D0E0C]">
            Llama 3.3 + Gemini
          </span>
          <span className="text-xs text-[#2B2D26] font-medium">
            Multi-model fallback
          </span>
        </div>

        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white border border-[#0D0E0C]/10 shadow-xs hover:border-[#0D0E0C]/40 transition-colors">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 w-fit px-2 py-0.5 rounded">
            02 / DATA
          </span>
          <span className="font-bold text-sm text-[#0D0E0C]">
            GitHub GraphQL API
          </span>
          <span className="text-xs text-[#2B2D26] font-medium">
            Repos, stats, languages
          </span>
        </div>

        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white border border-[#0D0E0C]/10 shadow-xs hover:border-[#0D0E0C]/40 transition-colors">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 w-fit px-2 py-0.5 rounded">
            03 / EDITOR
          </span>
          <span className="font-bold text-sm text-[#0D0E0C]">
            CodeMirror 6 Suite
          </span>
          <span className="text-xs text-[#2B2D26] font-medium">
            Live split markdown
          </span>
        </div>

        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white border border-[#0D0E0C]/10 shadow-xs hover:border-[#0D0E0C]/40 transition-colors">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#0D0E0C] bg-accent/40 w-fit px-2 py-0.5 rounded">
            04 / EXPORT
          </span>
          <span className="font-bold text-sm text-[#0D0E0C]">
            Direct GitHub Push
          </span>
          <span className="text-xs text-[#2B2D26] font-medium">
            Copy, download, or sync
          </span>
        </div>
      </div>
    </div>
  );
}
