"use client";

import Link from "next/link";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";
import { useExonerationWorkflow } from "@/features/exonerations/hooks/use-exoneration-workflow";

export default function ExonerationsDashboardPage() {
	const { stats, isLoading } = useExonerationWorkflow();
	const cards = [
		{ label: "En attente", value: stats.PENDING },
		{ label: "Vérifiées DPCT", value: stats.DPCT_VERIFIED },
		{ label: "Validées Douane", value: stats.CUSTOMS_VALIDATED },
		{ label: "Émises", value: stats.EMITTED },
		{ label: "Transférées", value: stats.TRANSFERRED },
		{ label: "Rejetées", value: stats.REJECTED },
		{ label: "Retournées", value: stats.RETURNED },
	];

	const reportSections = [
		{
			title: "Indicateurs Exonerations",
			headers: ["Indicateur", "Valeur"],
			rows: cards.map((card) => [card.label, card.value]),
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
				{cards.map((card) => (
					<div
						key={card.label}
						className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
					>
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							{card.label}
						</p>
						<p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
							{isLoading ? "-" : card.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
