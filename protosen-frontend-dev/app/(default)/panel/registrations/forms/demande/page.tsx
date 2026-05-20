"use client";

import { FormEvent, useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import RegistrationWorkflowStatusBadge from "@/features/registrations/components/workflow-status-badge";
import { useRegistrationWorkflow } from "@/features/registrations/hooks/use-registration-workflow";

export default function RegistrationRequestFormPage() {
	const currentUser = useCurrentUser();
	const { records, createRequest, runAction, isLoading, error } = useRegistrationWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const myRequests = useMemo(() => {
		if (!currentUser?.id) return [];
		return records.filter((row) => row.submittedBy.id === currentUser.id);
	}, [records, currentUser?.id]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage(null);
		setIsSubmitting(true);
		const form = event.currentTarget;
		const formData = new FormData(form);
		const documents = formData.getAll("documents");
		const result = await createRequest({
			applicantName: String(formData.get("applicantName") || ""),
			identityNumber: String(formData.get("identityNumber") || ""),
			vehicleInfo: String(formData.get("vehicleInfo") || ""),
			documentsCount: documents.filter((item) => item instanceof File && item.name).length,
		});
		if (result.ok) {
			form.reset();
			setMessage(
				"Demande soumise. Elle est maintenant en attente de validation de mutation."
			);
		} else {
			setMessage(result.message);
		}
		setIsSubmitting(false);
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

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}

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
						<input type="file" multiple name="documents" className="form-input w-full" />
					</label>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						{isSubmitting ? "Soumission..." : "Soumettre la demande"}
					</button>
				</div>
			</form>

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Mes demandes d'immatriculation
				</h2>
				{isLoading ? (
					<p className="text-sm text-slate-500">Chargement...</p>
				) : error ? (
					<p className="text-sm text-red-600">{error}</p>
				) : myRequests.length === 0 ? (
					<p className="text-sm text-slate-500">Aucune demande soumise.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
							<thead className="bg-slate-50 dark:bg-slate-800">
								<tr>
									<th className="px-3 py-2 text-left font-medium">Référence</th>
									<th className="px-3 py-2 text-left font-medium">Demandeur</th>
									<th className="px-3 py-2 text-left font-medium">Identité</th>
									<th className="px-3 py-2 text-left font-medium">État</th>
									<th className="px-3 py-2 text-left font-medium">Motif</th>
									<th className="px-3 py-2 text-left font-medium">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
								{myRequests.map((row) => (
									<tr key={row.id}>
										<td className="px-3 py-2 font-medium">{row.reference}</td>
										<td className="px-3 py-2">{row.applicantName}</td>
										<td className="px-3 py-2">{row.identityNumber}</td>
										<td className="px-3 py-2">
											<RegistrationWorkflowStatusBadge status={row.status} />
										</td>
										<td className="px-3 py-2">{row.statusReason || "-"}</td>
										<td className="px-3 py-2">
											{row.status === "CORRECTION_REQUIRED" ? (
												<button
													type="button"
													onClick={async () => {
														const result = await runAction(row.id, "RESUBMIT");
														setMessage(
															result.ok
																? "Demande corrigée renvoyée en attente."
																: result.message
														);
													}}
													className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500"
												>
													Renvoyer
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
			</section>
		</div>
	);
}
