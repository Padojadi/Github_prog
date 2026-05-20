"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ExonerationWorkflowStatusBadge from "@/features/exonerations/components/workflow-status-badge";
import {
	getExonerationStatusLabel,
	useExonerationWorkflow,
} from "@/features/exonerations/hooks/use-exoneration-workflow";
import type { ExonerationWorkflowStatus } from "@/features/exonerations/lib/workflow-types";

export default function ExonerationRejectionNotificationFormPage() {
	const searchParams = useSearchParams();
	const { records, isLoading, error } = useExonerationWorkflow();
	const statusFilter = searchParams.get("status") as ExonerationWorkflowStatus | null;

	const rejectedRows = useMemo(
		() => records.filter((row) => row.status === "REJECTED"),
		[records]
	);
	const returnedRows = useMemo(
		() => records.filter((row) => row.status === "RETURNED"),
		[records]
	);
	const filteredRows = useMemo(() => {
		if (statusFilter === "REJECTED") return rejectedRows;
		if (statusFilter === "RETURNED") return returnedRows;
		return [...rejectedRows, ...returnedRows];
	}, [rejectedRows, returnedRows, statusFilter]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Notification de rejet
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Notification officielle des demandes rejetées ou retournées avec motif.
				</p>
			</div>

			{statusFilter && (
				<p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
					Filtre actif: <strong>{getExonerationStatusLabel(statusFilter)}</strong>.{" "}
					<Link
						href="/panel/exonerations/forms/notification-rejet"
						className="underline"
					>
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Dossiers à notifier
				</h2>
				{isLoading ? (
					<p className="text-sm text-slate-500">Chargement...</p>
				) : error ? (
					<p className="text-sm text-red-600">{error}</p>
				) : filteredRows.length === 0 ? (
					<p className="text-sm text-slate-500">Aucun dossier à notifier.</p>
				) : (
					<div className="space-y-2">
						{filteredRows.map((row) => (
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
									Motif à notifier: {row.statusReason || "-"}
								</p>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
