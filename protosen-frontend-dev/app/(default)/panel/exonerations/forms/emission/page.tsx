"use client";

import { FormEvent, useState } from "react";

export default function ExonerationEmissionFormPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Émission TE
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Émission du titre d'exonération et transfert automatique de référence.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
			>
				<div className="grid gap-4 md:grid-cols-2">
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Numéro dossier</span>
						<input required className="form-input w-full" name="dossierNumber" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Numéro TE</span>
						<input required className="form-input w-full" name="teNumber" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Date d'émission</span>
						<input required type="date" className="form-input w-full" name="issuedAt" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Mode de transfert</span>
						<select className="form-input w-full" name="transferMode">
							<option value="AUTO">Automatique</option>
							<option value="MANUAL">Manuel</option>
						</select>
					</label>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Émettre le TE
					</button>
				</div>
				{submitted && (
					<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
						Émission TE enregistrée (mode formulaire TDR).
					</p>
				)}
			</form>
		</div>
	);
}
