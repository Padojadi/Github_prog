"use client";
import { useEffect, useRef } from "react";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import Link from "next/link";

const HeroShape = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "absolute pointer-events-none blur-xl opacity-40 rounded-full",
      className
    )}
  ></div>
);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const shapes = containerRef.current.querySelectorAll(".shape");
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const moveX = (e.clientX - centerX) * 0.01;
      const moveY = (e.clientY - centerY) * 0.01;

      shapes.forEach((shape, index) => {
        const factor = (index + 1) * 0.4;
        (shape as HTMLElement).style.transform = `translate(${
          moveX * factor
        }px, ${moveY * factor}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-20 px-4 overflow-hidden"
    >
      {/* Background shapes */}
      <HeroShape className="shape bg-green-400 h-96 w-96 -top-20 -left-20 animate-float" />
      <HeroShape className="shape bg-yellow-400 h-80 w-80 bottom-20 -right-10 animate-float animation-delay-1000" />
      <HeroShape className="shape bg-red-300 h-64 w-64 top-40 right-1/4 animate-float animation-delay-2000" />

      <div className="max-w-7xl mx-auto w-full z-10 py-16 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <div className="inline-block animate-fade-in bg-foreground/5 backdrop-blur-sm px-4 py-1 rounded-full mb-4 border border-foreground/10">
                <span className="text-sm text-foreground/80 font-medium">
                  Transforming Conference Experiences
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-balance tracking-tight animate-fade-in">
                Where Ideas <span className="text-primary">Connect</span> and{" "}
                <span className="text-secondary">Flourish</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in text-balance">
                Discover a seamless platform for conferences that brings
                together speakers, attendees, and ideas in one elegantly
                designed space.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in">
              <Link href="/conferences">
                <ButtonCustom
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Voir les conférences
                </ButtonCustom>
              </Link>
              {/* <ButtonCustom
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              ></ButtonCustom> */}
            </div>

            {/* <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground pt-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10k+ Attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>500+ Events</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Global Reach</span>
              </div>
            </div> */}
          </div>

          <div className="relative aspect-square max-w-lg mx-auto animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative z-10 glass dark:glass-dark h-full rounded-3xl flex items-center justify-center p-8">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20"></div>
                <img
                  src="/images/conferences/conferences-hero.jpg"
                  alt="Conference scene"
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <h3 className="text-white font-medium">
                    Annual Tech Summit 2023
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    August 10-12, San Francisco
                  </p>
                </div>

                <div className="absolute top-4 right-4 glass-dark rounded-full px-3 py-1 text-xs font-medium text-white">
                  Live Now
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-10 -right-10 z-20 glass dark:glass-dark w-48 rounded-xl p-3 shadow-sm animate-float">
              <div className="flex items-center gap-3 text-foreground">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs">Attendees</p>
                  <p className="font-medium">1,234 Registered</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 z-20 glass dark:glass-dark w-48 rounded-xl p-3 shadow-sm animate-float animation-delay-1000">
              <div className="flex items-center gap-3 text-foreground">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs ">Sessions</p>
                  <p className="font-medium">56 Upcoming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-pulse-slow">
        <Link
          href="#conferences"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroller pour découvrir</span>
            <ArrowRight className="h-4 w-4 rotate-90" />
          </div>
        </Link>
      </div>
    </div>
  );
}
