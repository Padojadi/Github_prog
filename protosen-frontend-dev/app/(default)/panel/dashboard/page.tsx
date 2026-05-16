import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES, JSON_DEMO_URL } from "@/lib/constants";
import { fetchStatsCards, fetchStatsCardsDuplicata, fetchStatsCardsRenew } from "@/lib/actions/diplomaticCards/holders";
import { getOrganisms } from "@/features/others/organisms/lib/apis";
import { getCardTypes } from "@/features/others/type-of-cards/lib/apis";
import { getPlates } from "@/features/others/plates/lib/apis";
import { visaKpiCards } from "@/features/visas/lib/tdr";
import { exonerationKpiCards } from "@/features/exonerations/lib/tdr";
import { registrationKpiCards } from "@/features/registrations/lib/tdr";

type DashboardCard = {
  label: string;
  value: number;
  href: string;
  cardClassName: string;
  linkClassName: string;
};

type DashboardStatRow = { total?: number };
type DashboardActionResult = {
  status?: string;
  data?: unknown;
};

const numberFormatter = new Intl.NumberFormat("fr-FR");

const conferenceStatuses = [
  "PENDING",
  "ACCEPTED",
  "VALIDATED",
  "CONFIRMED",
  "REJECTED",
  "REJECTED_PERMANENTLY",
];

const getNumberFromValue = (value: string | undefined): number => {
  if (!value) return 0;
  const normalized = value.replace(/[^\d]/g, "");
  return Number.parseInt(normalized || "0", 10);
};

const getArrayCount = (value: unknown): number => {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.total === "number") {
      return record.total;
    }
    if (Array.isArray(record.rows)) {
      return record.rows.length;
    }
    if (Array.isArray(record.data)) {
      return record.data.length;
    }
    if (record.data && typeof record.data === "object") {
      return getArrayCount(record.data);
    }
  }

  return 0;
};

const getRowsTotal = (result: DashboardActionResult): number => {
  if (result.status !== "success" || !Array.isArray(result.data)) {
    return 0;
  }

  return result.data.reduce((acc, row) => {
    if (!row || typeof row !== "object") {
      return acc;
    }
    const typedRow = row as DashboardStatRow;
    return acc + (typeof typedRow.total === "number" ? typedRow.total : 0);
  }, 0);
};

const getMissionsCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${JSON_DEMO_URL}/missions`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return 0;
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return 0;
    }

    return data.reduce((acc, item) => {
      if (!item || typeof item !== "object") {
        return acc;
      }
      const mission = item as { number?: number };
      return acc + (typeof mission.number === "number" ? mission.number : 0);
    }, 0);
  } catch {
    return 0;
  }
};

const getDiplomaticCardsCount = async (): Promise<number> => {
  const [newRequests, renewals, duplicates] = await Promise.all([
    fetchStatsCards(),
    fetchStatsCardsRenew(),
    fetchStatsCardsDuplicata(),
  ]);

  return (
    getRowsTotal(newRequests as DashboardActionResult) +
    getRowsTotal(renewals as DashboardActionResult) +
    getRowsTotal(duplicates as DashboardActionResult)
  );
};

const getConferencesCount = async (): Promise<number> => {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.backendTokens?.accessToken;
    if (!token) {
      return 0;
    }

    const query = new URLSearchParams({
      page: "1",
      limit: "1",
    });
    conferenceStatuses.forEach((status) => query.append("status", status));

    const response = await fetch(
      `${BACKEND_URL_CONFERENCES}/conference?${query.toString()}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return 0;
    }

    const result: unknown = await response.json();
    return getArrayCount(result);
  } catch {
    return 0;
  }
};

const getHonorLoungeCount = async (): Promise<number> => {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.backendTokens?.accessToken;
    if (!token) {
      return 0;
    }

    const query = new URLSearchParams({
      page: "1",
      limit: "1",
    });

    const response = await fetch(
      `${BACKEND_URL_CONFERENCES}/lounge/bookings?${query.toString()}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return 0;
    }

    const result: unknown = await response.json();
    return getArrayCount(result);
  } catch {
    return 0;
  }
};

const getOthersCount = async (): Promise<number> => {
  const [organismsResult, cardTypesResult, platesResult] = await Promise.all([
    getOrganisms(),
    getCardTypes(),
    getPlates(),
  ]);

  const organismsCount =
    organismsResult?.status === "success" ? getArrayCount(organismsResult.data) : 0;
  const cardTypesCount =
    cardTypesResult?.status === "success" ? getArrayCount(cardTypesResult.data) : 0;
  const platesCount =
    platesResult?.status === "success" ? getArrayCount(platesResult.data) : 0;

  return organismsCount + cardTypesCount + platesCount;
};

export default async function Dashboard() {
  const visasCount = getNumberFromValue(
    visaKpiCards.find((card) => card.label === "Visas délivrés")?.value
  );
  const exonerationsCount = getNumberFromValue(
    exonerationKpiCards.find((card) => card.label === "TE émis")?.value
  );
  const registrationsCount = getNumberFromValue(
    registrationKpiCards.find((card) => card.label === "Dossiers traités")?.value
  );

  const [missionsCount, diplomaticCardsCount, conferencesCount, honorLoungeCount, othersCount] =
    await Promise.all([
      getMissionsCount(),
      getDiplomaticCardsCount(),
      getConferencesCount(),
      getHonorLoungeCount(),
      getOthersCount(),
    ]);

  const cards: DashboardCard[] = [
    {
      label: "Missions",
      value: missionsCount,
      href: "/panel/missions/dashboard",
      cardClassName: "bg-blue-600",
      linkClassName: "text-blue-200 hover:text-blue-100",
    },
    {
      label: "Cartes Diplomatiques",
      value: diplomaticCardsCount,
      href: "/panel/diplomatic/dashboard",
      cardClassName: "bg-green-600",
      linkClassName: "text-green-200 hover:text-green-100",
    },
    {
      label: "Visas",
      value: visasCount,
      href: "/panel/visas/dashboard",
      cardClassName: "bg-yellow-400",
      linkClassName: "text-yellow-100 hover:text-yellow-50",
    },
    {
      label: "Exonérations",
      value: exonerationsCount,
      href: "/panel/exonerations/dashboard",
      cardClassName: "bg-orange-400",
      linkClassName: "text-orange-100 hover:text-orange-50",
    },
    {
      label: "Conférences",
      value: conferencesCount,
      href: "/panel/conferences",
      cardClassName: "bg-slate-700",
      linkClassName: "text-slate-200 hover:text-slate-100",
    },
    {
      label: "Immatriculations",
      value: registrationsCount,
      href: "/panel/registrations/dashboard",
      cardClassName: "bg-emerald-600",
      linkClassName: "text-emerald-200 hover:text-emerald-100",
    },
    {
      label: "Salon Honneur",
      value: honorLoungeCount,
      href: "/panel/honor-lounge/dashboard",
      cardClassName: "bg-zinc-700",
      linkClassName: "text-zinc-200 hover:text-zinc-100",
    },
    {
      label: "Autres",
      value: othersCount,
      href: "/panel/others/organisms",
      cardClassName: "bg-amber-500",
      linkClassName: "text-amber-100 hover:text-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex flex-col rounded-md p-4 text-white ${card.cardClassName}`}
        >
          <span className="text-3xl font-bold">
            {numberFormatter.format(card.value)}
          </span>
          <span className="text-xl">{card.label}</span>
          <Link
            className={`mt-2 flex items-center ${card.linkClassName}`}
            href={card.href}
          >
            <InfoIcon className="text-current" />
            <span className="ml-1">Plus de détails</span>
          </Link>
        </div>
      ))}
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
