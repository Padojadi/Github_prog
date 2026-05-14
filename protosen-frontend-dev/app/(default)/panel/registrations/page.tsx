"use client";

import Link from "next/link";
import {
	registrationKeyFeatures,
	registrationWorkflowSteps,
} from "@/features/registrations/lib/tdr";

export default function RegistrationsModulePage() {
	const sections = [
		{
			title: "Fonctionnalités clés",
			description:
				"Fonctionnalités TDR: demande en ligne, DPI, notifications, rejets et reporting.",
			href: "/panel/registrations/functionalities",
		},
		{
			title: "Workflow",
			description:
				"Cycle de traitement de la soumission jusqu'à l'archivage des dossiers.",
			href: "/panel/registrations/workflow",
		},
		{
			title: "Formulaires",
			description:
				"Formulaires Demande, Mutation, Permis, Retrait et Correction.",
			href: "/panel/registrations/forms",
		},
		{
			title: "Indicateurs KPI",
			description: "Suivi des délais, rejets, dossiers traités et satisfaction.",
			href: "/panel/registrations/kpi",
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Module Immatriculations - TDR
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Module "Gestion des numéros d'immatriculation et des permis"
					structuré selon le TDR fourni.
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
						{registrationKeyFeatures.map((feature) => (
							<li key={feature}>- {feature}</li>
						))}
					</ul>
				</div>
				<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Workflow standard
					</h3>
					<ol className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
						{registrationWorkflowSteps.map((step, index) => (
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
