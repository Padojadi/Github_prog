import { JSON_DEMO_URL } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";

type Mission = {
  id: number;
  name: string;
  link: string;
  number: number;
  bgColor: string;
};

export default async function MissionsDashboard() {
  const data = await fetch(JSON_DEMO_URL + "/missions", {
    cache: "no-store",
  })
    .then((response) => response.json())
    .catch(() => []) as Mission[];

  const safeData = Array.isArray(data) ? data : [];
  const reportSections = [
    {
      title: "Synthese des missions",
      headers: ["Rubrique", "Total"],
      rows: safeData.map((item) => [item.name, item.number]),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DashboardReportActions
          title="Tableau de bord Missions - Rapport"
          fileName="tableau-de-bord-missions"
          sections={reportSections}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {safeData.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col p-4 text-white ${item.bgColor}`}
          >
            <span className="text-3xl font-bold">{item.number}</span>
            <span className="text-xl">{item.name}</span>
            <Link
              className="mt-2 flex items-center text-current hover:text-white"
              href={item.link}
            >
              <InfoIcon className="text-current" />
              <span className="ml-1">Plus de détails</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
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
