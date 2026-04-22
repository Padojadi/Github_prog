import { getServerSession } from "next-auth";
import { parse as jsonToCsv } from "json2csv";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES, Backend_URL } from "@/lib/constants";

export type DashboardModuleKey =
  | "missions"
  | "cards"
  | "visas"
  | "exonerations"
  | "conferences"
  | "immatriculations"
  | "lounge"
  | "others";

type FetchJsonResult = {
  ok: boolean;
  status: number;
  data: any;
};

type CardSummary = {
  total: number;
  newRequests: number;
  printedCards: number;
  duplicateRequests: number;
  duplicatePrinted: number;
  renewRequests: number;
  renewPrinted: number;
};

type DashboardCounts = {
  missions: number;
  cards: number;
  visas: number;
  exonerations: number;
  conferences: number;
  immatriculations: number;
  lounge: number;
  others: number;
};

export type GeneralDashboardSummary = {
  counts: DashboardCounts;
  cardSummary: CardSummary;
  generatedAt: string;
};

const CARD_ENDPOINTS = {
  owner: {
    base: "/card/owner",
    renew: "/card/owner/renew",
    duplicata: "/card/owner/duplicata",
  },
  spouse: {
    base: "/card/spouse",
    renew: "/card/spouse/renew",
    duplicata: "/card/spouse/duplicata",
  },
  child: {
    base: "/card/child",
    renew: "/card/child/renew",
    duplicata: "/card/child/duplicata",
  },
  otherDependant: {
    base: "/card/other-dependant",
    renew: "/card/other-dependant/renew",
    duplicata: "/card/other-dependant/duplicata",
  },
  domesticAndRelative: {
    base: "/card/domestic-and-relative",
    renew: "/card/domestic-and-relative/renew",
    duplicata: "/card/domestic-and-relative/duplicata",
  },
  otherStaff: {
    base: "/card/other-staff",
    renew: "/card/other-staff/renew",
    duplicata: "/card/other-staff/duplicata",
  },
} as const;

const MISSION_TYPES = [
  "AMBASSADE",
  "CONSULAT",
  "SYSTEME_NATIONS_UNIES",
  "ORGANISATION_AFRICAINE",
  "ORGANISATION_INTERNATIONALE",
  "BANQUES_ET_IF",
  "FONDATIONS_ET_ONG",
] as const;

const DEFAULT_DASHBOARD_COUNTS: DashboardCounts = {
  missions: 0,
  cards: 0,
  visas: 0,
  exonerations: 0,
  conferences: 0,
  immatriculations: 0,
  lounge: 0,
  others: 0,
};

const tryJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getBearerToken = async () => {
  const session = await getServerSession(authOptions);
  return session?.backendTokens?.accessToken || null;
};

const buildHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const getItemsFromPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data?.rows)) {
    return payload.data.rows;
  }
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }
  return [];
};

const getTotalFromPayload = (payload: any) => {
  if (typeof payload?.total === "number") {
    return payload.total;
  }
  if (typeof payload?.data?.total === "number") {
    return payload.data.total;
  }
  if (typeof payload?.data?.count === "number") {
    return payload.data.count;
  }
  if (typeof payload?.count === "number") {
    return payload.count;
  }
  return getItemsFromPayload(payload).length;
};

const fetchJson = async (
  url: string,
  token: string | null,
  cache: RequestCache = "no-store",
): Promise<FetchJsonResult> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(token),
      cache,
    });
    const text = await response.text();
    const data = text ? tryJsonParse(text) ?? text : null;
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      data: null,
    };
  }
};

const getCsvHeaders = (
  rows: Record<string, unknown>[],
): { label: string; value: string }[] => {
  const keys = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => keys.add(key));
  });
  return Array.from(keys).map((key) => ({
    label: key,
    value: key,
  }));
};

const toCsvBuffer = (
  rows: Record<string, unknown>[],
  fallbackHeaders?: { label: string; value: string }[],
) => {
  const headers =
    rows.length > 0
      ? getCsvHeaders(rows)
      : fallbackHeaders && fallbackHeaders.length > 0
        ? fallbackHeaders
        : [{ label: "Aucune donnée", value: "message" }];
  const safeRows =
    rows.length > 0
      ? rows
      : [
          {
            message: "Aucune donnée disponible pour cette rubrique.",
          },
        ];
  const csv = jsonToCsv(safeRows, { fields: headers });
  return Buffer.from(`\uFEFF${csv}`, "utf-8");
};

const normalizeMissionType = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase();

const missionLabelByType: Record<(typeof MISSION_TYPES)[number], string> = {
  AMBASSADE: "Ambassades",
  CONSULAT: "Consulats",
  SYSTEME_NATIONS_UNIES: "Système des Nations Unies",
  ORGANISATION_AFRICAINE: "Organisation Africaine",
  ORGANISATION_INTERNATIONALE: "Organisations Internationales",
  BANQUES_ET_IF: "Banques & IF",
  FONDATIONS_ET_ONG: "Fondations & ONG",
};

const extractConferencesData = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }
  return [];
};

const classifyMissionType = (rawType: string): (typeof MISSION_TYPES)[number] | null => {
  const normalizedType = normalizeMissionType(rawType);

  if (normalizedType.includes("AMBASSADE")) {
    return "AMBASSADE";
  }
  if (normalizedType.includes("CONSULAT") || normalizedType.includes("CONSULTAT")) {
    return "CONSULAT";
  }
  if (
    normalizedType.includes("NATIONS_UNIES") ||
    normalizedType.includes("SYSTEME_NATIONS_UNIES")
  ) {
    return "SYSTEME_NATIONS_UNIES";
  }
  if (
    normalizedType.includes("ORGANISATION_AFRICAINE") ||
    normalizedType.includes("UNION_AFRICAINE")
  ) {
    return "ORGANISATION_AFRICAINE";
  }
  if (
    normalizedType.includes("ORGANISATION_INTERNATIONALE") ||
    normalizedType.includes("ORG_INTERNATIONALE")
  ) {
    return "ORGANISATION_INTERNATIONALE";
  }
  if (normalizedType.includes("BANQUE") || normalizedType.includes("IF")) {
    return "BANQUES_ET_IF";
  }
  if (normalizedType.includes("FONDATION") || normalizedType.includes("ONG")) {
    return "FONDATIONS_ET_ONG";
  }

  return null;
};

const aggregateCards = async (token: string | null) => {
  const endpoints = Object.values(CARD_ENDPOINTS).flatMap((entry) => [
    { key: "base", path: entry.base },
    { key: "renew", path: entry.renew },
    { key: "duplicata", path: entry.duplicata },
  ]);

  const requests = await Promise.all(
    endpoints.map(async (endpoint) => ({
      key: endpoint.key,
      result: await fetchJson(`${Backend_URL}${endpoint.path}`, token),
    })),
  );

  let newRequests = 0;
  let printedCards = 0;
  let duplicateRequests = 0;
  let duplicatePrinted = 0;
  let renewRequests = 0;
  let renewPrinted = 0;

  for (const request of requests) {
    const rows = getItemsFromPayload(request.result.data);
    if (request.key === "base") {
      newRequests += rows.length;
      printedCards += rows.filter((row) => row?.documentStage === "printed").length;
    } else if (request.key === "renew") {
      renewRequests += rows.length;
      renewPrinted += rows.filter((row) => row?.documentStage === "printed").length;
    } else if (request.key === "duplicata") {
      duplicateRequests += rows.length;
      duplicatePrinted += rows.filter((row) => row?.documentStage === "printed").length;
    }
  }

  return {
    summary: {
      total: newRequests + renewRequests + duplicateRequests,
      newRequests,
      printedCards,
      duplicateRequests,
      duplicatePrinted,
      renewRequests,
      renewPrinted,
    } satisfies CardSummary,
    requests,
  };
};

const aggregateMissions = async (token: string | null) => {
  const rowsByType: Record<string, any[]> = Object.fromEntries(
    MISSION_TYPES.map((type) => [type, []]),
  );
  const allInstitutions = await fetchJson(
    `${Backend_URL}/institution?limit=10000&page=1`,
    token,
  );
  const rows = getItemsFromPayload(allInstitutions.data);

  for (const row of rows) {
    const bucketType = classifyMissionType(
      String(row?.institutionType || row?.TypeOrganisme || ""),
    );
    if (bucketType) {
      rowsByType[bucketType].push(row);
    }
  }

  return rowsByType;
};

const getConferencesRows = async (token: string | null) => {
  const conferenceStatuses = [
    "PENDING",
    "ACCEPTED",
    "VALIDATED",
    "CONFIRMED",
    "REJECTED",
    "REJECTED_PERMANENTLY",
    "PUBLISHED",
  ];

  const params = new URLSearchParams();
  params.set("limit", "10000");
  params.set("page", "1");
  conferenceStatuses.forEach((status) => params.append("status", status));
  const url = `${BACKEND_URL_CONFERENCES}/conference?${params.toString()}`;
  const response = await fetchJson(url, token);
  return extractConferencesData(response.data);
};

const getLoungeRows = async (token: string | null) => {
  const params = new URLSearchParams();
  params.set("limit", "10000");
  params.set("page", "1");
  const loungesResponse = await fetchJson(
    `${BACKEND_URL_CONFERENCES}/lounge?${params.toString()}`,
    token,
  );
  const bookingsResponse = await fetchJson(
    `${BACKEND_URL_CONFERENCES}/lounge/bookings?${params.toString()}`,
    token,
  );

  return {
    lounges: getItemsFromPayload(loungesResponse.data),
    bookings: getItemsFromPayload(bookingsResponse.data),
  };
};

const getVisaRows = async (token: string | null) => {
  const params = new URLSearchParams();
  params.set("limit", "10000");
  params.set("page", "1");
  const response = await fetchJson(`${BACKEND_URL_CONFERENCES}/visa?${params.toString()}`, token);
  return getItemsFromPayload(response.data);
};

const getVisaKpiSummary = async (token: string | null) => {
  const response = await fetchJson(`${BACKEND_URL_CONFERENCES}/visa/kpis/summary`, token);
  if (response.ok && response.data && typeof response.data === "object") {
    return response.data as {
      total?: number;
      submitted?: number;
      autoVerified?: number;
      validated?: number;
      rejected?: number;
      notified?: number;
      issued?: number;
      withdrawn?: number;
      rejectionRate?: number;
      deliveryRate?: number;
      avgProcessingHours?: number;
    };
  }
  return null;
};

export const getGeneralDashboardSummary = async (): Promise<GeneralDashboardSummary> => {
  const token = await getBearerToken();

  const [cards, missionsByType, conferences, loungeRows, visaRows, organisms, plates, cardTypes] =
    await Promise.all([
      aggregateCards(token),
      aggregateMissions(token),
      getConferencesRows(token),
      getLoungeRows(token),
      getVisaRows(token),
      fetchJson(`${Backend_URL}/institution?limit=10000&page=1`, token),
      fetchJson(`${Backend_URL}/plaque`, token),
      fetchJson(`${Backend_URL}/card-types`, token),
    ]);

  const missionsCount = Object.values(missionsByType).reduce(
    (acc, rows) => acc + rows.length,
    0,
  );

  const othersCount =
    getTotalFromPayload(organisms.data) +
    getTotalFromPayload(plates.data) +
    getTotalFromPayload(cardTypes.data);

  return {
    counts: {
      ...DEFAULT_DASHBOARD_COUNTS,
      missions: missionsCount,
      cards: cards.summary.total,
      visas: visaRows.length,
      conferences: conferences.length,
      lounge: loungeRows.bookings.length,
      immatriculations: getTotalFromPayload(plates.data),
      others: othersCount,
    },
    cardSummary: cards.summary,
    generatedAt: new Date().toISOString(),
  };
};

export const exportModuleCsv = async (moduleKey: DashboardModuleKey) => {
  const token = await getBearerToken();
  const generatedAt = new Date().toISOString();

  if (moduleKey === "cards") {
    const cards = await aggregateCards(token);
    const rows = [
      {
        "Nouvelles demandes": cards.summary.newRequests,
        "Cartes imprimées": cards.summary.printedCards,
        "Demandes de duplicata": cards.summary.duplicateRequests,
        "Duplicatas imprimés": cards.summary.duplicatePrinted,
        "Demandes de renouvellement": cards.summary.renewRequests,
        "Renouvellements imprimés": cards.summary.renewPrinted,
        "Total général": cards.summary.total,
      },
    ];

    return {
      fileName: `dashboard-cartes-${generatedAt}.csv`,
      buffer: toCsvBuffer(rows),
    };
  }

  if (moduleKey === "missions") {
    const rowsByType = await aggregateMissions(token);
    const rows = Object.entries(rowsByType).flatMap(([type, items]) => {
      const label =
        missionLabelByType[type as keyof typeof missionLabelByType] || type;
      return items.map((item: any) => ({
        categorie: label,
        code: item?.code || "",
        libelle: item?.libelle || "",
        service: item?.service || "",
        statut: item?.status || "",
        creeLe: item?.createdAt || "",
      }));
    });

    return {
      fileName: `dashboard-missions-${generatedAt}.csv`,
      buffer: toCsvBuffer(rows, [
        { label: "categorie", value: "categorie" },
        { label: "code", value: "code" },
        { label: "libelle", value: "libelle" },
        { label: "service", value: "service" },
        { label: "statut", value: "statut" },
        { label: "creeLe", value: "creeLe" },
      ]),
    };
  }

  if (moduleKey === "conferences") {
    const rows = await getConferencesRows(token);
    const mapped = rows.map((item: any) => ({
      id: item?.id || "",
      titre: item?.title || "",
      organisateur: [item?.firstName, item?.lastName].filter(Boolean).join(" "),
      email: item?.email || "",
      telephone: item?.phone || "",
      lieu: item?.location || "",
      statut: item?.lastStatus || "",
      participantsPayes: item?._count?.participants ?? 0,
      dateDebut: item?.startDate || "",
      dateFin: item?.endDate || "",
      creeLe: item?.createdAt || "",
    }));
    return {
      fileName: `dashboard-conferences-${generatedAt}.csv`,
      buffer: toCsvBuffer(mapped),
    };
  }

  if (moduleKey === "lounge") {
    const data = await getLoungeRows(token);
    const mapped = data.bookings.map((booking: any) => ({
      id: booking?.id || "",
      salon: booking?.lounge?.name || "",
      inviteNom:
        [booking?.guestFirstName, booking?.guestLastName]
          .filter(Boolean)
          .join(" ") || "",
      organisation: booking?.guestOrganization || "",
      debut: booking?.startTime || "",
      fin: booking?.endTime || "",
      statut: booking?.status || "",
      paiement: booking?.paymentStatus || "",
      montant: booking?.totalAmount ?? 0,
      creeLe: booking?.createdAt || "",
    }));
    return {
      fileName: `dashboard-salon-honneur-${generatedAt}.csv`,
      buffer: toCsvBuffer(mapped),
    };
  }

  if (moduleKey === "immatriculations") {
    const platesResponse = await fetchJson(`${Backend_URL}/plaque`, token);
    const rows = getItemsFromPayload(platesResponse.data);
    const mapped = rows.map((item: any) => ({
      id: item?.id || "",
      code: item?.code || "",
      libelle: item?.libelle || "",
      description: item?.description || "",
      creeLe: item?.createdAt || "",
      modifieLe: item?.updatedAt || "",
    }));
    return {
      fileName: `dashboard-immatriculations-${generatedAt}.csv`,
      buffer: toCsvBuffer(mapped),
    };
  }

  if (moduleKey === "others") {
    const [organismsResponse, cardTypesResponse, platesResponse, accessGroupsResponse, usersResponse] =
      await Promise.all([
        fetchJson(`${Backend_URL}/institution?limit=10000&page=1`, token),
        fetchJson(`${Backend_URL}/card-types`, token),
        fetchJson(`${Backend_URL}/plaque`, token),
        fetchJson(`${Backend_URL}/accessgroup`, token),
        fetchJson(`${Backend_URL}/user/all?limit=10000&page=1`, token),
      ]);

    const organismRows = getItemsFromPayload(organismsResponse.data).map(
      (row: any) => ({
        type: "Organisme",
        id: row?.id || "",
        nom: row?.libelle || "",
        code: row?.code || "",
        details: row?.institutionType || "",
      }),
    );

    const cardTypeRows = getItemsFromPayload(cardTypesResponse.data).map(
      (row: any) => ({
        type: "Type de carte",
        id: row?.id || "",
        nom: row?.name || row?.libelle || "",
        code: row?.code || "",
        details: row?.description || "",
      }),
    );

    const plateRows = getItemsFromPayload(platesResponse.data).map((row: any) => ({
      type: "Plaque",
      id: row?.id || "",
      nom: row?.libelle || "",
      code: row?.code || "",
      details: row?.description || "",
    }));

    const accessGroupRows = getItemsFromPayload(accessGroupsResponse.data).map(
      (row: any) => ({
        type: "Groupe d'accès",
        id: row?.id || "",
        nom: row?.name || "",
        code: "",
        details: Array.isArray(row?.permissions)
          ? row.permissions.join(", ")
          : "",
      }),
    );

    const userRows = getItemsFromPayload(usersResponse.data).map((row: any) => ({
      type: "Utilisateur",
      id: row?.id || "",
      nom: `${row?.first_name || ""} ${row?.last_name || ""}`.trim(),
      code: row?.email || "",
      details: row?.role || "",
    }));

    const rows = [
      ...organismRows,
      ...cardTypeRows,
      ...plateRows,
      ...accessGroupRows,
      ...userRows,
    ];
    return {
      fileName: `dashboard-autres-${generatedAt}.csv`,
      buffer: toCsvBuffer(rows),
    };
  }

  if (moduleKey === "visas") {
    const [rows, kpis] = await Promise.all([getVisaRows(token), getVisaKpiSummary(token)]);
    const mapped = rows.map((item: any) => ({
      id: item?.id || "",
      dossierNumber: item?.dossierNumber || "",
      visaNumber: item?.visaNumber || "",
      prenom: item?.firstName || "",
      nom: item?.lastName || "",
      dateNaissance: item?.dateOfBirth || "",
      nationalite: item?.nationality || "",
      numeroPasseport: item?.passportNumber || "",
      typeVisa: item?.visaType || "",
      statutWorkflow: item?.currentStatus || "",
      decisionValidation: item?.validationDecision || "",
      scoreAutomatique: item?.automaticScore ?? "",
      analyseDpi: item?.dpiAnalysis || "",
      motifRejet: item?.rejectionReason || "",
      dateNotification: item?.notificationSentAt || "",
      dateEmission: item?.issuedAt || "",
      dateRetrait: item?.withdrawalDate || item?.withdrawnAt || "",
      collecteur: item?.collectorName || "",
      pieceCollecteur: item?.collectorIdentityDocument || "",
      creeLe: item?.createdAt || "",
      modifieLe: item?.updatedAt || "",
    }));

    const kpiRow = kpis
      ? [
          {
            id: "KPI",
            dossierNumber: "",
            visaNumber: "",
            prenom: "",
            nom: "",
            dateNaissance: "",
            nationalite: "",
            numeroPasseport: "",
            typeVisa: "RESUME_KPI",
            statutWorkflow: "",
            decisionValidation: "",
            scoreAutomatique: "",
            analyseDpi: `total=${kpis.total ?? 0}; soumises=${kpis.submitted ?? 0}; autoVerifiees=${kpis.autoVerified ?? 0}; validees=${kpis.validated ?? 0}; rejetees=${kpis.rejected ?? 0}; notifiees=${kpis.notified ?? 0}; emises=${kpis.issued ?? 0}; retirees=${kpis.withdrawn ?? 0}`,
            motifRejet: `tauxRejet=${kpis.rejectionRate ?? 0}%`,
            dateNotification: "",
            dateEmission: `tauxDelivrance=${kpis.deliveryRate ?? 0}%`,
            dateRetrait: `tempsTraitementMoyenHeures=${kpis.avgProcessingHours ?? 0}`,
            collecteur: "",
            pieceCollecteur: "",
            creeLe: "",
            modifieLe: "",
          },
        ]
      : [];

    return {
      fileName: `dashboard-visas-${generatedAt}.csv`,
      buffer: toCsvBuffer([...mapped, ...kpiRow]),
    };
  }

  // Placeholder modules expected by the business dashboard.
  const emptyTemplateByModule: Record<
    Exclude<
      DashboardModuleKey,
      "cards" | "missions" | "conferences" | "lounge" | "immatriculations" | "others" | "visas"
    >,
    { label: string; value: string }[]
  > = {
    exonerations: [
      { label: "rubrique", value: "rubrique" },
      { label: "description", value: "description" },
      { label: "valeur", value: "valeur" },
    ],
  };

  const placeholderRows = [
    {
      rubrique: "Demandes d'exonération",
      description:
        "Source de données non disponible dans le backend actuel (structure d'export prête).",
      valeur: 0,
    },
  ];

  return {
    fileName: `dashboard-${moduleKey}-${generatedAt}.csv`,
    buffer: toCsvBuffer(placeholderRows, emptyTemplateByModule[moduleKey as "exonerations"]),
  };
};
