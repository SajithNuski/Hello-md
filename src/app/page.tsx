import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { GeneratorForm } from "@/components/landing/GeneratorForm";
import { Methodology } from "@/components/landing/Methodology";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171815] flex flex-col justify-between">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-16 lg:gap-24">
          {/* Hero Section: 2-Column Grid */}
          <section className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12">
            {/* Left Column: Headline, Description & Generator Form */}
            <div className="w-full lg:w-[50%] flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2">
                  <span className="font-mono text-eyebrow tracking-[0.04em] text-text-muted uppercase">
                    Engine :: Profile Synthesizer
                  </span>
                  <span className="font-mono text-meta text-border">/</span>
                  <span className="font-mono text-meta text-text-secondary">v1.0.0</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-hero font-semibold tracking-[-0.03em] leading-[1.12] text-text-primary">
                  Generate a GitHub profile README from your real data.
                </h1>
                <p className="text-body leading-[1.65] text-text-secondary">
                  Connect your GitHub username to parse public repositories, contribution activity, and tech stacks into a beautifully structured profile README. Real facts from GitHub, zero AI hallucinations.
                </p>
              </div>

              {/* Form & Pipeline Stepper */}
              <GeneratorForm />
            </div>

            {/* Right Column: Hero Preview Showcase */}
            <div className="w-full lg:w-[48%] flex flex-col gap-4 lg:sticky lg:top-20">
              <div className="relative group">
                {/* Ambient glow behind preview */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-accent/30 via-accent/5 to-transparent rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                {/* Card Container */}
                <div className="w-full bg-[#0D0E0C] rounded-lg border border-[#21231D] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col">
                  {/* Window Bar */}
                  <div className="h-9 px-4 bg-[#141611] border-b border-[#21231D] flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80"></span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#0D0E0C] px-3 py-1 rounded-sm border border-[#21231D] text-meta font-mono text-[#A0A298]">
                      <span className="text-accent text-[11px]">preview</span>
                      <span className="text-[#3A3D34]">/</span>
                      <span className="text-white text-[11px]">github.com/profile</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-eyebrow font-mono text-[#787B70]">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                      <span className="hidden sm:inline">README.md</span>
                    </div>
                  </div>

                  {/* Image Display */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0A0B09]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hero-image.jpeg"
                      alt="Sample Generated GitHub Profile README"
                      className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500 ease-out cursor-pointer"
                    />
                  </div>

                  {/* Bottom Preview Info Bar */}
                  <div className="px-4 py-2.5 bg-[#141611] border-t border-[#21231D] flex items-center justify-between text-meta font-mono text-[#95988D]">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      <span>Real GitHub facts &amp; Shields.io badges</span>
                    </span>
                    <span className="text-white font-medium bg-[#1C1E17] px-2 py-0.5 rounded-sm border border-[#2A2D23] text-eyebrow">
                      100% GROUNDED
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Feature Badges below image */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-meta font-mono">
                <div className="p-2.5 bg-surface rounded-sm border border-border shadow-xs flex flex-col gap-0.5">
                  <span className="text-eyebrow text-text-muted uppercase">Badges</span>
                  <span className="text-text-primary font-medium text-xs">Deterministic</span>
                </div>
                <div className="p-2.5 bg-surface rounded-sm border border-border shadow-xs flex flex-col gap-0.5">
                  <span className="text-eyebrow text-text-muted uppercase">Prose</span>
                  <span className="text-text-primary font-medium text-xs">Zero Hallucination</span>
                </div>
                <div className="p-2.5 bg-surface rounded-sm border border-border shadow-xs flex flex-col gap-0.5">
                  <span className="text-eyebrow text-text-muted uppercase">Export</span>
                  <span className="text-text-primary font-medium text-xs">MD, Copy, Push</span>
                </div>
              </div>
            </div>
          </section>

          {/* Methodology Three-step Section */}
          <Methodology />
        </div>
      </main>

      <Footer />
    </div>
  );
}
