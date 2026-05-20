"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import RegistrationWorkflowStatusBadge from "@/features/registrations/components/workflow-status-badge";
import {
	getRegistrationStatusLabel,
	useRegistrationWorkflow,
} from "@/features/registrations/hooks/use-registration-workflow";
import type { RegistrationWorkflowStatus } from "@/features/registrations/lib/workflow-types";

export default function RegistrationCorrectionFormPage() {
	const searchParams = useSearchParams();
	const { records, isLoading, error, runAction } = useRegistrationWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const statusFilter = searchParams.get("status") as RegistrationWorkflowStatus | null;

	const correctionRows = useMemo(
		() => records.filter((row) => row.status === "CORRECTION_REQUIRED"),
		[records]
	);
	const rejectedRows = useMemo(
		() => records.filter((row) => row.status === "REJECTED"),
		[records]
	);
	const showCorrection = !statusFilter || statusFilter === "CORRECTION_REQUIRED";
	const showRejected = !statusFilter || statusFilter === "REJECTED";

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Correction
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Correction d'un dossier rejeté ou incomplet.
				</p>
			</div>

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}
			{statusFilter && (
				<p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
					Filtre actif: <strong>{getRegistrationStatusLabel(statusFilter)}</strong>.{" "}
					<Link href="/panel/registrations/forms/correction" className="underline">
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			{showCorrection && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Dossiers en correction
					</h2>
					{isLoading ? (
						<p className="text-sm text-slate-500">Chargement...</p>
					) : error ? (
						<p className="text-sm text-red-600">{error}</p>
					) : correctionRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun dossier en correction.</p>
					) : (
						<div className="space-y-2">
							{correctionRows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
								>
									<div>
										<p className="font-medium">
											{row.reference} - {row.applicantName}
										</p>
										<p className="text-xs text-slate-500">
											Motif correction: {row.statusReason || "-"}
										</p>
										<RegistrationWorkflowStatusBadge status={row.status} />
									</div>
									<button
										type="button"
										onClick={async () => {
											const result = await runAction(row.id, "RESUBMIT");
											setMessage(
												result.ok
													? `Correction soumise pour ${row.reference}.`
													: result.message
											);
										}}
										className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
									>
										Soumettre correction
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{showRejected && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Dossiers rejetés
					</h2>
					{rejectedRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun dossier rejeté.</p>
					) : (
						<div className="space-y-2">
							{rejectedRows.map((row) => (
								<div
									key={row.id}
									className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
								>
									<div className="flex items-center justify-between">
										<p className="font-medium">
											{row.reference} - {row.applicantName}
										</p>
										<RegistrationWorkflowStatusBadge status={row.status} />
									</div>
									<p className="text-xs text-slate-500">Motif: {row.statusReason || "-"}</p>
								</div>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
