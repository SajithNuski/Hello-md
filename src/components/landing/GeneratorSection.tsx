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
        gsap.from(headerRef.current, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
        });
      }

      // ScrollTrigger entrance for Form Card
      if (formWrapperRef.current) {
        gsap.from(formWrapperRef.current, {
          scrollTrigger: {
            trigger: formWrapperRef.current,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.1,
        });
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
        className="flex flex-col items-center text-center gap-3 max-w-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-text-primary">
          Synthesize Your Profile
        </h2>
        <p className="text-body leading-[1.6] text-text-secondary">
          Enter your GitHub handle to parse your real contributions and build a customized profile README.
        </p>
      </div>

      <div ref={formWrapperRef} className="w-full flex justify-center">
        <GeneratorForm />
      </div>
    </section>
  );
}
