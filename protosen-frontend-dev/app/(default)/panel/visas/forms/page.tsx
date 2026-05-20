import Link from "next/link";

const formLinks = [
	{
		href: "/panel/visas/forms/demande",
		title: "Demande de visa",
		description:
			"Soumission point focal. Toute demande est créée en état En attente.",
	},
	{
		href: "/panel/visas/forms/validation",
		title: "Validation",
		description:
			"Dossier en attente traité par le responsable: accepter, rejeter ou retourner avec motif.",
	},
	{
		href: "/panel/visas/forms/retrait",
		title: "Retrait",
		description:
			"Après émission et notification, le point focal confirme le retrait du visa.",
	},
];

export default function VisaFormsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Visa - Formulaires
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Les formulaires du TDR sont disponibles ci-dessous.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{formLinks.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
							{item.title}
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							{item.description}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
