"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VerifyTicketModal } from "./verify-ticket-modal";

// Define the slide data structure
interface CarouselSlide {
  id: number;
  image: string;
  overlayColor: string;
  headline: string;
  subheading: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
}

// Sample carousel slides data
const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    image: "/images/conferences/conferences-hero.jpg",
    overlayColor:
      "from-yellow-300/70 to-emerald-300/70 dark:from-yellow-600/70 dark:to-emerald-600/70",
    headline: "Découvrez Notre Programme de Conférences",
    subheading:
      "Explorez notre sélection de conférences sur des sujets variés et restez informé des dernières initiatives. Inscrivez-vous facilement en ligne.",
    primaryCta: {
      text: "Voir les conférences",
      link: "/conferences",
    },
    // secondaryCta: {
    //   text: "How It Works",
    //   link: "/how-it-works",
    // },
  },
  {
    id: 2,
    image: "/images/conferences/conferences-hero-2.jpg",
    overlayColor:
      "from-yellow-300/70 to-red-300/70 dark:from-yellow-600/70 dark:to-red-600/70",
    headline: "Participez aux Conférences Qui Façonnent l'Avenir",
    subheading:
      "Rejoignez des experts et des décideurs pour discuter des enjeux clés de notre société. Inscrivez-vous dès maintenant et réservez votre place.",
    primaryCta: {
      text: "Voir les conférences",
      link: "/conferences",
    },
    // secondaryCta: {
    //   text: "Learn More",
    //   link: "/about",
    // },
  },
  {
    id: 3,
    image: "/images/conferences/conferences-hero-3.jpg",
    overlayColor:
      "from-yellow-300/70 to-emerald-300/70 dark:from-yellow-600/70 dark:to-emerald-600/70",
    headline: "Votre Accès Direct à l'Information",
    subheading:
      "Ne manquez pas nos conférences : une occasion unique de vous informer, d'échanger et de contribuer aux débats publics. Inscription rapide et sécurisée.",
    primaryCta: {
      text: "Voir les conférences",
      link: "/conferences",
    },
  },
  {
    id: 4,
    image: "/images/conferences/conferences-hero-4.jpg",
    overlayColor:
      "from-emerald-300/70 to-red-300/70 dark:from-emerald-600/70 dark:to-red-600/70",
    headline: "Inscrivez-vous à Nos Conférences en Ligne",
    subheading:
      "Accédez facilement à nos conférences thématiques et bénéficiez d'une information de qualité, où que vous soyez. Paiement en ligne simplifié.",
    primaryCta: {
      text: "Voir les conférences",
      link: "/conferences",
    },
    // secondaryCta: {
    //   text: "See Success Stories",
    //   link: "/testimonials",
    // },
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // Store the API and obtain scroll snap positions
  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  // Handle slide changes
  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  // Autoplay functionality
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [emblaApi, isPaused]);

  // Navigation functions
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div
      className="relative h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex h-[70vh]">
          {carouselSlides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 overflow-hidden h-full"
            >
              {/* Background image with zoom effect */}
              <div
                className="absolute inset-0 w-full h-full  bg-cover bg-center transition-transform duration-10000 scale-105 animate-subtle-zoom"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Color overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r",
                  slide.overlayColor
                )}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-foreground px-4 md:px-8 text-center max-w-6xl mx-auto pt-16">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-in">
                  {slide.headline}
                </h1>
                <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mb-8 animate-fade-in animation-delay-200">
                  {slide.subheading}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400">
                  <Link href={slide.primaryCta.link}>
                    <ButtonCustom
                      variant="primary"
                      size="lg"
                      className="min-w-36"
                    >
                      {slide.primaryCta.text}
                    </ButtonCustom>
                  </Link>
                  <VerifyTicketModal />

                  {slide.secondaryCta && (
                    <Link href={slide.secondaryCta.link}>
                      <ButtonCustom
                        variant="outline"
                        size="lg"
                        className="min-w-36 backdrop-blur-sm "
                      >
                        {slide.secondaryCta.text}
                      </ButtonCustom>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 glass-dark rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 glass-dark rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none",
              selectedIndex === index
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Current slide indicator */}
      <div className="absolute top-4 right-4 hidden lg:block glass-dark px-3 py-1 rounded-full text-sm text-white/90 z-20">
        {selectedIndex + 1} / {scrollSnaps.length}
      </div>
    </div>
  );
}
