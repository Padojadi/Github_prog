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

export default function RegistrationWithdrawalFormPage() {
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

	const issuedRows = useMemo(() => {
		if (canReview) {
			return records.filter((row) => row.status === "PERMIT_ISSUED");
		}
		if (!currentUser?.id) {
			return [];
		}
		return records.filter(
			(row) => row.status === "PERMIT_ISSUED" && row.submittedBy.id === currentUser.id
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

	const showIssued = !statusFilter || statusFilter === "PERMIT_ISSUED";
	const showWithdrawn = !statusFilter || statusFilter === "WITHDRAWN";

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

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}
			{statusFilter && (
				<p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
					Filtre actif: <strong>{getRegistrationStatusLabel(statusFilter)}</strong>.{" "}
					<Link href="/panel/registrations/forms/retrait" className="underline">
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			{showIssued && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Permis émis disponibles pour retrait
					</h2>
					{isLoading ? (
						<p className="text-sm text-slate-500">Chargement...</p>
					) : error ? (
						<p className="text-sm text-red-600">{error}</p>
					) : issuedRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucun permis en attente de retrait.</p>
					) : (
						<div className="space-y-2">
							{issuedRows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
								>
									<div>
										<p className="font-medium">
											{row.reference} - {row.applicantName}
										</p>
										<RegistrationWorkflowStatusBadge status={row.status} />
									</div>
									<button
										type="button"
										onClick={async () => {
											const result = await runAction(row.id, "WITHDRAW");
											setMessage(
												result.ok
													? `Retrait confirmé pour ${row.reference}.`
													: result.message
											);
										}}
										className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
									>
										Confirmer retrait
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{showWithdrawn && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Historique retraits
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
										<p className="font-medium">
											{row.reference} - {row.applicantName}
										</p>
										<RegistrationWorkflowStatusBadge status={row.status} />
									</div>
									<p className="text-xs text-slate-500">
										Retiré le{" "}
										{row.withdrawnAt
											? new Date(row.withdrawnAt).toLocaleString("fr-FR")
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
