import { AIAnalysis } from "@/components/landing/AIAnalysis";
import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Templates } from "@/components/landing/Templates";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIAnalysis />
      <Templates />
      <CTA />
      <Footer />
    </main>
  );
}
