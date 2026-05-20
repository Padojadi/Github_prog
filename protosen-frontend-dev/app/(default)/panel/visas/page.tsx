"use client";

import Link from "next/link";
import { visaKeyFeatures, visaWorkflowSteps } from "@/features/visas/lib/tdr";

export default function VisasModulePage() {
	const sections = [
		{
			title: "Fonctionnalités clés",
			description:
				"Vue d'ensemble des capacités attendues par le TDR (demande, validation, notifications, retrait).",
			href: "/panel/visas/functionalities",
		},
		{
			title: "Workflow Visa",
			description:
				"Parcours complet de la soumission de demande jusqu'au retrait du visa.",
			href: "/panel/visas/workflow",
		},
		{
			title: "Formulaires",
			description:
				"Formulaires opérationnels: Demande de visa, Validation et Retrait.",
			href: "/panel/visas/forms",
		},
		{
			title: "Indicateurs KPI",
			description:
				"Suivi des indicateurs de traitement, taux de rejet, visas délivrés et satisfaction.",
			href: "/panel/visas/kpi",
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Module Visa - TDR
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Ce module suit le TDR "Système de Gestion des Visas" avec les rubriques,
					le workflow et les formulaires requis. Les états opérationnels sont:
					En attente, Acceptée, Émis et Retiré.
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
						{visaKeyFeatures.slice(0, 4).map((feature) => (
							<li key={feature}>- {feature}</li>
						))}
					</ul>
				</div>
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Workflow standard
					</h3>
					<ol className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
						{visaWorkflowSteps.map((step, index) => (
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
