import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/landing/Hero";
import { GeneratorSection } from "@/components/landing/GeneratorSection";
import { Methodology } from "@/components/landing/Methodology";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171815] flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-20 lg:gap-28">
          {/* 1. Hero Section: Headline, Pitch, Action CTAs & 3D Interactive Preview */}
          <Hero />

          {/* 2. Dedicated Generator Section (ScrollTrigger & Highlight) */}
          <GeneratorSection />

          {/* 3. Methodology Three-Step Section (ScrollTrigger Stagger & Micro-interactions) */}
          <Methodology />
        </div>
      </main>

      <Footer />
    </div>
  );
}
