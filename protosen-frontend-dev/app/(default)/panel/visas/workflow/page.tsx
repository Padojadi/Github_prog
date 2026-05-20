"use client";

import Link from "next/link";
import { useVisaWorkflow } from "@/features/visas/hooks/use-visa-workflow";

export default function VisaWorkflowPage() {
	const { stats, isLoading, error } = useVisaWorkflow();

	const steps = [
		{
			label: "Soumission point focal",
			description:
				"La demande est automatiquement classée dans le dossier des demandes de visa en attente.",
			value: stats.PENDING,
			stateLabel: "En attente",
			href: "/panel/visas/forms/demande",
		},
		{
			label: "Décision responsable Visa",
			description:
				"Le responsable accepte, rejette (avec motif) ou retourne (avec raison) la demande.",
			value: stats.ACCEPTED,
			stateLabel: "Acceptée",
			href: "/panel/visas/forms/validation",
		},
		{
			label: "Émission du talon",
			description:
				"Après acceptation, le talon est émis et le point focal est notifié de la disponibilité.",
			value: stats.EMITTED,
			stateLabel: "Émis",
			href: "/panel/visas/forms/validation",
		},
		{
			label: "Retrait Visa",
			description: "Le point focal confirme le retrait du visa émis.",
			value: stats.WITHDRAWN,
			stateLabel: "Retiré",
			href: "/panel/visas/forms/retrait",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Visa - Workflow
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Chaîne de traitement du visa de la soumission jusqu'au retrait.
				</p>
			</div>

			{error && <p className="text-sm text-red-600">{error}</p>}

			<div className="grid gap-4 md:grid-cols-2">
				{steps.map((step, index) => (
					<Link
						key={step.label}
						href={step.href}
						className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
									{index + 1}
								</div>
								<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
									{step.label}
								</h2>
							</div>
							<div className="text-right">
								<p className="text-xs uppercase text-slate-500">{step.stateLabel}</p>
								<p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
									{isLoading ? "-" : step.value}
								</p>
							</div>
						</div>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							{step.description}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
