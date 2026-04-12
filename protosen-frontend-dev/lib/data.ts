import React from "react";
import type { IconBaseProps } from "react-icons";
import {
	BsCreditCard2Back,
	BsGrid1X2,
	BsPeople,
	BsSliders,
	BsStickies,
} from "react-icons/bs";
import type { permissions } from "@/features/users/access-roles/lib/data";

export enum DiplomaticEntity {
	CD = "Carte d'Identité Corps Diplomatique",
	CC = "Carte d'Identité Corps Consulaire",
	OI = "Carte d'Identité Organisation Internationale",
}

type Ilink = {
	href: string;
	label: string;
	icon?: React.FunctionComponentElement<IconBaseProps>;
	children?: Ilink[];
	accessPermissions: (typeof permissions)[number]["value"][];
};

const states = [
	{ code: "request", label: "Nouvelle demande" },
	{ code: "renew", label: "Renouvellement" },
	{ code: "duplicates", label: "Duplicatas" },
	{ code: "printed-cards", label: "Cartes imprimées" },
	{ code: "renew/renew-printed-cards", label: "Renouvellement imprimés" },
	{ code: "duplicates/duplicate-printed-cards", label: "Duplicatas imprimés" },
	{ code: "returned-cards", label: "Cartes restituées" },
	{ code: "renew/renew-returned-cards", label: "Renouvellement restitués" },
	{
		code: "duplicates/duplicate-returned-cards",
		label: "Duplicatas restitués",
	},
];

const persons = [
	{ code: "holders", label: "Titulaire" },
	{ code: "spouses", label: "Époux(se)" },
	{ code: "childs", label: "Enfants du Titulaire" },
	{ code: "other-dependants", label: "Autres Dépendants" },
	{
		code: "domestics-and-relatives",
		label: "Personnel de service, domestiques et familles",
	},
	{ code: "other-staff", label: "Autres personnels" },
];

const diplomaticMenu: Ilink[] = persons.map((person) => ({
	href: `/panel/diplomatic/${person.code}`,
	label: person.label,
	children: states.map((state) => ({
		href:
			state.code === "request"
				? `/panel/diplomatic/${person.code}`
				: `/panel/diplomatic/${person.code}/${state.code}`,
		label: state.label,
		accessPermissions: ["ACCESS_CARD_MODULE"],
	})),
	accessPermissions: ["ACCESS_CARD_MODULE"],
}));

diplomaticMenu.unshift({
	href: "/panel/diplomatic/dashboard",
	label: "Dashboard",
	accessPermissions: ["ACCESS_CARD_MODULE"],
});

const conferencesMenu: Ilink[] = [
	{
		href: "/panel/conferences",
		label: "Conférences",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/conferences/new-requests",
		label: "Nouvelles demandes",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/conferences/accommodations",
		label: "Hébergements",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: `/panel/conferences/participant-types`,
		label: "Catégories de participant",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE", "MANAGE_CONFERENCES"],
	},
	{
		href: `/panel/conferences/job-titles`,
		label: "Fonctions",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE", "MANAGE_CONFERENCES"],
	},
	{
		href: `/panel/conferences/support-categories`,
		label: "Catégories de prise en charge",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE", "MANAGE_CONFERENCES"],
	},
];

const othersMenu: Ilink[] = [
	{
		href: `/panel/others/type-of-cards`,
		label: "Types de cartes",
		accessPermissions: [],
	},
	{
		href: `/panel/others/organisms`,
		label: "Organismes",
		accessPermissions: [],
	},
	{
		href: `/panel/others/plates`,
		label: "Plaques",
		accessPermissions: [],
	},
];

const usersMenu: Ilink[] = [
	{
		href: "/panel/users",
		label: "Liste des utilisateurs",
		accessPermissions: [],
	},
	{
		href: "/panel/users/access-roles",
		label: "Groupes d'accès",
		accessPermissions: [],
	},
];

const honorLoungeMenu: Ilink[] = [
	{
		href: "/panel/honor-lounge",
		label: "Salons",
		accessPermissions: ["ACCESS_HONOR_LOUNGE_MODULE"],
	},
	{
		href: "/panel/honor-lounge/bookings/new",
		label: "Nouvelle réservation",
		accessPermissions: ["ACCESS_HONOR_LOUNGE_MODULE"],
	},
	{
		href: "/panel/honor-lounge/bookings",
		label: "Mes réservations",
		accessPermissions: ["ACCESS_HONOR_LOUNGE_MODULE"],
	},
	{
		href: "/panel/honor-lounge/manage",
		label: "Gestion des salons",
		accessPermissions: ["ACCESS_HONOR_LOUNGE_MODULE", "MANAGE_CONFERENCES"],
	},
];

export const links: Ilink[] = [
	// {
	//   href: "/panel/missions",
	//   label: "Missions",
	//   children: [...missionsMenu],
	//   icon: React.createElement(BsCrosshair, { size: 16 }),
	// },
	{
		href: "/panel/diplomatic",
		label: "Carte diplomatique",
		icon: React.createElement(BsCreditCard2Back, { size: 16 }),
		children: [...diplomaticMenu],
		accessPermissions: ["ACCESS_CARD_MODULE"],
	},
	// {
	//   href: "/panel/visas",
	//   label: "Visas",
	//   icon: React.createElement(BsCreditCard2Front, { size: 16 }),
	// },
	// {
	//   href: "/panel/exemptions",
	//   label: "Exonérations",
	//   icon: React.createElement(BsFolder2Open, { size: 16 }),
	// },
	{
		href: "/panel/conferences",
		label: "Conférences",
		icon: React.createElement(BsGrid1X2, { size: 16 }),
		children: [...conferencesMenu],
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	// {
	//   href: "/panel/registrations",
	//   label: "Immatriculations",
	//   icon: React.createElement(BsFillPersonVcardFill, { size: 16 }),
	// },
	{
		href: "/panel/honor-lounge",
		label: "Salon d'honneur",
		icon: React.createElement(BsSliders, { size: 16 }),
		children: [...honorLoungeMenu],
		accessPermissions: ["ACCESS_HONOR_LOUNGE_MODULE"],
	},
	{
		href: "/panel/users",
		label: "Utilisateurs",
		icon: React.createElement(BsPeople, { size: 16 }),
		children: [...usersMenu],
		accessPermissions: [],
	},
	{
		href: "/panel/others",
		label: "Autres",
		icon: React.createElement(BsStickies, { size: 16 }),
		children: [...othersMenu],
		accessPermissions: [],
	},
];

export const webLinks: {
	href: string;
	label: string;
	children: {
		href: string;
		label: string;
		icon: React.ReactNode;
		disabled: boolean;
	}[];
}[] = [
	// {
	//   href: "#",
	//   label: "Services",
	//   children: [
	//     { href: "/conferences", label: "Conférences", icon: React.createElement(Calendar, {className: "w-4 h-4 text-primary"}), disabled: false}
	//   ]
	// },
	// {
	//   href: "/conferences",
	//   label: "Conférences",
	//   children: []
	// },
	// {
	//   href: "/about",
	//   label: "A propos",
	//   children: []
	// },
	// {
	//   href: "/contact",
	//   label: "Contact",
	//   children: []
	// }
] as const;

export const diplomaticEntities = [
	{
		label: DiplomaticEntity.CD,
		value:
			"Le Ministère de l'Intégration Africaine et des Affaires Étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution de la Convention de Vienne sur les relations diplomatiques de 1961",
	},
	{
		label: DiplomaticEntity.CC,
		value:
			"Le Ministère de l'Intégration Africaine et des Affaires Étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution de la Convention de Vienne sur les relations consulaires de 1963",
	},
	{
		label: DiplomaticEntity.OI,
		value:
			"Le Ministère de l'Intégration africaine et des Affaires étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution des Accords en vigueur",
	},
	{
		label: DiplomaticEntity.CD,
		value:
			"Le Ministère de l'Intégration Africaine et des Affaires Étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution de la Convention de Vienne sur les relations diplomatiques de 1961",
	},
	{
		label: DiplomaticEntity.CC,
		value:
			"Le Ministère de l'Intégration Africaine et des Affaires Étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution de la Convention de Vienne sur les relations consulaires de 1963",
	},
	{
		label: DiplomaticEntity.OI,
		value:
			"Le Ministère de l'Intégration africaine et des Affaires étrangères prie les Autorités civiles et militaires de bien vouloir accorder au titulaire de la présente carte les facilités compatibles avec l’exécution des Accords en vigueur",
	},
];

export const OITexts = [
	{
		label: "Assimilé(e) Personnel Administratif et Technique",
		value: "Assimilé(e) Personnel Administratif et Technique",
	},
	{
		label: "Assimilé membre du Corps Diplomatique",
		value: "Assimilé membre du Corps Diplomatique",
	},
	{
		label: "Assimilé Chef de Mission Diplomatique",
		value: "Assimilé Chef de Mission Diplomatique",
	},
];

export const plaqueData = [
	{
		label: "Aucune",
		value: " ",
	},
	{
		label: "Chef de Mission Diplomatique",
		value: "CMD",
	},
	{ label: "Corps Diplomatique", value: "CD" },
	{
		label: "Immatriculation Temporaire",
		value: "IT",
	},
	{ label: "Corps Consulaire", value: "CC" },
];
