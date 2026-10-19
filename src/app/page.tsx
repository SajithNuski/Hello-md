import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { GeneratorSection } from "@/components/landing/GeneratorSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171815] flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-20 lg:gap-28">
          {/* 1. Hero Section: Headline, Pitch, Action CTAs & 3D Interactive Preview */}
          <Hero />

          {/* 2. How It Works Section: 3-Step Workflow Architecture */}
          <HowItWorks />

          {/* 3. Dedicated Generator Section (ScrollTrigger & Highlight) */}
          <GeneratorSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
