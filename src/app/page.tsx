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
                <h1 className="text-3xl sm:text-5xl lg:text-hero font-semibold tracking-[-0.03em] leading-[1.12] text-text-primary">
                  Generate a GitHub profile README from your real data.
                </h1>
                <p className="text-body leading-[1.65] text-text-secondary text-base sm:text-lg">
                  Connect your GitHub username to parse public repositories, contribution activity, and tech stacks into a beautifully structured profile README. Real facts from GitHub, zero AI hallucinations.
                </p>
              </div>

              {/* Form & Pipeline Stepper */}
              <GeneratorForm />
            </div>

            {/* Right Column: Hero Preview Showcase */}
            <div className="w-full lg:w-[48%] flex flex-col lg:sticky lg:top-20">
              <div className="relative group">
                {/* Ambient glow behind preview */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-accent/25 via-accent/5 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                {/* Professional Mockup Window Card */}
                <div className="w-full bg-[#0D0E0C] rounded-xl border border-[#262822] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
                  {/* Sleek Window Header Bar */}
                  <div className="h-10 px-4 bg-[#141611] border-b border-[#21231D] flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90"></span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#0D0E0C] px-3.5 py-1 rounded-md border border-[#262822] text-xs font-mono text-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                      <span>github.com/profile</span>
                    </div>

                    <span className="text-xs font-mono font-medium text-accent">README.md</span>
                  </div>

                  {/* Image Display */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0A0B09]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hero-image.jpeg"
                      alt="Sample Generated GitHub Profile README"
                      className="w-full h-full object-cover object-top hover:scale-[1.01] transition-transform duration-300 ease-out"
                    />
                  </div>
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
