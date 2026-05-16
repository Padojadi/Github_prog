import Link from "next/link";
import { exonerationKpiCards } from "@/features/exonerations/lib/tdr";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";

export default function ExonerationsDashboardPage() {
	const reportSections = [
		{
			title: "Indicateurs Exonerations",
			headers: ["Indicateur", "Valeur"],
			rows: exonerationKpiCards.map((card) => [card.label, card.value]),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
						Exonérations - Tableau de bord
					</h1>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						Suivi des indicateurs du système de gestion des TE.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<DashboardReportActions
						title="Tableau de bord Exonerations - Rapport"
						fileName="tableau-de-bord-exonerations"
						sections={reportSections}
					/>
					<Link
						href="/panel/exonerations/forms/demande"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Nouvelle demande TE
					</Link>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{exonerationKpiCards.map((card) => (
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
