"use client";

import Link from "next/link";
import {
	exonerationKeyFeatures,
	exonerationWorkflowSteps,
} from "@/features/exonerations/lib/tdr";

export default function ExonerationsModulePage() {
	const sections = [
		{
			title: "Fonctionnalités clés",
			description:
				"Fonctionnalités attendues pour le cycle TE: demande, validation, notification et suivi.",
			href: "/panel/exonerations/functionalities",
		},
		{
			title: "Workflow TE",
			description:
				"Parcours complet de la soumission à l'émission et au suivi de renouvellement.",
			href: "/panel/exonerations/workflow",
		},
		{
			title: "Formulaires",
			description:
				"Formulaires Demande TE, Vérification DPCT, Validation Douane, Rejet et Émission.",
			href: "/panel/exonerations/forms",
		},
		{
			title: "Indicateurs KPI",
			description:
				"Indicateurs de suivi et de performance des titres d'exonération.",
			href: "/panel/exonerations/kpi",
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Module Exonérations - TDR
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Ce module applique le TDR "Système de Gestion des Titres
					d'Exonération (TE)".
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{sections.map((section) => (
					<Link
						key={section.href}
						href={section.href}
						className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
							{section.title}
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							{section.description}
						</p>
					</Link>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Fonctionnalités prévues
					</h3>
					<ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
						{exonerationKeyFeatures.slice(0, 4).map((feature) => (
							<li key={feature}>- {feature}</li>
						))}
					</ul>
				</div>
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Workflow standard
					</h3>
					<ol className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
						{exonerationWorkflowSteps.map((step, index) => (
							<li key={step}>
								{index + 1}. {step}
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
}
