"use client";

import Link from "next/link";

export default function RegistrationsModulePage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Module Immatriculations
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Le module Immatriculations est disponible depuis la barre latérale.
				</p>
			</div>
			<div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
				<p className="text-sm text-slate-600 dark:text-slate-300">
					Cette page confirme l’accès au module pour les rôles autorisés.
				</p>
				<Link
					href="/panel/dashboard"
					className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
				>
					Retour au tableau de bord
				</Link>
			</div>
		</div>
	);
}
