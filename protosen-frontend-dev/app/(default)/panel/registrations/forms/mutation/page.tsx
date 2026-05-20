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
import type {
	RegistrationWorkflowRecord,
	RegistrationWorkflowStatus,
} from "@/features/registrations/lib/workflow-types";

export default function RegistrationMutationFormPage() {
	const searchParams = useSearchParams();
	const currentUser = useCurrentUser();
	const { records, isLoading, error, runAction, stats } = useRegistrationWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const [reasonByRow, setReasonByRow] = useState<Record<string, string>>({});
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

	const pendingRows = useMemo(
		() => records.filter((row) => row.status === "PENDING"),
		[records]
	);
	const processedRows = useMemo(
		() =>
			records.filter((row) =>
				["MUTATION_VALIDATED", "CORRECTION_REQUIRED", "REJECTED"].includes(row.status)
			),
		[records]
	);
	const filteredProcessedRows = useMemo(() => {
		if (!statusFilter) return processedRows;
		return processedRows.filter((row) => row.status === statusFilter);
	}, [processedRows, statusFilter]);
	const showPending = !statusFilter || statusFilter === "PENDING";
	const showProcessed =
		!statusFilter ||
		["MUTATION_VALIDATED", "CORRECTION_REQUIRED", "REJECTED"].includes(statusFilter);

	const performAction = async (
		row: RegistrationWorkflowRecord,
		action: "VALIDATE_MUTATION" | "REQUEST_CORRECTION" | "REJECT"
	) => {
		const reason = reasonByRow[row.id] || "";
		if ((action === "REQUEST_CORRECTION" || action === "REJECT") && !reason.trim()) {
			setMessage("Veuillez renseigner un motif.");
			return;
		}
		const result = await runAction(row.id, action, reason);
		setMessage(
			result.ok
				? `Action ${action} appliquée sur ${row.reference}.`
				: result.message
		);
		if (result.ok) {
			setReasonByRow((prev) => ({ ...prev, [row.id]: "" }));
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Formulaire - Mutation
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Mise à jour et mutation d'un dossier d'immatriculation existant.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<SummaryCard label="En attente" value={stats.PENDING} />
				<SummaryCard label="Mutation validée" value={stats.MUTATION_VALIDATED} />
				<SummaryCard label="Correction requise" value={stats.CORRECTION_REQUIRED} />
				<SummaryCard label="Rejetées" value={stats.REJECTED} />
			</div>

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}
			{statusFilter && (
				<p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
					Filtre actif: <strong>{getRegistrationStatusLabel(statusFilter)}</strong>.{" "}
					<Link href="/panel/registrations/forms/mutation" className="underline">
						Afficher toutes les rubriques
					</Link>
				</p>
			)}

			{showPending && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Demandes en attente de mutation
					</h2>
					<MutationReviewTable
						rows={pendingRows}
						isLoading={isLoading}
						error={error}
						canReview={canReview}
						reasonByRow={reasonByRow}
						onReasonChange={(id, reason) =>
							setReasonByRow((prev) => ({ ...prev, [id]: reason }))
						}
						onValidate={(row) => performAction(row, "VALIDATE_MUTATION")}
						onCorrection={(row) => performAction(row, "REQUEST_CORRECTION")}
						onReject={(row) => performAction(row, "REJECT")}
					/>
				</section>
			)}

			{showProcessed && (
				<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
						Historique mutation
					</h2>
					{isLoading ? (
						<p className="text-sm text-slate-500">Chargement...</p>
					) : filteredProcessedRows.length === 0 ? (
						<p className="text-sm text-slate-500">Aucune décision enregistrée.</p>
					) : (
						<div className="space-y-2">
							{filteredProcessedRows.map((row) => (
								<div
									key={row.id}
									className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
								>
									<div className="flex items-center justify-between">
										<p className="font-medium">{row.reference}</p>
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

function SummaryCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
			<p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
			<p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
				{value}
			</p>
		</div>
	);
}

function MutationReviewTable({
	rows,
	isLoading,
	error,
	canReview,
	reasonByRow,
	onReasonChange,
	onValidate,
	onCorrection,
	onReject,
}: {
	rows: RegistrationWorkflowRecord[];
	isLoading: boolean;
	error: string | null;
	canReview: boolean;
	reasonByRow: Record<string, string>;
	onReasonChange: (id: string, reason: string) => void;
	onValidate: (row: RegistrationWorkflowRecord) => void;
	onCorrection: (row: RegistrationWorkflowRecord) => void;
	onReject: (row: RegistrationWorkflowRecord) => void;
}) {
	if (isLoading) return <p className="text-sm text-slate-500">Chargement...</p>;
	if (error) return <p className="text-sm text-red-600">{error}</p>;
	if (rows.length === 0)
		return <p className="text-sm text-slate-500">Aucune demande en attente.</p>;

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
				<thead className="bg-slate-50 dark:bg-slate-800">
					<tr>
						<th className="px-3 py-2 text-left font-medium">Référence</th>
						<th className="px-3 py-2 text-left font-medium">Demandeur</th>
						<th className="px-3 py-2 text-left font-medium">Identité</th>
						<th className="px-3 py-2 text-left font-medium">Motif</th>
						<th className="px-3 py-2 text-left font-medium">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
					{rows.map((row) => (
						<tr key={row.id}>
							<td className="px-3 py-2 font-medium">{row.reference}</td>
							<td className="px-3 py-2">{row.applicantName}</td>
							<td className="px-3 py-2">{row.identityNumber}</td>
							<td className="px-3 py-2">
								<textarea
									value={reasonByRow[row.id] || ""}
									onChange={(event) => onReasonChange(row.id, event.target.value)}
									placeholder="Motif correction/rejet"
									className="form-input min-h-16 w-56"
								/>
							</td>
							<td className="px-3 py-2">
								{canReview ? (
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => onValidate(row)}
											className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
										>
											Valider mutation
										</button>
										<button
											type="button"
											onClick={() => onCorrection(row)}
											className="rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white hover:bg-orange-500"
										>
											Demander correction
										</button>
										<button
											type="button"
											onClick={() => onReject(row)}
											className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
										>
											Rejeter
										</button>
									</div>
								) : (
									<span className="text-xs text-slate-500">Action réservée au responsable</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
