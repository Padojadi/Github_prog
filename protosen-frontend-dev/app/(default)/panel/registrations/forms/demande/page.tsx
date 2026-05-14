"use client";

import { FormEvent, useState } from "react";

export default function RegistrationRequestFormPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Demande
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Soumission d'une demande d'immatriculation.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
			>
				<div className="grid gap-4 md:grid-cols-2">
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Nom demandeur</span>
						<input required className="form-input w-full" name="applicantName" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">
							Numéro d'identification
						</span>
						<input required className="form-input w-full" name="identityNumber" />
					</label>
					<label className="text-sm md:col-span-2">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Informations véhicule</span>
						<textarea className="form-input w-full min-h-24" name="vehicleInfo" required />
					</label>
					<label className="text-sm md:col-span-2">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">
							Documents justificatifs
						</span>
						<input type="file" multiple className="form-input w-full" />
					</label>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Soumettre la demande
					</button>
				</div>
				{submitted && (
					<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
						Demande enregistrée (mode formulaire TDR).
					</p>
				)}
			</form>
		</div>
	);
}
