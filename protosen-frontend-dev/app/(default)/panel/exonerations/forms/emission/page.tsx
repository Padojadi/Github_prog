"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import ExonerationWorkflowStatusBadge from "@/features/exonerations/components/workflow-status-badge";
import {
	getExonerationStatusLabel,
	useExonerationWorkflow,
} from "@/features/exonerations/hooks/use-exoneration-workflow";
import type { ExonerationWorkflowStatus } from "@/features/exonerations/lib/workflow-types";

export default function ExonerationEmissionFormPage() {
	const searchParams = useSearchParams();
	const currentUser = useCurrentUser();
	const { records, isLoading, error, runAction } = useExonerationWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const statusFilter = searchParams.get("status") as ExonerationWorkflowStatus | null;

	const normalizedRole = String(currentUser?.role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");
	const canReview =
		normalizedRole === "admin" ||
		normalizedRole === "super_admin" ||
		normalizedRole === "superadmin";

	const toEmitRows = useMemo(
		() => records.filter((row) => row.status === "CUSTOMS_VALIDATED"),
		[records]
	);
	const emittedRows = useMemo(
		() => records.filter((row) => row.status === "EMITTED"),
		[records]
	);
	const transferredRows = useMemo(
		() => records.filter((row) => row.status === "TRANSFERRED"),
		[records]
	);

	const showToEmit = !statusFilter || statusFilter === "CUSTOMS_VALIDATED";
	const showEmitted = !statusFilter || statusFilter === "EMITTED";
	const showTransferred = !statusFilter || statusFilter === "TRANSFERRED";

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

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}
			{statusFilter && (
				<p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
					Filtre actif: <strong>{getExonerationStatusLabel(statusFilter)}</strong>.{" "}
					<Link href="/panel/exonerations/forms/emission" className="underline">
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			{showToEmit && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Demandes validées Douane à émettre
					</h2>
					{isLoading ? (
						<p className="text-sm text-slate-500">Chargement...</p>
					) : error ? (
						<p className="text-sm text-red-600">{error}</p>
					) : toEmitRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucune demande à émettre.</p>
					) : (
						<div className="space-y-2">
							{toEmitRows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
								>
									<div>
										<p className="font-medium">
											{row.reference} - Dossier {row.dossierNumber}
										</p>
										<p className="text-xs text-slate-500">{row.requestType}</p>
									</div>
									{canReview ? (
										<button
											type="button"
											onClick={async () => {
												const result = await runAction(row.id, "EMIT");
												setMessage(
													result.ok
														? `TE émis pour ${row.reference}.`
														: result.message
												);
											}}
											className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
										>
											Émettre TE
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

			{showEmitted && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						TE émis à transférer
					</h2>
					{emittedRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun TE émis à transférer.</p>
					) : (
						<div className="space-y-2">
							{emittedRows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
								>
									<div className="space-y-1">
										<p className="font-medium">
											{row.reference} - Dossier {row.dossierNumber}
										</p>
										<ExonerationWorkflowStatusBadge status={row.status} />
									</div>
									<button
										type="button"
										onClick={async () => {
											const result = await runAction(row.id, "TRANSFER");
											setMessage(
												result.ok
													? `TE transféré pour ${row.reference}.`
													: result.message
											);
										}}
										className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
									>
										Confirmer transfert
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{showTransferred && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						TE transférés
					</h2>
					{transferredRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun TE transféré.</p>
					) : (
						<div className="space-y-2">
							{transferredRows.map((row) => (
								<div
									key={row.id}
									className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
								>
									<div className="flex items-center justify-between">
										<p className="font-medium">
											{row.reference} - Dossier {row.dossierNumber}
										</p>
										<ExonerationWorkflowStatusBadge status={row.status} />
									</div>
									<p className="text-xs text-slate-500">
										Transféré le{" "}
										{row.transferredAt
											? new Date(row.transferredAt).toLocaleString("fr-FR")
											: "-"}
									</p>
								</div>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
