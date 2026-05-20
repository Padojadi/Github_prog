"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import RegistrationWorkflowStatusBadge from "@/features/registrations/components/workflow-status-badge";
import {
	getRegistrationStatusLabel,
	useRegistrationWorkflow,
} from "@/features/registrations/hooks/use-registration-workflow";
import type { RegistrationWorkflowStatus } from "@/features/registrations/lib/workflow-types";

export default function RegistrationPermitFormPage() {
	const searchParams = useSearchParams();
	const currentUser = useCurrentUser();
	const { records, isLoading, error, runAction } = useRegistrationWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const statusFilter = searchParams.get("status") as RegistrationWorkflowStatus | null;

	const normalizedRole = String(currentUser?.role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");
	const canReview =
		normalizedRole === "admin" ||
		normalizedRole === "super_admin" ||
		normalizedRole === "superadmin";

	const toIssueRows = useMemo(
		() => records.filter((row) => row.status === "MUTATION_VALIDATED"),
		[records]
	);
	const issuedRows = useMemo(
		() => records.filter((row) => row.status === "PERMIT_ISSUED"),
		[records]
	);
	const showToIssue = !statusFilter || statusFilter === "MUTATION_VALIDATED";
	const showIssued = !statusFilter || statusFilter === "PERMIT_ISSUED";

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Permis
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Attribution du permis et numéro d'immatriculation.
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
					<Link href="/panel/registrations/forms/permis" className="underline">
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			{showToIssue && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Dossiers mutation validée à émettre
					</h2>
					{isLoading ? (
						<p className="text-sm text-slate-500">Chargement...</p>
					) : error ? (
						<p className="text-sm text-red-600">{error}</p>
					) : toIssueRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun dossier à émettre.</p>
					) : (
						<div className="space-y-2">
							{toIssueRows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
								>
									<div>
										<p className="font-medium">
											{row.reference} - {row.applicantName}
										</p>
										<p className="text-xs text-slate-500">{row.identityNumber}</p>
									</div>
									{canReview ? (
										<button
											type="button"
											onClick={async () => {
												const result = await runAction(row.id, "ISSUE_PERMIT");
												setMessage(
													result.ok
														? `Permis émis pour ${row.reference}.`
														: result.message
												);
											}}
											className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
										>
											Émettre permis
										</button>
									) : (
										<span className="text-xs text-slate-500">Action réservée au responsable</span>
									)}
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{showIssued && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Permis émis
					</h2>
					{issuedRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun permis émis.</p>
					) : (
						<div className="space-y-2">
							{issuedRows.map((row) => (
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
								</div>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
