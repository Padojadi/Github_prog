"use client";

import { FormEvent, useState } from "react";
import { visaRequiredDocuments, visaTypes } from "@/features/visas/lib/tdr";

export default function VisaRequestFormPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Demande de visa
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Soumission de la demande avec les champs définis dans le TDR.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
				<form
					onSubmit={handleSubmit}
					className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
				>
					<div className="grid gap-4 md:grid-cols-2">
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">Nom</span>
							<input required className="form-input w-full" name="lastName" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">Prénom</span>
							<input required className="form-input w-full" name="firstName" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Date de naissance
							</span>
							<input required type="date" className="form-input w-full" name="birthDate" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Nationalité
							</span>
							<input required className="form-input w-full" name="nationality" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Numéro passeport
							</span>
							<input required className="form-input w-full" name="passportNumber" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">Type de visa</span>
							<select required className="form-input w-full" name="visaType" defaultValue="">
								<option value="" disabled>
									Sélectionner un type
								</option>
								{visaTypes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</label>
						<label className="text-sm md:col-span-2">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Documents (upload multiple)
							</span>
							<input type="file" className="form-input w-full" multiple />
						</label>
					</div>
					<div className="mt-4 flex items-center justify-end">
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
						>
							Soumettre la demande
						</button>
					</div>
					{submitted && (
						<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
							Demande enregistrée avec succès (mode formulaire TDR).
						</p>
					)}
				</form>

				<div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Documents à fournir
					</h2>
					<ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
						{visaRequiredDocuments.map((doc) => (
							<li key={doc}>- {doc}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
