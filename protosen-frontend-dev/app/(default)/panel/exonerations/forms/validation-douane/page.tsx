"use client";

import { FormEvent, useState } from "react";

export default function ExonerationCustomsValidationFormPage() {
	const [decision, setDecision] = useState("APPROVE");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Validation Douane
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Validation humaine côté Douane avant émission du TE.
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
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Décision Douane</span>
						<select
							className="form-input w-full"
							name="decision"
							value={decision}
							onChange={(event) => setDecision(event.target.value)}
						>
							<option value="APPROVE">Approuver</option>
							<option value="REJECT">Rejeter</option>
						</select>
					</label>
					<label className="text-sm md:col-span-2">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">
							Motif / observations
						</span>
						<textarea
							required={decision === "REJECT"}
							className="form-input w-full min-h-24"
							name="notes"
							placeholder={
								decision === "REJECT"
									? "Motif obligatoire en cas de rejet"
									: "Commentaires de validation"
							}
						/>
					</label>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Enregistrer la décision
					</button>
				</div>
				{submitted && (
					<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
						Validation Douane enregistrée.
					</p>
				)}
			</form>
		</div>
	);
}
