"use client";

import { useRef } from "react";
import { GeneratorForm } from "./GeneratorForm";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function GeneratorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ScrollTrigger entrance for Header
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

      // ScrollTrigger entrance for Form Card
      if (formWrapperRef.current) {
        gsap.fromTo(
          formWrapperRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: formWrapperRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="generator"
      ref={sectionRef}
      className="w-full flex flex-col items-center gap-8 pt-8 scroll-mt-24 border-t border-border/60"
    >
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-2 max-w-xl"
      >
        <span className="text-xs font-mono font-medium text-[#65665F] uppercase tracking-wider">
          Generator
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
          Generate profile README
        </h2>
        <p className="text-sm sm:text-base text-[#52534C] leading-relaxed">
          Enter your GitHub username to parse public repositories and create a structured README.
        </p>
      </div>

      <div ref={formWrapperRef} className="w-full flex justify-center">
        <GeneratorForm />
      </div>
    </section>
  );
}
