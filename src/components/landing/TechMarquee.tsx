"use client";

import { useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiRust,
  SiGo,
  SiCplusplus,
  SiKotlin,
  SiSwift,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiFastapi,
  SiDjango,
  SiBun,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGraphql,
  SiLinux,
  SiPrisma,
} from "react-icons/si";
import { gsap, useGSAP } from "@/lib/animations/gsap";

interface TechItem {
  name: string;
  category: "Language" | "Framework" | "Database" | "DevOps" | "Runtime" | "Tools";
  icon: IconType;
  color?: string;
  themeAdaptive?: boolean;
  description?: string;
  badge?: string;
}

// Track 1: Languages, Frameworks & Runtimes
const track1Items: TechItem[] = [
  {
    name: "TypeScript",
    category: "Language",
    icon: SiTypescript,
    color: "#3178C6",
    description: "Strictly typed superset of JavaScript for production scale.",
    badge: "Byte Metrics Parsed",
  },
  {
    name: "Python",
    category: "Language",
    icon: SiPython,
    color: "#3776AB",
    description: "Data science, AI backend services, and automation scripts.",
    badge: "Repo Telemetry Grounded",
  },
  {
    name: "React",
    category: "Framework",
    icon: SiReact,
    color: "#61DAFB",
    description: "Declarative component-based user interface architecture.",
    badge: "Auto-Detected in Package",
  },
  {
    name: "Rust",
    category: "Language",
    icon: SiRust,
    color: "#DEA584",
    description: "Blazing fast, memory-safe systems programming language.",
    badge: "Cargo Manifest Grounded",
  },
  {
    name: "Next.js",
    category: "Framework",
    icon: SiNextdotjs,
    themeAdaptive: true,
    description: "Full-stack React framework with SSR, streaming & RSC.",
    badge: "Framework Badges Ready",
  },
  {
    name: "Go",
    category: "Language",
    icon: SiGo,
    color: "#00ADD8",
    description: "High-throughput compiled language designed for concurrency.",
    badge: "Go Modules Parsed",
  },
  {
    name: "Node.js",
    category: "Runtime",
    icon: SiNodedotjs,
    color: "#5FA04E",
    description: "Asynchronous event-driven JavaScript server runtime.",
    badge: "Runtime Grounded",
  },
  {
    name: "Tailwind CSS",
    category: "Framework",
    icon: SiTailwindcss,
    color: "#06B6D4",
    description: "Utility-first CSS framework for rapid modern UI design.",
    badge: "Config Analyzed",
  },
  {
    name: "JavaScript",
    category: "Language",
    icon: SiJavascript,
    color: "#F7DF1E",
    description: "Universal language of the browser and modern web ecosystem.",
    badge: "Byte Ratios Computed",
  },
  {
    name: "FastAPI",
    category: "Framework",
    icon: SiFastapi,
    color: "#009688",
    description: "Modern, high-performance async web framework for Python.",
    badge: "API Framework",
  },
  {
    name: "Kotlin",
    category: "Language",
    icon: SiKotlin,
    color: "#7F52FF",
    description: "Concise multiplatform language for Android and backend JVM.",
    badge: "Gradle Manifest Grounded",
  },
  {
    name: "Swift",
    category: "Language",
    icon: SiSwift,
    color: "#F05138",
    description: "Fast, modern, type-safe language for Apple ecosystems.",
    badge: "Package Swift Parsed",
  },
  {
    name: "Vue.js",
    category: "Framework",
    icon: SiVuedotjs,
    color: "#4FC08D",
    description: "Progressive and approachable framework for building web UIs.",
    badge: "Auto-Detected in Package",
  },
  {
    name: "C++",
    category: "Language",
    icon: SiCplusplus,
    color: "#00599C",
    description: "High-performance systems programming and game engine language.",
    badge: "Repo Telemetry Grounded",
  },
];

// Track 2: Databases, Cloud, DevOps & Tools
const track2Items: TechItem[] = [
  {
    name: "PostgreSQL",
    category: "Database",
    icon: SiPostgresql,
    color: "#4169E1",
    description: "World's most advanced open-source relational SQL database.",
    badge: "Live Shields.io Badge",
  },
  {
    name: "Docker",
    category: "DevOps",
    icon: SiDocker,
    color: "#2496ED",
    description: "Containerized application packaging, delivery, and testing.",
    badge: "Dockerfile Detected",
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: SiMongodb,
    color: "#47A248",
    description: "Document-oriented flexible NoSQL database for scalable web apps.",
    badge: "Stack Telemetry Ready",
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    icon: SiKubernetes,
    color: "#326CE5",
    description: "Automated container orchestration, scaling, and management.",
    badge: "K8s Configs Scanned",
  },
  {
    name: "Redis",
    category: "Database",
    icon: SiRedis,
    color: "#FF4438",
    description: "In-memory data structure store used for caching and queues.",
    badge: "Live Shields.io Badge",
  },
  {
    name: "Supabase",
    category: "Database",
    icon: SiSupabase,
    color: "#3ECF8E",
    description: "Open-source Firebase alternative powered by PostgreSQL.",
    badge: "Auto-Detected",
  },
  {
    name: "Git",
    category: "Tools",
    icon: SiGit,
    color: "#F05032",
    description: "Distributed version control system tracking every repository commit.",
    badge: "Commit Logs Analyzed",
  },
  {
    name: "GitHub",
    category: "Tools",
    icon: SiGithub,
    themeAdaptive: true,
    description: "Developer collaboration platform powering Hello-md data ingestion.",
    badge: "GraphQL v4 Direct",
  },
  {
    name: "GraphQL",
    category: "Tools",
    icon: SiGraphql,
    color: "#E10098",
    description: "Declarative API query and manipulation language for modern web.",
    badge: "API Schema Ready",
  },
  {
    name: "Linux",
    category: "Tools",
    icon: SiLinux,
    color: "#FCC624",
    description: "Open-source Unix-like kernel running the modern cloud infrastructure.",
    badge: "Environment Detected",
  },
  {
    name: "Prisma",
    category: "Tools",
    icon: SiPrisma,
    themeAdaptive: true,
    description: "Next-generation TypeScript ORM with type-safe database queries.",
    badge: "Schema Verified",
  },
  {
    name: "Bun",
    category: "Runtime",
    icon: SiBun,
    color: "#FBF0DF",
    description: "Incredibly fast all-in-one JavaScript runtime, bundler & test runner.",
    badge: "Runtime Detected",
  },
  {
    name: "Django",
    category: "Framework",
    icon: SiDjango,
    color: "#092E20",
    description: "Batteries-included web framework for perfectionists with deadlines.",
    badge: "Auto-Detected",
  },
];

function TechCard({ item }: { item: TechItem }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-[#141512] border border-[#0D0E0C]/10 dark:border-[#262822] shadow-xs hover:border-[#0D0E0C]/40 dark:hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer select-none">
      {/* Icon with authentic brand color */}
      <div className="w-8 h-8 rounded-lg bg-[#0D0E0C]/5 dark:bg-white/5 flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-200">
        <Icon
          className={`w-5 h-5 transition-colors ${
            item.themeAdaptive ? "text-[#0D0E0C] dark:text-white" : ""
          }`}
          style={!item.themeAdaptive && item.color ? { color: item.color } : undefined}
        />
      </div>

      {/* Tech Name & Category */}
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-[#0D0E0C] dark:text-[#EDEDEB] tracking-[-0.01em] whitespace-nowrap">
          {item.name}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#73756C] dark:text-[#8D9085]">
          {item.category}
        </span>
      </div>
    </div>
  );
}

export function TechMarquee() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full flex flex-col gap-8 pt-12 pb-2 border-t border-[#E2E3DC] scroll-mt-20 select-none overflow-hidden"
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto px-4"
      >
        <span className="text-xs font-mono font-medium text-[#65665F] uppercase tracking-wider">
          Ecosystem
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
          Supported languages and tools
        </h2>
        <p className="text-sm sm:text-base text-[#52534C] leading-relaxed">
          Detected through repository language bytes, framework manifests, and configuration files.
        </p>
      </div>

      {/* Marquee Viewport without Edge Fade Masks */}
      <div className="w-full relative overflow-hidden py-2">
        <div className="flex flex-col gap-4">
          {/* Row 1: Right-to-Left (Languages & Frameworks) */}
          <div className="animate-marquee-rtl flex gap-4">
            {/* First Set */}
            {track1Items.map((item, index) => (
              <TechCard key={`track1-a-${index}`} item={item} />
            ))}
            {/* Duplicate Set for Seamless Infinite Loop */}
            {track1Items.map((item, index) => (
              <TechCard key={`track1-b-${index}`} item={item} />
            ))}
          </div>

          {/* Row 2: Right-to-Left at slightly different speed (Databases, Cloud & DevOps) */}
          <div className="animate-marquee-rtl-slow flex gap-4">
            {/* First Set */}
            {track2Items.map((item, index) => (
              <TechCard key={`track2-a-${index}`} item={item} />
            ))}
            {/* Duplicate Set for Seamless Infinite Loop */}
            {track2Items.map((item, index) => (
              <TechCard key={`track2-b-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
