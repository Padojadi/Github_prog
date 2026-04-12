"use client";
import { Building2 } from "lucide-react";

// Partenaires de démonstration - à remplacer par les vrais logos
const partners = [
  { name: "Ministère de l'Économie", logo: null },
  { name: "Ministère de la Santé", logo: null },
  { name: "Ministère de l'Éducation", logo: null },
  { name: "Ministère des Finances", logo: null },
  { name: "Ministère de l'Agriculture", logo: null },
  { name: "Ministère du Numérique", logo: null },
  { name: "Primature", logo: null },
  { name: "Assemblée Nationale", logo: null },
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container-custom">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-[#00853F] rounded-full" />
            <span className="text-sm font-medium text-[#00853F] uppercase tracking-wider">
              Partenaires
            </span>
            <div className="w-8 h-1 bg-[#00853F] rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Nos Partenaires Institutionnels
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            PROTOSEN travaille en étroite collaboration avec les institutions
            gouvernementales pour organiser des événements de qualité.
          </p>
        </div>

        {/* Grille de partenaires */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#00853F]/50 hover:shadow-md transition-all duration-300"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 w-auto grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-[#00853F]/10 transition-colors">
                  <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500 group-hover:text-[#00853F] transition-colors" />
                </div>
              )}
              <span className="mt-3 text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Vous êtes une institution gouvernementale ?{" "}
            <a
              href="mailto:contact@protosen.gouv.sn"
              className="text-[#00853F] hover:underline font-medium"
            >
              Contactez-nous
            </a>{" "}
            pour devenir partenaire.
          </p>
        </div>
      </div>
    </section>
  );
}
