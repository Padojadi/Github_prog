"use client";

import { FormEvent, useState } from "react";

export default function RegistrationWithdrawalFormPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Retrait
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Retrait électronique sécurisé avec identification du collecteur.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
			>
				<div className="grid gap-4 md:grid-cols-2">
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Numéro permis</span>
						<input required className="form-input w-full" name="permitNumber" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Nom collecteur</span>
						<input required className="form-input w-full" name="collectorName" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Pièce identité</span>
						<input required className="form-input w-full" name="identityDocument" />
					</label>
					<label className="text-sm">
						<span className="mb-1 block text-slate-700 dark:text-slate-300">Date retrait</span>
						<input required type="date" className="form-input w-full" name="withdrawalDate" />
					</label>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Confirmer le retrait
					</button>
				</div>
				{submitted && (
					<p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
						Retrait enregistré.
					</p>
				)}
			</form>
		</div>
	);
}
