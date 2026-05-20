import { parse as jsonToCsv } from "json2csv";
import { translateConferenceRegistrationStatus } from "./utils";
import type { ConferenceRegistration } from "../types";

const CSV_FIELDS = [
	{ label: "Nom", value: "lastName" },
	{ label: "Prénom", value: "firstName" },
	{
		label: "Genre",
		value: (row: ConferenceRegistration) =>
			row.gender === "MALE"
				? "Homme"
				: row.gender === "FEMALE"
					? "Femme"
					: "Autre",
	},
	{ label: "Email", value: "email" },
	{ label: "Téléphone", value: "phone" },
	{ label: "Organisation", value: "organisation" },
	{
		label: "Fonction",
		value: (row: ConferenceRegistration) =>
			row.functionModel?.name ?? row.customFunction ?? "",
	},
	{
		label: "Catégorie de participant",
		value: (row: ConferenceRegistration) =>
			row.conferenceParticipantType?.label ?? "",
	},
	{ label: "Ville", value: "city" },
	{ label: "Pays", value: "country" },
	{ label: "Code postal", value: "postalCode" },
	{ label: "Adresse", value: "address" },
	{ label: "Nationalité", value: "nationality" },
	{ label: "Date de naissance", value: "dateOfBirth" },
	{ label: "Type d'identité", value: "identityType" },
	{ label: "Numéro d'identité", value: "identityNumber" },
	{ label: "Date d'émission", value: "identityIssueDate" },
	{
		label: "Besoin de visa",
		value: (row: ConferenceRegistration) => (row.visaNeeded ? "Oui" : "Non"),
	},
	{
		label: "Options de prise en charge",
		value: (row: ConferenceRegistration) =>
			row.supportOptions
				?.map((s) => s.supportOption.label)
				.join(", ") ?? "",
	},
	{
		label: "Hébergement",
		value: (row: ConferenceRegistration) =>
			row.conferenceAccommodation?.accommodation?.name ?? "",
	},
	{
		label: "Hébergement personnalisé",
		value: (row: ConferenceRegistration) => row.customAccommodation ?? "",
	},
	{
		label: "Statut",
		value: (row: ConferenceRegistration) =>
			translateConferenceRegistrationStatus(row.subscriptionStatus),
	},
	{ label: "Date d'inscription", value: "createdAt" },
];

export function exportParticipantsToCSV(
	data: ConferenceRegistration[],
	filename = "participants",
) {
	if (data.length === 0) return;

	const csv = jsonToCsv(data, { fields: CSV_FIELDS });
	// BOM UTF-8 pour compatibilite Excel
	const bom = "\uFEFF";
	const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `${filename}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
