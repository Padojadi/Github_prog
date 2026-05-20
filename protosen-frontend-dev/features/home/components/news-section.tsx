"use client";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: Date;
  category: "communique" | "actualite" | "annonce";
  imageUrl?: string;
}

// Données de démonstration - à remplacer par des vraies données
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Lancement de la nouvelle plateforme PROTOSEN",
    excerpt:
      "Le Gouvernement du Sénégal annonce le lancement officiel de la plateforme PROTOSEN pour la gestion des conférences gouvernementales.",
    date: new Date(),
    category: "communique",
  },
  {
    id: "2",
    title: "Conférence sur la transformation numérique",
    excerpt:
      "Une conférence majeure sur la transformation numérique de l'administration publique se tiendra le mois prochain à Dakar.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "actualite",
  },
  {
    id: "3",
    title: "Inscription ouverte pour le Forum Économique",
    excerpt:
      "Les inscriptions pour le Forum Économique National sont désormais ouvertes. Places limitées.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "annonce",
  },
];

const categoryStyles = {
  communique: {
    bg: "bg-[#00853F]/10",
    text: "text-[#00853F]",
    label: "Communiqué",
  },
  actualite: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    label: "Actualité",
  },
  annonce: {
    bg: "bg-[#FDEF42]/30",
    text: "text-amber-700 dark:text-amber-400",
    label: "Annonce",
  },
};

export default function NewsSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container-custom">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-[#00853F] rounded-full" />
              <span className="text-sm font-medium text-[#00853F] uppercase tracking-wider">
                Actualités
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Actualités & Communiqués
            </h2>
            <p className="text-muted-foreground mt-2">
              Restez informé des dernières nouvelles et annonces officielles
            </p>
          </div>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-[#00853F] hover:text-[#006B32] font-medium transition-colors"
          >
            Voir toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grille d'actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#00853F]/20 to-[#FDEF42]/20 flex items-center justify-center">
                <Calendar className="h-16 w-16 text-[#00853F]/30" />
              </div>

              <div className="p-5">
                {/* Catégorie et date */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryStyles[item.category].bg
                    } ${categoryStyles[item.category].text}`}
                  >
                    {categoryStyles[item.category].label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(item.date, "d MMM yyyy", { locale: fr })}
                  </span>
                </div>

                {/* Titre */}
                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-[#00853F] transition-colors">
                  <Link href={`/actualites/${item.id}`}>{item.title}</Link>
                </h3>

                {/* Extrait */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {item.excerpt}
                </p>

                {/* Lien */}
                <Link
                  href={`/actualites/${item.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#00853F] hover:text-[#006B32] transition-colors"
                >
                  Lire la suite
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
