"use client";

import Link from "next/link";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";
import { useVisaWorkflow } from "@/features/visas/hooks/use-visa-workflow";

export default function VisaDashboardPage() {
	const { stats, isLoading } = useVisaWorkflow();
	const cards = [
		{ label: "En attente", value: stats.PENDING },
		{ label: "Acceptée", value: stats.ACCEPTED },
		{ label: "Émis", value: stats.EMITTED },
		{ label: "Retiré", value: stats.WITHDRAWN },
	];

	const reportSections = [
		{
			title: "Indicateurs Visa",
			headers: ["Indicateur", "Valeur"],
			rows: cards.map((card) => [card.label, card.value]),
		},
		{
			title: "Décisions Responsable Visa",
			headers: ["Type", "Nombre"],
			rows: [
				["Rejetée", stats.REJECTED],
				["Retournée", stats.RETURNED],
			],
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
						Visa - Tableau de bord
					</h1>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						Suivi rapide des indicateurs du workflow Visa.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<DashboardReportActions
						title="Tableau de bord Visa - Rapport"
						fileName="tableau-de-bord-visa"
						sections={reportSections}
					/>
					<Link
						href="/panel/visas/forms/demande"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Nouvelle demande
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

			<div className="grid gap-4 md:grid-cols-2">
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Rejetée
					</p>
					<p className="mt-2 text-2xl font-semibold text-red-700 dark:text-red-300">
						{isLoading ? "-" : stats.REJECTED}
					</p>
				</div>
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Retournée
					</p>
					<p className="mt-2 text-2xl font-semibold text-orange-700 dark:text-orange-300">
						{isLoading ? "-" : stats.RETURNED}
					</p>
				</div>
			</div>
		</div>
	);
}
