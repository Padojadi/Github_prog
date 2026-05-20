"use client";

import { useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import WorkflowStatusBadge from "@/features/visas/components/workflow-status-badge";
import { useVisaWorkflow } from "@/features/visas/hooks/use-visa-workflow";
import type { VisaWorkflowRecord } from "@/features/visas/lib/workflow-types";

export default function VisaWithdrawalFormPage() {
	const currentUser = useCurrentUser();
	const { records, isLoading, error, runAction } = useVisaWorkflow();
	const [message, setMessage] = useState<string | null>(null);

	const normalizedRole = String(currentUser?.role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");

	const canReview = normalizedRole === "admin" || normalizedRole === "super_admin" || normalizedRole === "superadmin";

	const emittedRows = useMemo(() => {
		if (canReview) {
			return records.filter((row) => row.status === "EMITTED");
		}
		if (!currentUser?.id) {
			return [];
		}
		return records.filter(
			(row) => row.status === "EMITTED" && row.submittedBy.id === currentUser.id
		);
	}, [records, canReview, currentUser?.id]);

	const withdrawnRows = useMemo(() => {
		if (canReview) {
			return records.filter((row) => row.status === "WITHDRAWN");
		}
		if (!currentUser?.id) {
			return [];
		}
		return records.filter(
			(row) => row.status === "WITHDRAWN" && row.submittedBy.id === currentUser.id
		);
	}, [records, canReview, currentUser?.id]);

	const confirmWithdrawal = async (row: VisaWorkflowRecord) => {
		const result = await runAction(row.id, "WITHDRAW");
		setMessage(
			result.ok
				? `Retrait confirmé pour ${row.reference}.`
				: `Retrait impossible: ${result.message}`
		);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Retrait Visa
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Après émission du talon par le responsable Visa, le point focal est notifié et
					peut confirmer le retrait.
				</p>
			</div>

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Visas émis disponibles pour retrait
				</h2>
				{isLoading ? (
					<p className="text-sm text-slate-500">Chargement...</p>
				) : error ? (
					<p className="text-sm text-red-600">{error}</p>
				) : emittedRows.length === 0 ? (
					<p className="text-sm text-slate-500">
						Aucun visa émis en attente de retrait pour le moment.
					</p>
				) : (
					<div className="space-y-2">
						{emittedRows.map((row) => (
							<div
								key={row.id}
								className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
							>
								<div className="space-y-1">
									<p className="font-medium">
										{row.reference} - {row.applicantFirstName} {row.applicantLastName}
									</p>
									<p className="text-xs text-slate-500">
										Notifié le{" "}
										{row.notifiedAt
											? new Date(row.notifiedAt).toLocaleString("fr-FR")
											: "-"}
									</p>
									<WorkflowStatusBadge status={row.status} />
								</div>
								<button
									type="button"
									onClick={() => confirmWithdrawal(row)}
									className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
								>
									Confirmer le retrait
								</button>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Historique des retraits
				</h2>
				{withdrawnRows.length === 0 ? (
					<p className="text-sm text-slate-500">Aucun retrait enregistré.</p>
				) : (
					<div className="space-y-2">
						{withdrawnRows.map((row) => (
							<div
								key={row.id}
								className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
							>
								<div className="flex items-center justify-between">
									<p className="font-medium">{row.reference}</p>
									<WorkflowStatusBadge status={row.status} />
								</div>
								<p className="text-xs text-slate-500">
									Retiré le{" "}
									{row.withdrawnAt
										? new Date(row.withdrawnAt).toLocaleString("fr-FR")
										: "-"}
									{" - "}
									par {row.withdrawnBy || "-"}
								</p>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
