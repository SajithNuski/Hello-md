import { Header } from "@/components/ui/Header";
import { GeneratorForm } from "@/components/landing/GeneratorForm";
import { Methodology } from "@/components/landing/Methodology";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171815] flex flex-col">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 py-10 flex flex-col gap-10">
          {/* Top Engine Section Header */}
          <section className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-[#91928A] uppercase tracking-wider">
                Engine :: Profile Synthesizer
              </span>
              <span className="font-mono text-xs text-[#91928A]">/</span>
              <span className="font-mono text-xs text-[#65665F]">v1.0.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171815]">
              Generate a GitHub profile README from your real data.
            </h1>
            <p className="text-sm text-[#65665F] max-w-2xl leading-relaxed">
              Connect your GitHub username to parse public repositories, contribution activity, and tech stacks into a beautifully structured profile README. Real facts from GitHub, zero AI hallucinations.
            </p>
          </section>

          {/* Form & Pipeline Stepper */}
          <GeneratorForm />

          {/* Methodology Three-step Section */}
          <Methodology />
        </div>
      </main>
    </div>
  );
}
