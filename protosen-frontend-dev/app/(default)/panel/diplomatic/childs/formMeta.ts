import { z } from "zod";
import type { InputComponentProps } from "@/components/inputComponent";
import { getValidationSchema } from "@/components/utils/utils";

// extends InputComponentProps, add validation property
export interface IChildNewRequestFormMeta extends InputComponentProps {
	validation?: z.ZodType;
}

export const personalData: IChildNewRequestFormMeta[] = [
	{
		label: "Titulaire",
		name: "ownerDiplomaticCardId",
		required: true,
		validation: z.string(),
		type: "select",
	},
	{
		label: "Titre",
		name: "holderTitle",
		disabled: true,
	},
	{
		label: "Dossier N°",
		name: "holderFileNumber",
		disabled: true,
	},
	{
		label: "Prénoms",
		name: "holderFirstName",
		disabled: true,
	},
	{
		label: "Nom(s)",
		name: "holderLastName",
		disabled: true,
	},
	{
		label: "Nationalité",
		name: "holderCitizenship",
		disabled: true,
	},
];

export const childData: IChildNewRequestFormMeta[] = [
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
	},
	{ label: "Prénoms", name: "firstName", validation: z.string() },
	{ label: "Nom(s)", name: "lastName", validation: z.string() },
	{
		label: "Nationalité",
		name: "citizenship",
		type: "select-citizenship",
		validation: z.string(),
	},
	{
		label: "Pays de naissance",
		name: "countryOfBirth",
		validation: z.string(),
		type: "select-country",
	},
	{
		label: "Date de naissance",
		name: "dateOfBirth",
		validation: z.string(),
		type: "date",
	},
	{ label: "Lieu de naissance", name: "placeOfBirth", validation: z.string() },
	{
		label: "Numéro de téléphone",
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

export const travelTitleData: IChildNewRequestFormMeta[] = [
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
	{ label: "Numéro", name: "travellingNumber", validation: z.string() },
	{ label: "Délivré à", name: "deliverAt", validation: z.string() },
	{ label: "Par", name: "deliverBy", validation: z.string() },
	{ label: "le", name: "deliverThe", validation: z.string(), type: "date" },
	{
		label: "Valable jusqu’au",
		name: "travellingTitleValidUntil",
		validation: z
			.string()
			.min(1, { message: "Veuillez entrer une date" })
			.refine(
				(dateString) => {
					const date = new Date(dateString);
					const sixMonthsFromNow = new Date();
					sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
					return date >= sixMonthsFromNow;
				},
				{
					message: "La date d'expiration doit être valide pour au moins 6 mois",
				},
			),
		type: "date",
	},
];

export const formSections = [
	{
		title: "Titulaire",
		data: personalData,
	},
	{
		title: "Enfant",
		data: childData,
	},
	{
		title: "Titre de voyage",
		data: travelTitleData,
	},
];

const validationSchema = getValidationSchema([
	...personalData,
	...childData,
	...travelTitleData,
]);

export const schemaChildNewRequest = z.object(validationSchema);
