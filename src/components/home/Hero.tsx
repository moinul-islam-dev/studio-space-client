import type { Metadata } from "next";
import { HeroSlider } from "./hero-slider";

export const metadata: Metadata = {
  title: "StudioSpace — Discover & Book Creative Studios",
  description:
    "Explore verified podcast rooms, 4K video production sets, and cyclorama photography studios on demand.",
};

export default function Hero() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <HeroSlider />
    </main>
  );
}