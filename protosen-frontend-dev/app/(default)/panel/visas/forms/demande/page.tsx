"use client";

import { FormEvent, useMemo, useState } from "react";
import { visaRequiredDocuments, visaTypes } from "@/features/visas/lib/tdr";
import { useVisaWorkflow } from "@/features/visas/hooks/use-visa-workflow";
import WorkflowStatusBadge from "@/features/visas/components/workflow-status-badge";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function VisaRequestFormPage() {
	const currentUser = useCurrentUser();
	const { records, isLoading, error, createRequest, runAction } = useVisaWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const userRequests = useMemo(() => {
		if (!currentUser?.id) {
			return [];
		}
		return records.filter((row) => row.submittedBy.id === currentUser.id);
	}, [records, currentUser?.id]);

	const availableForWithdraw = userRequests.filter((row) => row.status === "EMITTED");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage(null);
		setIsSubmitting(true);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const documents = formData.getAll("documents");

		const result = await createRequest({
			applicantLastName: String(formData.get("lastName") || ""),
			applicantFirstName: String(formData.get("firstName") || ""),
			birthDate: String(formData.get("birthDate") || ""),
			nationality: String(formData.get("nationality") || ""),
			passportNumber: String(formData.get("passportNumber") || ""),
			visaType: String(formData.get("visaType") || ""),
			documentsCount: documents.filter((item) => item instanceof File && item.name).length,
		});

		if (result.ok) {
			form.reset();
			setMessage("Demande soumise. Elle est maintenant dans le dossier 'En attente'.");
		} else {
			setMessage(result.message);
		}
		setIsSubmitting(false);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Demande de visa
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Le point focal soumet ici la demande. Elle passe automatiquement à l'état
					"En attente" pour traitement par le responsable Visa.
				</p>
			</div>

			{availableForWithdraw.length > 0 && (
				<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
					{availableForWithdraw.length} visa(s) émis disponible(s). Le point focal peut
					aller au formulaire de retrait pour finaliser.
				</div>
			)}

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
							<input
								type="file"
								className="form-input w-full"
								name="documents"
								multiple
							/>
						</label>
					</div>
					<div className="mt-4 flex items-center justify-end">
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
						>
							{isSubmitting ? "Soumission..." : "Soumettre la demande"}
						</button>
					</div>
					{message && <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-300">{message}</p>}
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

			<div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Mes demandes Visa
					</h2>
				</div>

				{isLoading ? (
					<p className="text-sm text-slate-500 dark:text-slate-400">Chargement...</p>
				) : error ? (
					<p className="text-sm text-red-600 dark:text-red-300">{error}</p>
				) : userRequests.length === 0 ? (
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Aucune demande soumise pour le moment.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
							<thead className="bg-slate-50 dark:bg-slate-800">
								<tr>
									<th className="px-3 py-2 text-left font-medium">Référence</th>
									<th className="px-3 py-2 text-left font-medium">Demandeur</th>
									<th className="px-3 py-2 text-left font-medium">Type</th>
									<th className="px-3 py-2 text-left font-medium">État</th>
									<th className="px-3 py-2 text-left font-medium">Soumise le</th>
									<th className="px-3 py-2 text-left font-medium">Motif</th>
									<th className="px-3 py-2 text-left font-medium">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
								{userRequests.map((row) => (
									<tr key={row.id}>
										<td className="px-3 py-2 font-medium">{row.reference}</td>
										<td className="px-3 py-2">
											{row.applicantFirstName} {row.applicantLastName}
										</td>
										<td className="px-3 py-2">{row.visaType}</td>
										<td className="px-3 py-2">
											<WorkflowStatusBadge status={row.status} />
										</td>
										<td className="px-3 py-2">
											{new Date(row.submittedAt).toLocaleString("fr-FR")}
										</td>
										<td className="px-3 py-2">{row.statusReason || "-"}</td>
										<td className="px-3 py-2">
											{row.status === "RETURNED" ? (
												<button
													type="button"
													onClick={async () => {
														const result = await runAction(row.id, "RESUBMIT");
														setMessage(
															result.ok
																? "Demande re-soumise avec succès."
																: result.message
														);
													}}
													className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500"
												>
													Renvoyer en attente
												</button>
											) : (
												<span className="text-xs text-slate-500">-</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
