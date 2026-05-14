"use client";

import { FormEvent, useState } from "react";
import { exonerationRequestDocuments } from "@/features/exonerations/lib/tdr";

export default function ExonerationRequestFormPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Demande TE
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Soumission initiale d'un titre d'exonération.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
				<form
					onSubmit={handleSubmit}
					className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
				>
					<div className="grid gap-4 md:grid-cols-2">
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Numéro dossier
							</span>
							<input required className="form-input w-full" name="dossierNumber" />
						</label>
						<label className="text-sm">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Type de demande TE
							</span>
							<input required className="form-input w-full" name="requestType" />
						</label>
						<label className="text-sm md:col-span-2">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Objet de la demande
							</span>
							<textarea required className="form-input w-full min-h-24" name="subject" />
						</label>
						<label className="text-sm md:col-span-2">
							<span className="mb-1 block text-slate-700 dark:text-slate-300">
								Documents justificatifs
							</span>
							<input type="file" className="form-input w-full" multiple />
						</label>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
						>
							Soumettre
						</button>
					</div>
					{submitted && (
						<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
							Demande TE enregistrée (mode formulaire TDR).
						</p>
					)}
				</form>
				<div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Documents requis
					</h2>
					<ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
						{exonerationRequestDocuments.map((doc) => (
							<li key={doc}>- {doc}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
