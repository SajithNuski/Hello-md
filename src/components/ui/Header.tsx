"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSparkles, LuLayoutTemplate } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { FiMenu, FiX, FiActivity } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEditor = pathname.startsWith("/editor");
  const isGenerator = pathname === "/";
  const isTemplates = pathname === "/templates";
  const isSystemStates = pathname === "/system-states";

  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0D0E0C]/90 backdrop-blur-xl border-b border-[#21231D] shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.35)] select-none transition-all"
    >
      {/* Top Ambient Light Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent pointer-events-none" />

      {/* Main Navbar Container - Expanded Width (1536px / 2xl) */}
      <div className="h-full w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Cluster */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black border border-[#2A2D23] flex items-center justify-center shadow-xs group-hover:border-accent/60 group-hover:shadow-[0_0_14px_rgba(197,244,103,0.35)] transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Hello-md Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-[-0.03em] text-white group-hover:text-white transition-colors">
                Hello-md
              </span>
              
            </div>
          </Link>
        </div>

        {/* Center Nav: Premium Capsule Switcher */}
        <nav className="hidden lg:flex items-center bg-[#141611]/90 p-1.5 rounded-full border border-[#262920] shadow-inner backdrop-blur-md">
          <Link
            href="/#how-it-works"
            className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#9EAA96] hover:text-white hover:bg-white/[0.06] transition-all duration-150"
          >
            <span>How It Works</span>
          </Link>

          <Link
            href="/#features"
            className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#9EAA96] hover:text-white hover:bg-white/[0.06] transition-all duration-150"
          >
            <span>Features</span>
          </Link>

          <Link
            href="/#generator"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
              isGenerator
                ? "bg-[#23271D] text-accent border border-[#343A2B] shadow-xs"
                : "text-[#9EAA96] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <LuSparkles className="w-3.5 h-3.5 text-accent stroke-[2]" />
            <span>Generator</span>
          </Link>

          <Link
            href="/#faq"
            className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#9EAA96] hover:text-white hover:bg-white/[0.06] transition-all duration-150"
          >
            <span>FAQ</span>
          </Link>

          <Link
            href="/templates"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
              isTemplates
                ? "bg-[#23271D] text-accent border border-[#343A2B] shadow-xs"
                : "text-[#9EAA96] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <LuLayoutTemplate className="w-3.5 h-3.5 text-accent stroke-[1.8]" />
            <span>Templates</span>
          </Link>

          <Link
            href="/system-states"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
              isSystemStates
                ? "bg-[#23271D] text-accent border border-[#343A2B] shadow-xs"
                : "text-[#9EAA96] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <FiActivity className="w-3.5 h-3.5 text-accent" />
            <span>System States</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SajithNuski/Hello-md"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 bg-[#151712] hover:bg-[#1D2018] text-[#D0D2C9] hover:text-white border border-[#272921] hover:border-[#3D4233] rounded-md transition-all flex items-center gap-2 font-mono text-xs shadow-xs group"
          >
            <SiGithub className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline font-sans font-medium text-xs">GitHub</span>
            

          </a>

        
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md bg-[#151712] border border-[#272921] text-[#D0D2C9] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0D0E0C]/98 backdrop-blur-2xl border-b border-[#21231D] shadow-2xl px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Features
            </Link>
            <Link
              href="/#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
            >
              <LuSparkles className="w-4 h-4 text-accent" />
              <span>Generator</span>
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              FAQ
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
            >
              <LuLayoutTemplate className="w-4 h-4 text-accent" />
              <span>Templates</span>
            </Link>
            <Link
              href="/system-states"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
            >
              <FiActivity className="w-4 h-4 text-accent" />
              <span>System States</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#21231D] flex flex-col gap-2.5">
            <a
              href="https://github.com/SajithNuski/Hello-md"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 bg-[#151712] text-white border border-[#272921] rounded-md flex items-center justify-center gap-2 text-sm font-medium"
            >
              <SiGithub className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
            <Link
              href="/#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 px-4 bg-accent text-[#0D0E0C] font-semibold rounded-md flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <LuSparkles className="w-4 h-4" />
              <span>Synthesize README</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
