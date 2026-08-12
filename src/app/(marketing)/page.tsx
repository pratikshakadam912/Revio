import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Templates } from "@/components/landing/Templates";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
      <Features />
      <Templates />
    </main>
  );
}
