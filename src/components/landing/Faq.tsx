"use client";

import { useState, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Do I need to share GitHub passwords or personal access tokens?",
    answer:
      "No passwords or private tokens are required. Hello-md queries GitHub's official GraphQL v4 API using public data only. You only need OAuth authentication if you choose to use the 1-click push feature to commit directly to your profile repository.",
  },
  {
    question: "How does Hello-md prevent AI hallucinations?",
    answer:
      "We strictly isolate data ingestion from prose generation. All repository stats, star counts, commit activity, and language byte percentages are deterministically fetched from GitHub before the AI runs. Our Groq Llama 3.3 and Gemini 2.0 prompts are strictly constrained to summarize the verified JSON facts, making fabricated skills or projects impossible.",
  },
  {
    question: "Can I customize the generated sections or edit the markdown?",
    answer:
      "Yes! Once generation completes, you are redirected to the Studio Workspace powered by CodeMirror 6. You can edit the raw markdown with instant synchronized preview, reorder sections, regenerate individual blocks with different tones, and toggle dynamic stats badges.",
  },
  {
    question: "Can I bring my own API keys (BYOK)?",
    answer:
      "Yes. You can supply your own Groq or Google Gemini API keys for unmetered, high-frequency generations. When BYOK is enabled, your keys are passed ephemerally without being logged or stored on our servers.",
  },
  {
    question: "How does 1-click publishing to GitHub work?",
    answer:
      "GitHub renders profile READMEs from a special repository matching your username (e.g., github.com/sajithnuski/sajithnuski). When you authenticate, Hello-md verifies that this repository exists, fetches the current README SHA if one is present, presents a unified diff of proposed changes, and commits directly on the main branch upon confirmation.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

      if (listRef.current && listRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(listRef.current.children),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="w-full flex flex-col gap-12 pt-14 pb-4 border-t border-border/80 scroll-mt-24 select-none"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0E0C] border border-[#2B2E24] shadow-xs">
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
            Developer FAQs
          </span>
          <span className="text-[#3A3D33]">|</span>
          <span className="font-mono text-xs text-accent font-semibold">
            Clear Answers
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0D0E0C]">
          Frequently Asked Questions
        </h2>
        <p className="text-base sm:text-lg text-[#262822] leading-relaxed">
          Everything you need to know about how Hello-md queries data, builds badges, and protects your profile.
        </p>
      </div>

      {/* Accordion List */}
      <div
        ref={listRef}
        className="max-w-3xl w-full mx-auto flex flex-col gap-3.5"
      >
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-[#0D0E0C] shadow-sm"
                  : "bg-white/80 border-[#0D0E0C]/15 hover:border-[#0D0E0C]/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="font-bold text-base sm:text-lg text-[#0D0E0C] leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full bg-[#171815] text-accent flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-accent text-[#0D0E0C]" : ""
                  }`}
                >
                  <FiChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[#262822] text-sm sm:text-base leading-relaxed border-t border-[#0D0E0C]/10 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
