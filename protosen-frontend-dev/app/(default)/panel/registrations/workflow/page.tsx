"use client";

import Link from "next/link";
import { useRegistrationWorkflow } from "@/features/registrations/hooks/use-registration-workflow";

export default function RegistrationsWorkflowPage() {
	const { stats, isLoading, error } = useRegistrationWorkflow();
	const steps = [
		{
			label: "Soumission",
			description: "Le point focal soumet une nouvelle demande d'immatriculation.",
			value: stats.PENDING,
			stateLabel: "En attente",
			href: "/panel/registrations/forms/demande",
		},
		{
			label: "Validation mutation",
			description: "Le responsable valide la mutation ou demande correction/rejet.",
			value: stats.MUTATION_VALIDATED,
			stateLabel: "Mutation validée",
			href: "/panel/registrations/forms/mutation",
		},
		{
			label: "Émission permis",
			description: "Après validation mutation, le permis est émis.",
			value: stats.PERMIT_ISSUED,
			stateLabel: "Permis émis",
			href: "/panel/registrations/forms/permis",
		},
		{
			label: "Retrait",
			description: "Le point focal confirme le retrait sécurisé du permis.",
			value: stats.WITHDRAWN,
			stateLabel: "Retiré",
			href: "/panel/registrations/forms/retrait",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Immatriculations - Workflow
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Workflow BPMN simplifié du TDR.
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
