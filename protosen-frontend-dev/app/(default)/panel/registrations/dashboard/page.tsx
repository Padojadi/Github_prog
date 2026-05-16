import Link from "next/link";
import { registrationKpiCards } from "@/features/registrations/lib/tdr";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";

export default function RegistrationsDashboardPage() {
	const reportSections = [
		{
			title: "Indicateurs Immatriculations",
			headers: ["Indicateur", "Valeur"],
			rows: registrationKpiCards.map((card) => [card.label, card.value]),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
						Immatriculations - Tableau de bord
					</h1>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						Suivi du cycle de vie des numéros d'immatriculation et permis.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<DashboardReportActions
						title="Tableau de bord Immatriculations - Rapport"
						fileName="tableau-de-bord-immatriculations"
						sections={reportSections}
					/>
					<Link
						href="/panel/registrations/forms/demande"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Nouvelle demande
					</Link>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{registrationKpiCards.map((card) => (
					<div
						key={card.label}
						className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
					>
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							{card.label}
						</p>
						<p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
							{card.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
