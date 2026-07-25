"use client";
import { useEffect, useState, useRef } from "react";
import { Calendar, Users, Building2, Award } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: 150,
    suffix: "+",
    label: "Conférences organisées",
    description: "Événements officiels depuis le lancement",
  },
  {
    icon: Users,
    value: 25000,
    suffix: "+",
    label: "Participants",
    description: "Citoyens et professionnels inscrits",
  },
  {
    icon: Building2,
    value: 45,
    suffix: "",
    label: "Ministères partenaires",
    description: "Institutions gouvernementales actives",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "Taux de satisfaction des participants",
  },
];

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString("fr-FR");
    }
    return num.toString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-[#00853F] via-[#00853F] to-[#006B32] text-white relative overflow-hidden"
    >
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDEF42] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E31B23] rounded-full blur-3xl" />
      </div>

      {/* Motif de grille */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            PROTOSEN en Chiffres
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Des résultats concrets au service des citoyens sénégalais
          </p>
        </div>

        {/* Grille de statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#FDEF42] text-[#00853F] mb-4">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="font-semibold text-white mb-1">{stat.label}</div>
              <p className="text-sm text-white/70">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
