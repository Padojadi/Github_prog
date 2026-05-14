export const registrationKeyFeatures = [
	"Interface de demande en ligne avec upload de documents",
	"Vérification automatique et DPI",
	"Notifications SMS / Email",
	"Gestion des rejets et corrections",
	"Tableaux de bord statistiques",
	"Retrait électronique sécurisé",
];

export const registrationWorkflowSteps = [
	"Soumission",
	"Vérification automatique",
	"Validation agent",
	"Attribution",
	"Notification",
	"Retrait",
	"Archivage",
];

export const registrationForms = [
	{
		key: "demande",
		title: "Demande",
		description: "Création d'une nouvelle demande d'immatriculation.",
	},
	{
		key: "mutation",
		title: "Mutation",
		description: "Traitement d'une mutation d'immatriculation.",
	},
	{
		key: "permis",
		title: "Permis",
		description: "Émission et attribution des permis associés.",
	},
	{
		key: "retrait",
		title: "Retrait",
		description: "Retrait électronique sécurisé.",
	},
	{
		key: "correction",
		title: "Correction",
		description: "Corrections après rejet ou contrôle.",
	},
];

export const registrationKpiCards = [
	{
		label: "Temps de traitement",
		value: "0 jour",
	},
	{
		label: "Taux de rejet",
		value: "0%",
	},
	{
		label: "Dossiers traités",
		value: "0",
	},
	{
		label: "Satisfaction usagers",
		value: "0%",
	},
];
