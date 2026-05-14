import Link from "next/link";

const formLinks = [
	{
		href: "/panel/exonerations/forms/demande",
		title: "Demande TE",
		description: "Formulaire de demande avec pièces justificatives.",
	},
	{
		href: "/panel/exonerations/forms/verification-dpct",
		title: "Vérification DPCT",
		description: "Contrôle initial DPCT et vérification automatique.",
	},
	{
		href: "/panel/exonerations/forms/validation-douane",
		title: "Validation Douane",
		description: "Validation finale par les services douaniers.",
	},
	{
		href: "/panel/exonerations/forms/notification-rejet",
		title: "Notification de rejet",
		description: "Notification du rejet avec motif et actions correctives.",
	},
	{
		href: "/panel/exonerations/forms/emission",
		title: "Émission TE",
		description: "Émission du titre d'exonération et transfert automatique.",
	},
];

export default function ExonerationsFormsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Exonérations - Formulaires
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Formulaires opérationnels définis dans le TDR.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
