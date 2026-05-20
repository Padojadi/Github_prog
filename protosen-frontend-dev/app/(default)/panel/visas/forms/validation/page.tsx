"use client";

import { useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
	getVisaStatusLabel,
	useVisaWorkflow,
} from "@/features/visas/hooks/use-visa-workflow";
import WorkflowStatusBadge from "@/features/visas/components/workflow-status-badge";
import type { VisaWorkflowRecord } from "@/features/visas/lib/workflow-types";

export default function VisaValidationFormPage() {
	const currentUser = useCurrentUser();
	const { records, isLoading, error, runAction, stats } = useVisaWorkflow();
	const [message, setMessage] = useState<string | null>(null);
	const [reasonByRow, setReasonByRow] = useState<Record<string, string>>({});

	const normalizedRole = String(currentUser?.role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");

	const canReview = normalizedRole === "admin" || normalizedRole === "super_admin" || normalizedRole === "superadmin";

	const pendingRows = useMemo(
		() => records.filter((row) => row.status === "PENDING"),
		[records]
	);
	const acceptedRows = useMemo(
		() => records.filter((row) => row.status === "ACCEPTED"),
		[records]
	);
	const decidedRows = useMemo(
		() =>
			records.filter((row) =>
				["REJECTED", "RETURNED", "EMITTED", "WITHDRAWN"].includes(row.status)
			),
		[records]
	);

	const performAction = async (
		row: VisaWorkflowRecord,
		action: "ACCEPT" | "REJECT" | "RETURN" | "EMIT"
	) => {
		const reason = reasonByRow[row.id] || "";
		if ((action === "REJECT" || action === "RETURN") && !reason.trim()) {
			setMessage("Veuillez renseigner le motif pour rejeter ou retourner la demande.");
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
					Visa - Dossier des demandes en attente
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Le responsable Visa traite ici les demandes soumises par les points focaux :
					accepter, rejeter (avec motif) ou retourner (avec raison).
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
				<SummaryCard label="En attente" value={stats.PENDING} />
				<SummaryCard label="Acceptée" value={stats.ACCEPTED} />
				<SummaryCard label="Émis" value={stats.EMITTED} />
				<SummaryCard label="Retiré" value={stats.WITHDRAWN} />
				<SummaryCard label="Décisions négatives" value={stats.REJECTED + stats.RETURNED} />
			</div>

			{message && (
				<p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200">
					{message}
				</p>
			)}

			{!canReview && (
				<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
					Ce dossier est réservé au responsable Visa (admin/super admin). Vous pouvez
					consulter le statut de vos demandes depuis le formulaire de demande.
				</div>
			)}

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Demandes de visa en attente
				</h2>
				<VisaValidationTable
					rows={pendingRows}
					isLoading={isLoading}
					error={error}
					reasonByRow={reasonByRow}
					onReasonChange={(id, reason) =>
						setReasonByRow((prev) => ({ ...prev, [id]: reason }))
					}
					onAccept={(row) => performAction(row, "ACCEPT")}
					onReject={(row) => performAction(row, "REJECT")}
					onReturn={(row) => performAction(row, "RETURN")}
					showReviewActions={canReview}
				/>
			</section>

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Demandes acceptées (émission talon)
				</h2>
				<VisaAcceptedTable
					rows={acceptedRows}
					isLoading={isLoading}
					error={error}
					onEmit={(row) => performAction(row, "EMIT")}
					canReview={canReview}
				/>
			</section>

			<section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
					Historique des décisions
				</h2>
				{isLoading ? (
					<p className="text-sm text-slate-500">Chargement...</p>
				) : decidedRows.length === 0 ? (
					<p className="text-sm text-slate-500">Aucune décision enregistrée.</p>
				) : (
					<div className="space-y-2">
						{decidedRows.map((row) => (
							<div
								key={row.id}
								className="flex flex-col gap-1 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
							>
								<div className="flex items-center justify-between">
									<span className="font-medium">{row.reference}</span>
									<WorkflowStatusBadge status={row.status} />
								</div>
								<p className="text-slate-600 dark:text-slate-300">
									{row.applicantFirstName} {row.applicantLastName} - {row.passportNumber}
								</p>
								{row.statusReason && (
									<p className="text-xs text-slate-500 dark:text-slate-400">
										Motif: {row.statusReason}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</section>
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

function VisaValidationTable({
	rows,
	isLoading,
	error,
	reasonByRow,
	onReasonChange,
	onAccept,
	onReject,
	onReturn,
	showReviewActions,
}: {
	rows: VisaWorkflowRecord[];
	isLoading: boolean;
	error: string | null;
	reasonByRow: Record<string, string>;
	onReasonChange: (id: string, reason: string) => void;
	onAccept: (row: VisaWorkflowRecord) => void;
	onReject: (row: VisaWorkflowRecord) => void;
	onReturn: (row: VisaWorkflowRecord) => void;
	showReviewActions: boolean;
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
						<th className="px-3 py-2 text-left font-medium">Passeport</th>
						<th className="px-3 py-2 text-left font-medium">Type visa</th>
						<th className="px-3 py-2 text-left font-medium">Soumise le</th>
						{showReviewActions && <th className="px-3 py-2 text-left font-medium">Motif</th>}
						{showReviewActions && <th className="px-3 py-2 text-left font-medium">Actions</th>}
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
					{rows.map((row) => (
						<tr key={row.id}>
							<td className="px-3 py-2 font-medium">{row.reference}</td>
							<td className="px-3 py-2">
								{row.applicantFirstName} {row.applicantLastName}
							</td>
							<td className="px-3 py-2">{row.passportNumber}</td>
							<td className="px-3 py-2">{row.visaType}</td>
							<td className="px-3 py-2">
								{new Date(row.submittedAt).toLocaleString("fr-FR")}
							</td>
							{showReviewActions && (
								<td className="px-3 py-2">
									<textarea
										value={reasonByRow[row.id] || ""}
										onChange={(event) => onReasonChange(row.id, event.target.value)}
										placeholder="Motif (rejet/retour)"
										className="form-input min-h-16 w-56"
									/>
								</td>
							)}
							{showReviewActions && (
								<td className="px-3 py-2">
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => onAccept(row)}
											className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
										>
											Accepter
										</button>
										<button
											type="button"
											onClick={() => onReturn(row)}
											className="rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white hover:bg-orange-500"
										>
											Retourner
										</button>
										<button
											type="button"
											onClick={() => onReject(row)}
											className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
										>
											Rejeter
										</button>
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function VisaAcceptedTable({
	rows,
	isLoading,
	error,
	onEmit,
	canReview,
}: {
	rows: VisaWorkflowRecord[];
	isLoading: boolean;
	error: string | null;
	onEmit: (row: VisaWorkflowRecord) => void;
	canReview: boolean;
}) {
	if (isLoading) return <p className="text-sm text-slate-500">Chargement...</p>;
	if (error) return <p className="text-sm text-red-600">{error}</p>;
	if (rows.length === 0)
		return <p className="text-sm text-slate-500">Aucune demande acceptée à émettre.</p>;

	return (
		<div className="space-y-2">
			{rows.map((row) => (
				<div
					key={row.id}
					className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700 md:flex-row md:items-center md:justify-between"
				>
					<div>
						<p className="font-medium">
							{row.reference} - {row.applicantFirstName} {row.applicantLastName}
						</p>
						<p className="text-xs text-slate-500">Statut: {getVisaStatusLabel(row.status)}</p>
					</div>
					{canReview ? (
						<button
							type="button"
							onClick={() => onEmit(row)}
							className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
						>
							Émettre le talon + notifier le point focal
						</button>
					) : (
						<span className="text-xs text-slate-500">Action réservée au responsable Visa</span>
					)}
				</div>
			))}
		</div>
	);
}
