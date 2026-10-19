import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { GeneratorForm } from "@/components/landing/GeneratorForm";
import { Methodology } from "@/components/landing/Methodology";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171815] flex flex-col justify-between">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 py-64 flex flex-col gap-40">
          {/* Top Engine Section Header */}
          <section className="flex flex-col gap-4">
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
            <p className="text-body leading-[1.65] text-text-secondary max-w-2xl">
              Connect your GitHub username to parse public repositories, contribution activity, and tech stacks into a beautifully structured profile README. Real facts from GitHub, zero AI hallucinations.
            </p>
          </section>

          {/* Form & Pipeline Stepper */}
          <GeneratorForm />

          {/* Methodology Three-step Section */}
          <Methodology />
        </div>
      </main>

      <Footer />
    </div>
  );
}
