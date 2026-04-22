import Link from "next/link";
import React from "react";
import { getGeneralDashboardSummary } from "@/lib/dashboard/general-dashboard";
import type { DashboardModuleKey } from "@/lib/dashboard/general-dashboard";

type DashboardCard = {
  key: DashboardModuleKey;
  title: string;
  value: number;
  bgClass: string;
  linkClass: string;
  extraDescription?: string;
};

export default async function Dashboard() {
  const summary = await getGeneralDashboardSummary();

  const cards: DashboardCard[] = [
    {
      key: "missions",
      title: "Missions",
      value: summary.counts.missions,
      bgClass: "bg-blue-600",
      linkClass: "text-blue-200 hover:text-blue-100",
    },
    {
      key: "cards",
      title: "Cartes Diplomatiques",
      value: summary.counts.cards,
      bgClass: "bg-green-600",
      linkClass: "text-green-200 hover:text-green-100",
      extraDescription: [
        `Nouvelles: ${summary.cardSummary.newRequests}`,
        `Imprimées: ${summary.cardSummary.printedCards}`,
        `Duplicata: ${summary.cardSummary.duplicateRequests}`,
        `Duplicata imprimés: ${summary.cardSummary.duplicatePrinted}`,
        `Renouvellements: ${summary.cardSummary.renewRequests}`,
        `Renouvellements imprimés: ${summary.cardSummary.renewPrinted}`,
      ].join(" • "),
    },
    {
      key: "visas",
      title: "Visas",
      value: summary.counts.visas,
      bgClass: "bg-yellow-400",
      linkClass: "text-yellow-200 hover:text-yellow-100",
    },
    {
      key: "exonerations",
      title: "Exonérations",
      value: summary.counts.exonerations,
      bgClass: "bg-orange-400",
      linkClass: "text-orange-200 hover:text-orange-100",
    },
    {
      key: "conferences",
      title: "Conférences",
      value: summary.counts.conferences,
      bgClass: "bg-gray-600",
      linkClass: "text-gray-200 hover:text-gray-100",
    },
    {
      key: "immatriculations",
      title: "Immatriculations",
      value: summary.counts.immatriculations,
      bgClass: "bg-green-700",
      linkClass: "text-green-100 hover:text-white",
    },
    {
      key: "lounge",
      title: "Salon Honneur",
      value: summary.counts.lounge,
      bgClass: "bg-slate-700",
      linkClass: "text-slate-200 hover:text-white",
    },
    {
      key: "others",
      title: "Autres",
      value: summary.counts.others,
      bgClass: "bg-orange-500",
      linkClass: "text-orange-100 hover:text-white",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className={`flex flex-col text-white p-4 ${card.bgClass}`}>
            <span className="text-3xl font-bold">{card.value}</span>
            <span className="text-xl">{card.title}</span>
            {card.extraDescription ? (
              <p className="mt-1 text-xs text-white/90">{card.extraDescription}</p>
            ) : null}
            <Link
              className={`mt-2 flex items-center ${card.linkClass}`}
              href={`/api/dashboard/export?module=${card.key}`}
              prefetch={false}
            >
              <InfoIcon className="text-current" />
              <span className="ml-1">Plus de détails</span>
            </Link>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Les exports « Plus de détails » sont fournis en CSV UTF-8 compatible Excel.
      </p>
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
