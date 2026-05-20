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

const visasMenu: Ilink[] = [
	{
		href: "/panel/visas/dashboard",
		label: "Tableau de bord",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/visas/functionalities",
		label: "Fonctionnalités clés",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/visas/workflow",
		label: "Workflow",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/visas/forms",
		label: "Formulaires",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
		children: [
			{
				href: "/panel/visas/forms/demande",
				label: "Demande de visa",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/validation",
				label: "Validation",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/retrait",
				label: "Retrait",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
		],
	},
	{
		href: "/panel/visas/forms/validation?status=PENDING",
		label: "Dossiers par statut",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
		children: [
			{
				href: "/panel/visas/forms/validation?status=PENDING",
				label: "En attente",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/validation?status=ACCEPTED",
				label: "Acceptée",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/retrait?status=EMITTED",
				label: "Émis",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/retrait?status=WITHDRAWN",
				label: "Retiré",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/validation?status=REJECTED",
				label: "Rejetée",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/visas/forms/validation?status=RETURNED",
				label: "Retournée",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
		],
	},
	{
		href: "/panel/visas/kpi",
		label: "Indicateurs KPI",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
];

const exonerationsMenu: Ilink[] = [
	{
		href: "/panel/exonerations/dashboard",
		label: "Tableau de bord",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/exonerations/functionalities",
		label: "Fonctionnalités clés",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/exonerations/workflow",
		label: "Workflow",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/exonerations/forms",
		label: "Formulaires",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
		children: [
			{
				href: "/panel/exonerations/forms/demande",
				label: "Demande TE",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/exonerations/forms/verification-dpct",
				label: "Vérification DPCT",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/exonerations/forms/validation-douane",
				label: "Validation Douane",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/exonerations/forms/notification-rejet",
				label: "Notification de rejet",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/exonerations/forms/emission",
				label: "Émission TE",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
		],
	},
	{
		href: "/panel/exonerations/kpi",
		label: "Indicateurs KPI",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
];

const registrationsMenu: Ilink[] = [
	{
		href: "/panel/registrations/dashboard",
		label: "Tableau de bord",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/registrations/functionalities",
		label: "Fonctionnalités clés",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/registrations/workflow",
		label: "Workflow",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/registrations/forms",
		label: "Formulaires",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
		children: [
			{
				href: "/panel/registrations/forms/demande",
				label: "Demande",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/registrations/forms/mutation",
				label: "Mutation",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/registrations/forms/permis",
				label: "Permis",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/registrations/forms/retrait",
				label: "Retrait",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
			{
				href: "/panel/registrations/forms/correction",
				label: "Correction",
				accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
			},
		],
	},
	{
		href: "/panel/registrations/kpi",
		label: "Indicateurs KPI",
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
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
		href: "/panel/honor-lounge/dashboard",
		label: "Tableau de bord",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
	},
	{
		href: "/panel/honor-lounge",
		label: "Salons",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
		],
	},
	{
		href: "/panel/honor-lounge/manage",
		label: "Gestion des salons",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
	},
	{
		href: "/panel/honor-lounge/access-request",
		label: "Demande d'accès",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
		],
	},
	{
		href: "/panel/honor-lounge/bookings/new",
		label: "Nouvelle réservation",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
		],
	},
	{
		href: "/panel/honor-lounge/bookings",
		label: "Mes réservations",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
		],
	},
	{
		href: "/panel/honor-lounge/booking-history",
		label: "Historique des réservations",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
	},
	{
		href: "/panel/honor-lounge/bookings?bookingStatus=PENDING",
		label: "Réservations en attente",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
	},
	{
		href: "/panel/honor-lounge/bookings?bookingStatus=CONFIRMED",
		label: "Réservations confirmées",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
	},
	{
		href: "/panel/honor-lounge/bookings?bookingStatus=CANCELLED",
		label: "Réservations annulées",
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
			"MANAGE_CONFERENCES",
		],
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
	{
		href: "/panel/conferences",
		label: "Conférences",
		icon: React.createElement(BsGrid1X2, { size: 16 }),
		children: [...conferencesMenu],
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/honor-lounge",
		label: "Salon d'honneur",
		icon: React.createElement(BsSliders, { size: 16 }),
		children: [...honorLoungeMenu],
		accessPermissions: [
			"ACCESS_HONOR_LOUNGE_MODULE",
			"ACCESS_CONFERENCE_MODULE",
		],
	},
	{
		href: "/panel/visas",
		label: "Visa",
		icon: React.createElement(BsGrid1X2, { size: 16 }),
		children: [...visasMenu],
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/exonerations",
		label: "Exonérations",
		icon: React.createElement(BsStickies, { size: 16 }),
		children: [...exonerationsMenu],
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
	},
	{
		href: "/panel/registrations",
		label: "Immatriculations",
		icon: React.createElement(BsSliders, { size: 16 }),
		children: [...registrationsMenu],
		accessPermissions: ["ACCESS_CONFERENCE_MODULE"],
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
