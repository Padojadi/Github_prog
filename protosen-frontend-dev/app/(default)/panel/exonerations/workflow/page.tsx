"use client";

import Link from "next/link";
import { useExonerationWorkflow } from "@/features/exonerations/hooks/use-exoneration-workflow";

export default function ExonerationsWorkflowPage() {
	const { stats, isLoading, error } = useExonerationWorkflow();
	const steps = [
		{
			label: "Soumission TE",
			description: "Le point focal soumet la demande dans le dossier En attente.",
			value: stats.PENDING,
			stateLabel: "En attente",
			href: "/panel/exonerations/forms/demande",
		},
		{
			label: "Vérification DPCT",
			description: "Le responsable DPCT vérifie, rejette ou retourne la demande.",
			value: stats.DPCT_VERIFIED,
			stateLabel: "Vérifiée DPCT",
			href: "/panel/exonerations/forms/verification-dpct",
		},
		{
			label: "Validation Douane",
			description: "La Douane valide, rejette ou retourne la demande après DPCT.",
			value: stats.CUSTOMS_VALIDATED,
			stateLabel: "Validée Douane",
			href: "/panel/exonerations/forms/validation-douane",
		},
		{
			label: "Émission et transfert TE",
			description: "Le TE est émis puis transféré pour finalisation.",
			value: stats.TRANSFERRED,
			stateLabel: "Transférée",
			href: "/panel/exonerations/forms/emission",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Exonérations - Workflow
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Workflow du traitement TE de la soumission au suivi de renouvellement.
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
