"use client";

import { useMemo } from "react";
import { useVisaWorkflow } from "@/features/visas/hooks/use-visa-workflow";

export default function VisaKpiPage() {
	const { records, stats, isLoading } = useVisaWorkflow();

	const rejectionRate = useMemo(() => {
		if (!stats.total) {
			return "0%";
		}
		return `${Math.round((stats.REJECTED / stats.total) * 100)}%`;
	}, [stats.total, stats.REJECTED]);

	const averageProcessing = useMemo(() => {
		const completed = records.filter(
			(row) => row.status === "WITHDRAWN" && row.withdrawnAt
		);
		if (!completed.length) {
			return "0 jour";
		}
		const totalDays = completed.reduce((sum, row) => {
			const start = new Date(row.submittedAt).getTime();
			const end = new Date(row.withdrawnAt as string).getTime();
			const days = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
			return sum + days;
		}, 0);
		const average = Math.round(totalDays / completed.length);
		return `${average} jour${average > 1 ? "s" : ""}`;
	}, [records]);

	const cards = [
		{ label: "Temps moyen de traitement", value: averageProcessing },
		{ label: "Taux de rejet", value: rejectionRate },
		{ label: "Visas délivrés (Émis)", value: String(stats.EMITTED) },
		{ label: "Visas retirés", value: String(stats.WITHDRAWN) },
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Visa - Indicateurs KPI
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Indicateurs demandés par le TDR pour le pilotage du service Visa.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{cards.map((kpi) => (
					<div
						key={kpi.label}
						className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
					>
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							{kpi.label}
						</p>
						<p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
							{isLoading ? "-" : kpi.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
