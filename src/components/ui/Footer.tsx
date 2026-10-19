"use client";

import { useRef } from "react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { FiArrowUp, FiExternalLink, FiTerminal, FiCheckCircle } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }
    },
    { scope: footerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#0D0E0C] text-[#FAFAF8] border-t border-[#21231D] shadow-[0_-1px_0_0_rgba(255,255,255,0.05)] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col gap-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Value Prop (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
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
                <span className="font-semibold text-nav tracking-[-0.02em] text-white">
                  Hello-md
                </span>
              </Link>

              <span className="text-[#32352B] font-mono text-meta">/</span>

              <span className="font-mono text-eyebrow uppercase text-[#A0A298] bg-[#161813] px-2 py-0.5 rounded-sm border border-[#262820] tracking-[0.04em]">
                ReadmeKit
              </span>
            </div>

            <p className="text-body text-[#95988D] leading-[1.65] max-w-sm">
              Precision developer GitHub profile README generator. Grounded in real GitHub facts, zero hallucinations, pure deterministic badges and stats.
            </p>

            {/* Live Status Pill */}
            <div className="flex items-center gap-2.5 mt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#151712] border border-[#262820] text-meta font-mono text-[#D8D9D2]">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span>Systems Operational</span>
              </div>
              <span className="font-mono text-[11px] text-[#787B70]">v1.0.0</span>
            </div>
          </div>

          {/* Col 1: Product */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-eyebrow uppercase text-[#787B70] tracking-[0.04em]">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-nav text-[#95988D]">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <LuSparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Profile Synthesizer</span>
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Structural Templates
                </Link>
              </li>
              <li>
                <span className="text-[#95988D] flex items-center gap-1.5">
                  <span>Live Markdown Editor</span>
                  <span className="font-mono text-[10px] bg-[#1C1E17] text-accent px-1.5 py-0.2 rounded-sm border border-[#2E3126]">
                    CM6
                  </span>
                </span>
              </li>
              <li>
                <span className="text-[#95988D]">Shields.io Badges</span>
              </li>
              <li>
                <span className="text-[#95988D]">GraphQL Facts Ingestion</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Architecture */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-eyebrow uppercase text-[#787B70] tracking-[0.04em]">
              Architecture
            </span>
            <ul className="flex flex-col gap-2.5 text-nav text-[#95988D]">
              <li className="flex items-center gap-1.5">
                <FiTerminal className="w-3.5 h-3.5 text-[#787B70]" />
                <span>Next.js 14 App Router</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-accent" />
                <span>Groq Llama 3.3 Router</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-accent" />
                <span>Google Gemini 2.0 Fallback</span>
              </li>
              <li>
                <span>MongoDB Draft Storage</span>
              </li>
              <li>
                <span>Deterministic Badges</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Source */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-eyebrow uppercase text-[#787B70] tracking-[0.04em]">
              Source & Docs
            </span>
            <ul className="flex flex-col gap-2.5 text-nav text-[#95988D]">
              <li>
                <a
                  href="https://github.com/SajithNuski/Hello-md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <SiGithub className="w-3.5 h-3.5 text-white" />
                  <span>GitHub Repository</span>
                  <FiExternalLink className="w-3 h-3 text-[#787B70] group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SajithNuski/Hello-md/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Report an Issue</span>
                  <FiExternalLink className="w-3 h-3 text-[#787B70] group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SajithNuski"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Developer Profile</span>
                  <FiExternalLink className="w-3 h-3 text-[#787B70] group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <span className="font-mono text-eyebrow text-[#787B70] bg-[#161813] px-2 py-0.5 rounded-sm border border-[#262820] w-fit">
                  MIT License
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-[#1E2019]"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-[#787B70] font-mono">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Hello-md. Built for GitHub developers.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#95988D]">
              Engineered with <span className="text-accent font-sans font-semibold">Geist</span> &amp; <span className="text-accent font-sans font-semibold">React Icons</span>
            </span>

            <button
              onClick={scrollToTop}
              className="h-8 px-3 bg-[#151712] hover:bg-[#1E2019] text-[#D0D2C9] hover:text-white border border-[#272921] hover:border-[#383B30] rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Scroll back to top"
            >
              <FiArrowUp className="w-3.5 h-3.5" />
              <span className="text-eyebrow uppercase tracking-wider">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
