"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSparkles, LuLayoutTemplate } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const isEditor = pathname.startsWith("/editor");
  const isGenerator = pathname === "/";
  const isTemplates = pathname === "/templates";

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -24,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
      });
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0D0E0C]/95 backdrop-blur-md border-b border-[#21231D] shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.25)] select-none"
    >
      <div className="h-full w-full px-4 sm:px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md overflow-hidden bg-black border border-[#2A2D23] flex items-center justify-center shadow-xs group-hover:border-accent/60 group-hover:shadow-[0_0_12px_rgba(197,244,103,0.3)] transition-all duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Hello-md Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-nav tracking-[-0.02em] text-white group-hover:text-white transition-colors">
              Hello-md
            </span>
          </Link>
        </div>

        {/* Center Nav: Capsule Switcher */}
        <nav className="hidden md:flex items-center bg-[#151712] p-1 rounded-full border border-[#24271F] shadow-inner">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              isGenerator
                ? "bg-[#24271F] text-accent shadow-xs"
                : "text-[#95988D] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LuSparkles className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Generator</span>
          </Link>

          <Link
            href="/templates"
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              isTemplates
                ? "bg-[#24271F] text-accent shadow-xs"
                : "text-[#95988D] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LuLayoutTemplate className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Templates</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="https://github.com/SajithNuski/Hello-md"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 bg-[#151712] hover:bg-[#1E2019] text-[#D0D2C9] hover:text-white border border-[#272921] hover:border-[#383B30] rounded-sm transition-all flex items-center gap-2 font-mono text-xs shadow-xs"
          >
            <SiGithub className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline font-sans font-medium text-xs">GitHub</span>
          </a>

          <Link
            href="/"
            className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-[#121310] font-semibold text-xs rounded-sm transition-all flex items-center gap-1.5 shadow-xs hover:shadow-[0_0_14px_rgba(197,244,103,0.35)] cursor-pointer"
          >
            <LuSparkles className="w-3.5 h-3.5 stroke-[2]" />
            <span className="hidden xs:inline">New README</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
