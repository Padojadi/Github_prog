"use client";
import { Target, Eye, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Notre Mission",
    description:
      "Faciliter l'organisation et la participation aux conférences gouvernementales, en offrant une plateforme numérique moderne, accessible et sécurisée pour tous les citoyens sénégalais.",
  },
  {
    icon: Eye,
    title: "Notre Vision",
    description:
      "Devenir la référence nationale en matière de gestion d'événements gouvernementaux, contribuant ainsi à la modernisation de l'administration publique sénégalaise.",
  },
  {
    icon: Shield,
    title: "Nos Valeurs",
    description:
      "Transparence, accessibilité, innovation et excellence dans le service public. Nous nous engageons à servir les citoyens avec intégrité et professionnalisme.",
  },
];

export default function InstitutionSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#00853F] rounded-full" />
              <span className="text-sm font-medium text-[#00853F] uppercase tracking-wider">
                À Propos
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Plateforme Officielle du Gouvernement du Sénégal
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              PROTOSEN est la plateforme officielle de gestion des conférences
              et événements gouvernementaux de la République du Sénégal.
              Développée dans le cadre de la stratégie de transformation
              numérique de l'État, elle vise à moderniser l'organisation des
              événements publics et à faciliter la participation citoyenne.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Notre plateforme permet aux citoyens de découvrir, s'inscrire et
              participer aux conférences organisées par les différents
              ministères et institutions gouvernementales, tout en garantissant
              un processus simple, transparent et sécurisé.
            </p>

            {/* Valeurs */}
            <div className="space-y-4 mb-8">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#00853F]/10 flex items-center justify-center">
                    <value.icon className="h-5 w-5 text-[#00853F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button className="bg-[#00853F] hover:bg-[#006B32]">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Image / Illustration */}
          <div className="relative">
            {/* Carte principale avec drapeau stylisé */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden aspect-[4/3]">
              {/* Bandes du drapeau */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 bg-[#00853F]/20" />
                <div className="w-1/3 bg-[#FDEF42]/20" />
                <div className="w-1/3 bg-[#E31B23]/20" />
              </div>

              {/* Contenu central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <img
                  src="/images/logo.png"
                  alt="Logo PROTOSEN"
                  className="h-24 w-auto mb-4"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  République du Sénégal
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  "Un Peuple - Un But - Une Foi"
                </p>
              </div>
            </div>

            {/* Carte flottante */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00853F] flex items-center justify-center text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plateforme</p>
                  <p className="font-semibold text-foreground">Officielle & Sécurisée</p>
                </div>
              </div>
            </div>

            {/* Décoration */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FDEF42]/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
