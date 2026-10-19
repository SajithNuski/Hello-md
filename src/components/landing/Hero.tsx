"use client";

import { useRef } from "react";
import { LuSparkles } from "react-icons/lu";
import { FiArrowDown } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
      })
        .from(
          descRef.current,
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          actionsRef.current ? actionsRef.current.children : [],
          {
            y: 20,
            opacity: 0,
            stagger: 0.12,
            duration: 0.65,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .from(
          cardRef.current,
          {
            y: 50,
            scale: 0.93,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
          },
          "-=0.7"
        );

      // 2. Ambient subtle glow pulsation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 3. Ambient card gentle floating
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: "-=6",
          duration: 4,
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

    const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
    const rotateY = ((x - centerX) / centerX) * 6; // max -6 to +6 deg

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
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
            delay: 0.4,
          }
        );
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 pt-4"
    >
      {/* Left Column: Headline, Pitch & CTA */}
      <div className="w-full lg:w-[48%] flex flex-col gap-6">
        <h1
          ref={headlineRef}
          className="text-3xl sm:text-5xl lg:text-hero font-semibold tracking-[-0.03em] leading-[1.12] text-text-primary"
        >
          Generate a GitHub profile README from your real data.
        </h1>
        <p
          ref={descRef}
          className="text-body leading-[1.65] text-text-secondary text-base sm:text-lg"
        >
          Connect your GitHub username to parse public repositories, contribution
          activity, and tech stacks into a beautifully structured profile README.
          Real facts from GitHub, zero AI hallucinations.
        </p>

        {/* Action Buttons */}
        <div ref={actionsRef} className="flex flex-wrap items-center gap-3.5 pt-2">
          <a
            href="#generator"
            onClick={handleScrollToGenerator}
            className="h-11 px-6 bg-[#171815] hover:bg-[#31322E] text-white font-medium text-nav rounded-md transition-all flex items-center justify-center gap-2 shadow-xs group cursor-pointer"
          >
            <LuSparkles className="w-4 h-4 text-accent" />
            <span>Synthesize Profile</span>
            <FiArrowDown className="w-3.5 h-3.5 text-[#95988D] group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href="https://github.com/SajithNuski/Hello-md"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 bg-surface hover:bg-surface-raised border border-border text-text-primary font-medium text-nav rounded-md transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <SiGithub className="w-4 h-4" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>

      {/* Right Column: Hero Preview Showcase with 3D Tilt */}
      <div
        ref={cardContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full lg:w-[50%] flex flex-col cursor-pointer"
        style={{ perspective: 1200 }}
      >
        <div className="relative group">
          {/* Ambient glow behind preview */}
          <div
            ref={glowRef}
            className="absolute -inset-2 bg-gradient-to-tr from-accent/30 via-accent/10 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          ></div>

          {/* Professional Mockup Window Card with GSAP 3D Transform */}
          <div
            ref={cardRef}
            className="w-full bg-[#0D0E0C] rounded-xl border border-[#262822] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.45)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Sleek Window Header Bar */}
            <div className="h-10 px-4 bg-[#141611] border-b border-[#21231D] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90"></span>
              </div>

              <div className="flex items-center gap-2 bg-[#0D0E0C] px-3.5 py-1 rounded-md border border-[#262822] text-xs font-mono text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                <span>github.com/profile</span>
              </div>

              <span className="text-xs font-mono font-medium text-accent">
                README.md
              </span>
            </div>

            {/* Image Display */}
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
      </div>
    </section>
  );
}
