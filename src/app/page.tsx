import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { Comparison } from "@/components/landing/Comparison";
import { GeneratorSection } from "@/components/landing/GeneratorSection";
import { Faq } from "@/components/landing/Faq";
import { CtaBanner } from "@/components/landing/CtaBanner";

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

          {/* 3. Features Bento Grid: Core Technical Capabilities */}
          <FeaturesBento />

          {/* 4. Comparison Section: Hello-md vs Generic LLMs */}
          <Comparison />

          {/* 5. Dedicated Generator Section (ScrollTrigger & Highlight) */}
          <GeneratorSection />

          {/* 6. FAQ Section: Developer Questions & Answers */}
          <Faq />

          {/* 7. Pre-Footer Call to Action Banner */}
          <CtaBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
