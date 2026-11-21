"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import podcastSlatStudio from "@/assets/hero-studio-1.jpg";
import videoPodcastDesk from "@/assets/hero-studio-2.jpg";
import dualCamPodcastSet from "@/assets/hero-studio-3.jpg";
import cycloramaPhotoLoft from "@/assets/hero-studio-4.jpg";

export interface HeroSlide {
  id: string;
  badge: string;
  headline: string;
  highlight: string;
  subtext: string;
  image: StaticImageData | string;
  alt: string;
  gearTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "acoustic-podcast-suite",
    badge: "Acoustic Podcast Suite",
    headline: "Record broadcast-ready",
    highlight: "podcasts in minutes.",
    subtext:
      "Step into acoustically treated spaces equipped with broadcast boom arms, ambient LED tubes, and warm studio ergonomics.",
    image: podcastSlatStudio,
    alt: "Warm acoustic wood-slat podcast room with round wooden table and three broadcast microphones",
    gearTag: "3x Shure SM7B • Acoustic Treatment",
  },
  {
    id: "creator-video-studio",
    badge: "4K Video & Creator Set",
    headline: "Built for creators who",
    highlight: "shoot to stand out.",
    subtext:
      "Pre-rigged cinema cameras, dual boom mics, and customizable RGB key lights—ready the moment you walk through the door.",
    image: videoPodcastDesk,
    alt: "Creator video studio featuring cinema camera on tripod, wooden desk with dual boom microphones, and warm accent lighting",
    gearTag: "4K Cinema Rig • RGB Tube Lighting",
  },
  {
    id: "dual-cam-live-studio",
    badge: "Multi-Cam Live Production",
    headline: "Multi-camera setups,",
    highlight: "zero setup friction.",
    subtext:
      "Dual ring lights, twin tripod angles, live monitoring screens, and an audio mixer—bookable by the hour for shows and interviews.",
    image: dualCamPodcastSet,
    alt: "Dual-camera podcast studio with two ring lights, twin tripods, live preview monitor, and audio mixer",
    gearTag: "Dual Camera • Live Switcher & Ring Lights",
  },
  {
    id: "cyclorama-photo-loft",
    badge: "Cyclorama & Daylight Loft",
    headline: "Editorial fashion &",
    highlight: "commercial film stages.",
    subtext:
      "Expansive infinity cyclorama walls, pro softbox strobes, natural daylight windows, and dedicated hair & makeup stations.",
    image: cycloramaPhotoLoft,
    alt: "Spacious concrete loft studio with white infinity cyclorama wall, softbox lighting, and vanity mirror",
    gearTag: "Infinity Cyclorama • Pro Strobe Kit",
  },
];

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section
      aria-label="Featured creative studios"
      className="relative w-full overflow-hidden bg-[#0E0E10] text-[#F2F2F0]"
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[calc(100vh-4.5rem)] min-h-150 max-h-220 w-full overflow-hidden">
                {/* High-Resolution Full-Bleed Visual */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover object-center transition-transform duration-6000 ease-out",
                    current === index ? "scale-105" : "scale-100"
                  )}
                />

                {/* Editorial Dark Vignette Overlays */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-[#0E0E10]/95 via-[#0E0E10]/70 to-[#0E0E10]/25"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-transparent to-[#0E0E10]/40"
                />

                {/* Foreground Hero Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-14 sm:px-20 lg:px-24">
                  <div className="max-w-2xl">
                    {/* Category & Gear Pill */}
                    <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-[#17171B]/80 px-3.5 py-1.5 text-xs font-semibold text-[#F2F2F0] backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span>{slide.badge}</span>
                      <span className="text-white/30">&bull;</span>
                      <span className="text-[#C3B2F7]">{slide.gearTag}</span>
                    </div>

                    {/* Punchy Headline */}
                    <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[64px]">
                      {slide.headline}{" "}
                      <span className="text-primary">{slide.highlight}</span>
                    </h1>

                    {/* Subtext */}
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D4D4D0] sm:text-lg">
                      {slide.subtext}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <Button

                        className="h-12 rounded-full bg-primary px-7 text-[14px] font-bold text-primary-foreground shadow-none transition-all hover:bg-primary/90 hover:shadow-[0_0_28px_rgba(198,242,78,0.45)]"
                      >
                        <Link
                          href="/studios"
                          className="inline-flex items-center gap-2"
                        >
                          <span>Explore Studios</span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 rounded-full border-white/20 bg-[#17171B]/75 px-7 text-[14px] font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-[#17171B] hover:text-primary"
                      >
                        <Link
                          href="/studios"
                          className="inline-flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4 shrink-0 text-primary" />
                          <span>Host Your Space</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Left Side Vertically Centered Arrow */}
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Previous slide"
          className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#17171B]/75 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-primary/60 hover:bg-[#17171B] hover:text-primary sm:left-6 sm:h-12 sm:w-12"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Side Vertically Centered Arrow */}
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Next slide"
          className="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#17171B]/75 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-primary/60 hover:bg-[#17171B] hover:text-primary sm:right-6 sm:h-12 sm:w-12"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Centered Dot Indicators */}
        <div
          role="tablist"
          aria-label="Choose hero slide"
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5"
        >
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={current === index}
              aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                current === index
                  ? "w-8 bg-primary shadow-[0_0_12px_rgba(198,242,78,0.6)]"
                  : "w-2.5 bg-white/35 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}

export default HeroSlider;