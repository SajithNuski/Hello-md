"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSparkles, LuLayoutTemplate } from "react-icons/lu";
import { SiGithub, SiMarkdown } from "react-icons/si";

export function Header() {
  const pathname = usePathname();

  const isEditor = pathname.startsWith("/editor");
  const isGenerator = pathname === "/";
  const isTemplates = pathname === "/templates";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-surface/90 backdrop-blur-md border-b border-border select-none">
      <div className="h-12 w-full px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-sm bg-text-primary text-accent flex items-center justify-center shadow-xs">
              <SiMarkdown className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-nav tracking-[-0.02em] text-text-primary">
              Hello-md
            </span>
          </Link>
          <span className="text-border font-mono text-meta">/</span>
          <span className="font-mono text-eyebrow uppercase text-text-secondary bg-surface-raised px-1.5 py-0.5 rounded-sm border border-border">
            ReadmeKit
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-meta text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
            v1.0
          </span>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 h-full text-nav">
          <Link
            href="/"
            className={`h-full flex items-center px-1 transition-colors border-b-2 font-medium ${
              isGenerator
                ? "text-text-primary border-text-primary"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            <LuSparkles className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
            Generator
          </Link>

          <Link
            href="/templates"
            className={`h-full flex items-center px-1 transition-colors border-b-2 font-medium ${
              isTemplates
                ? "text-text-primary border-text-primary"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            <LuLayoutTemplate className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
            Templates
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/SajithNuski/Hello-md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-meta font-mono text-text-secondary hover:text-text-primary transition-colors"
          >
            <SiGithub className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
