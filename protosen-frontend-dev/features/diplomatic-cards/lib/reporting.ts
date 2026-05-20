import { fetchChildsCards, fetchDuplicateChildsCards, fetchRenewChildsCards } from "@/lib/actions/diplomaticCards/childs";
import {
	fetchDomesticAndRelativesCards,
	fetchDuplicateDomesticAndRelativesCards,
	fetchRenewDomesticAndRelativesCards,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import {
	fetchDuplicateHoldersCards,
	fetchHoldersCards,
	fetchRenewHoldersCards,
} from "@/lib/actions/diplomaticCards/holders";
import {
	fetchDuplicateOtherDependantsCards,
	fetchOtherDependantsCards,
	fetchRenewOtherDependantsCards,
} from "@/lib/actions/diplomaticCards/otherDependants";
import {
	fetchDuplicateOtherStaffsCards,
	fetchOtherStaffsCards,
	fetchRenewOtherStaffsCards,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import {
	fetchDuplicateSpousesCards,
	fetchRenewSpousesCards,
	fetchSpousesCards,
} from "@/lib/actions/diplomaticCards/spouses";
import type { DashboardReportSection } from "@/lib/dashboard-report-export";

export type DiplomaticReportType = "new-requests" | "renewals" | "duplicates" | "total";

export type DiplomaticReportRecord = {
	nom: string;
	prenoms: string;
	telephone: string;
	numeroCarte: string;
	dateDemande: string;
	dateImpressionCarte: string;
	fonctionTitulaire: string;
	etatDemande: string;
	institutionTitulaire: string;
	fonctionDemandeur: string;
	dateExpirationCarte: string;
};

export const DIPLOMATIC_REPORT_HEADERS = [
	"Nom",
	"Prénoms",
	"Numéro de Téléphone",
	"Numéro de carte",
	"Date de la demande",
	"Date de l'impression de la carte",
	"Fonction du Titulaire",
	"État de la demande",
	"Institution du Titulaire de la carte",
	"Fonction du demandeur de la carte",
	"Date d'Expiration de la carte",
];

type FetchResult = {
	status?: string;
	data?: {
		rows?: unknown[];
	};
};

const asRecord = (value: unknown): Record<string, unknown> =>
	value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	return String(value).trim();
};

const getRequesterFunction = (row: Record<string, unknown>): string => {
	const creator = asRecord(row.creator);
	const requester = asRecord(row.requester);
	const user = asRecord(row.user);
	return (
		asString(row.requesterJobFunction) ||
		asString(row.requesterFunction) ||
		asString(creator.jobFunction) ||
		asString(creator.function) ||
		asString(requester.jobFunction) ||
		asString(requester.function) ||
		asString(user.jobFunction) ||
		asString(user.function)
	);
};

const mapRowToReportRecord = (row: Record<string, unknown>): DiplomaticReportRecord => {
	const previousCard = asRecord(row.previousCard);
	const rowOrganism = asRecord(row.organism);
	const previousOrganism = asRecord(previousCard.organism);
	const ownerCard = asRecord(row.ownerDiplomaticCard);
	const ownerCardOrganism = asRecord(ownerCard.organism);

	return {
		nom: asString(row.lastName) || asString(previousCard.lastName),
		prenoms: asString(row.firstName) || asString(previousCard.firstName),
		telephone: asString(row.phone) || asString(previousCard.phone),
		numeroCarte: asString(row.cardNumber) || asString(previousCard.cardNumber),
		dateDemande: asString(row.createdAt) || asString(previousCard.createdAt),
		dateImpressionCarte:
			asString(row.issueDate) ||
			asString(previousCard.issueDate) ||
			asString(ownerCard.issueDate),
		fonctionTitulaire:
			asString(row.jobFunction) ||
			asString(previousCard.jobFunction) ||
			asString(ownerCard.jobFunction),
		etatDemande: asString(row.documentStage) || asString(previousCard.documentStage),
		institutionTitulaire:
			asString(rowOrganism.libelle) ||
			asString(previousOrganism.libelle) ||
			asString(ownerCardOrganism.libelle),
		fonctionDemandeur: getRequesterFunction(row),
		dateExpirationCarte:
			asString(row.validUntil) ||
			asString(previousCard.validUntil) ||
			asString(row.travellingTitleValidUntil) ||
			asString(previousCard.travellingTitleValidUntil),
	};
};

const normalizeRows = (result: FetchResult): Record<string, unknown>[] => {
	if (result?.status !== "success") return [];
	if (!Array.isArray(result?.data?.rows)) return [];
	return result.data.rows.map((row) => asRecord(row));
};

const fetchNewRequestsRows = async (): Promise<Record<string, unknown>[]> => {
	const results = await Promise.all([
		fetchHoldersCards(),
		fetchSpousesCards(),
		fetchChildsCards(),
		fetchOtherDependantsCards(),
		fetchOtherStaffsCards(),
		fetchDomesticAndRelativesCards(),
	]);

	return results.flatMap((result) => normalizeRows(result as FetchResult));
};

const fetchRenewalsRows = async (): Promise<Record<string, unknown>[]> => {
	const results = await Promise.all([
		fetchRenewHoldersCards(),
		fetchRenewSpousesCards(),
		fetchRenewChildsCards(),
		fetchRenewOtherDependantsCards(),
		fetchRenewOtherStaffsCards(),
		fetchRenewDomesticAndRelativesCards(),
	]);

	return results.flatMap((result) => normalizeRows(result as FetchResult));
};

const fetchDuplicatesRows = async (): Promise<Record<string, unknown>[]> => {
	const results = await Promise.all([
		fetchDuplicateHoldersCards(),
		fetchDuplicateSpousesCards(),
		fetchDuplicateChildsCards(),
		fetchDuplicateOtherDependantsCards(),
		fetchDuplicateOtherStaffsCards(),
		fetchDuplicateDomesticAndRelativesCards(),
	]);

	return results.flatMap((result) => normalizeRows(result as FetchResult));
};

export const getDiplomaticReportData = async (
	type: DiplomaticReportType
): Promise<DiplomaticReportRecord[]> => {
	if (type === "new-requests") {
		return (await fetchNewRequestsRows()).map(mapRowToReportRecord);
	}

	if (type === "renewals") {
		return (await fetchRenewalsRows()).map(mapRowToReportRecord);
	}

	if (type === "duplicates") {
		return (await fetchDuplicatesRows()).map(mapRowToReportRecord);
	}

	const [newRequestsRows, renewalsRows, duplicatesRows] = await Promise.all([
		fetchNewRequestsRows(),
		fetchRenewalsRows(),
		fetchDuplicatesRows(),
	]);

	return [...newRequestsRows, ...renewalsRows, ...duplicatesRows].map(
		mapRowToReportRecord
	);
};

export const recordsToReportSection = (
	title: string,
	records: DiplomaticReportRecord[]
): DashboardReportSection => ({
	title,
	headers: DIPLOMATIC_REPORT_HEADERS,
	rows: records.map((record) => [
		record.nom,
		record.prenoms,
		record.telephone,
		record.numeroCarte,
		record.dateDemande,
		record.dateImpressionCarte,
		record.fonctionTitulaire,
		record.etatDemande,
		record.institutionTitulaire,
		record.fonctionDemandeur,
		record.dateExpirationCarte,
	]),
});
