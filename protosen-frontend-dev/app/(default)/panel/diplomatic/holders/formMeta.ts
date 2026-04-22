import { z } from "zod";
import type { InputComponentProps } from "@/components/inputComponent";
import { getValidationSchema } from "@/components/utils/utils";

// extends InputComponentProps, add validation property
export interface IHolderNewRequestFormMeta extends InputComponentProps {
	validation?: z.ZodType;
}

export const personalData: IHolderNewRequestFormMeta[] = [
	{
		label: "Titre",
		name: "title",
		required: true,
		type: "select",
		validation: z.string(),
		options: [
			{ label: "Selectionnez un titre", value: "" },
			{ label: "M.", value: "M." },
			{ label: "Mme", value: "Mme" },
		],
	},
	{
		label: "Prénoms",
		name: "firstName",
		validation: z.string(),
		required: true,
	},
	{ label: "Nom(s)", name: "lastName", validation: z.string(), required: true },
	{
		label: "Nationalité",
		name: "citizenship",
		validation: z.string(),
		required: true,
		type: "select-citizenship",
	},
	{
		label: "Pays de naissance",
		name: "countryOfBirth",
		validation: z.string(),
		required: true,
		type: "select-country",
	},
	{
		label: "Lieu de naissance",
		name: "placeOfBirth",
		validation: z.string(),
		required: true,
	},
	{
		label: "Date de naissance",
		name: "dateOfBirth",
		validation: z.string(),
		type: "date",
		required: true,
	},
	{
		label: "Sexe",
		name: "gender",
		validation: z.string(),
		type: "select",
		options: [
			{ label: "Selectionnez une valeur", value: "" },
			{ label: "Masculin", value: "Masculin" },
			{ label: "Féminin", value: "Féminin" },
		],
		required: true,
	},
	{
		label: "Situation matrimoniale",
		name: "matrimonialStatus",
		validation: z.string(),
		type: "select",
		options: [
			{ label: "Selectionnez une situation", value: "" },
			{ label: "Marié(e)", value: "marié(e)" },
			{ label: "Célibataire", value: "celibataire" },
			{ label: "Divorcé(e)", value: "divorcé(e)" },
		],
		required: true,
	},
	{
		label: "Numéro de téphone",
		name: "phone",
		validation: z.string(),
		required: true,
	},
	{
		label: "Email",
		name: "email",
		type: "email",
		validation: z.string(),
		required: true,
	},
];

export const professionalData: IHolderNewRequestFormMeta[] = [
	{
		label: "Rang/Grade",
		name: "grade",
		required: true,
		validation: z.string(),
	},
	{
		label: "Fonction",
		name: "jobFunction",
		required: true,
		validation: z.string(),
	},
	{
		label: "Personne remplacée",
		placeholder: "Nom et prénoms",
		name: "personReplaced",
		validation: z.string().min(0),
		supportingText: "Laissé vide si il n'y a pas de personne remplacée",
	},
	{
		label: "Carte numéro",
		name: "cardNumber",
		disabled: true,
	},
];

export const titleOfTrip: IHolderNewRequestFormMeta[] = [
	{ label: "Numéro", name: "travellingNumber", validation: z.string() },
	{
		label: "Selectionnez un type",
		name: "travellingTitleType",
		validation: z.string(),
		type: "select-creatable",
		options: [
			{ label: "Passeport Diplomatique", value: "Passeport Diplomatique" },
			{ label: "Passeport Service", value: "Passeport Service" },
			{ label: "Passeport Ordinaire", value: "Passeport Ordinaire" },
			{ label: "Laisser-Passer", value: "Laisser-Passer" },
		],
		required: true,
	},
	{
		label: "Délivré à",
		name: "deliverAt",
		validation: z.string(),
		required: true,
	},
	{ label: "Par", name: "deliverBy", validation: z.string(), required: true },
	{
		label: "Le",
		name: "deliverThe",
		validation: z.string(),
		type: "date",
		required: true,
	},
	{
		label: "Valable jusqu'au",
		name: "travellingTitleValidUntil",
		validation: z.string().min(1, { message: "Veuillez entrer une date" }).refine(
			(dateString) => {
				const date = new Date(dateString);
				const sixMonthsFromNow = new Date();
				sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
				return date >= sixMonthsFromNow;
			},
			{ message: "La date d'expiration doit être valide pour au moins 6 mois" }
		),
		type: "date",
		required: true,
	},
];

export const stayInSenegal: IHolderNewRequestFormMeta[] = [
	{
		label: "Date d’arrivée au Sénégal",
		name: "dateArrivalSenegal",
		validation: z.string(),
		type: "date",
		required: true,
	},
	{
		label: "Date de prise de fonction",
		name: "dateTakingOffice",
		validation: z.string(),
		type: "date",
		required: true,
	},
	{
		label: "Date prévue de fin de mission/contrat",
		name: "dateEndOfMission",
		validation: z.string(),
		type: "date",
	},
	{
		label: "Adresse au Sénégal",
		name: "adressSenegal",
		validation: z.string(),
		required: true,
	},
];

export const lastAddressAbroad: IHolderNewRequestFormMeta[] = [
	{
		label: "Ville",
		name: "lastCityAbroad",
		validation: z.string(),
		required: true,
	},
	{
		label: "Pays",
		name: "lastCountryAbroad",
		validation: z.string(),
		required: true,
		type: "select-country",
	},
	{
		label: "Rue",
		name: "lastStreetAbroad",
		validation: z.string(),
		required: true,
	},
];

export const previousJob: IHolderNewRequestFormMeta[] = [
	{
		label: "Pays",
		name: "latestOfWorkCountry",
		validation: z.string(),
		required: true,
		type: "select-country",
	},
	{
		label: "Structure",
		name: "latestWorkStructure",
		validation: z.string(),
		required: true,
	},
	{
		label: "Date de cessation",
		name: "lastestWorkDate",
		validation: z.string(),
		type: "date",
		required: true,
	},
];

export const formSections = [
	{
		title: "Informations personnelles",
		data: personalData,
	},
	{
		title: "Informations professionnelles",
		data: professionalData,
		supportingText:
			"(Grade à préciser pour personnel des OI et personnel militaire)",
	},
	{
		title: "Titre de voyage",
		data: titleOfTrip,
	},
	{
		title: "Séjour au Sénégal",
		data: stayInSenegal,
	},
	{
		title: "Dernière adresse à l’étranger",
		data: lastAddressAbroad,
	},
	{
		title: "Précédent emploi",
		data: previousJob,
	},
];

const validationSchema = getValidationSchema([
	...personalData,
	...professionalData,
	...titleOfTrip,
	...stayInSenegal,
	...lastAddressAbroad,
	...previousJob,
]);

export const schemaHolderNewRequest = z.object(validationSchema);
