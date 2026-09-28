import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { SoundboardPreview } from "@/components/landing/soundboard-preview";
import { CtaBand } from "@/components/landing/cta-band";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <SoundboardPreview />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
