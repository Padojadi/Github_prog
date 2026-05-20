"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
	RegistrationCreateRequestPayload,
	RegistrationWorkflowAction,
	RegistrationWorkflowRecord,
	RegistrationWorkflowStatus,
} from "../lib/workflow-types";

type ActionResult = { ok: true } | { ok: false; message: string };

const REGISTRATION_WORKFLOW_API_BASE_PATH = "/panel/registrations/api/workflow";

const statusLabelMap: Record<RegistrationWorkflowStatus, string> = {
	PENDING: "En attente",
	MUTATION_VALIDATED: "Mutation validée",
	PERMIT_ISSUED: "Permis émis",
	WITHDRAWN: "Retiré",
	CORRECTION_REQUIRED: "Correction requise",
	REJECTED: "Rejetée",
};

export const registrationStatusBadgeMap: Record<RegistrationWorkflowStatus, string> = {
	PENDING: "bg-amber-100 text-amber-800",
	MUTATION_VALIDATED: "bg-blue-100 text-blue-800",
	PERMIT_ISSUED: "bg-indigo-100 text-indigo-800",
	WITHDRAWN: "bg-emerald-100 text-emerald-800",
	CORRECTION_REQUIRED: "bg-orange-100 text-orange-800",
	REJECTED: "bg-red-100 text-red-800",
};

export const getRegistrationStatusLabel = (status: RegistrationWorkflowStatus) =>
	statusLabelMap[status] ?? status;

const mapApiErrorToMessage = (message: string) => {
	switch (message) {
		case "MOTIF_REQUIS":
			return "Le motif est obligatoire pour cette action.";
		case "ACTION_NON_AUTORISEE":
			return "Vous n'êtes pas autorisé à effectuer cette action.";
		case "DEMANDE_INTROUVABLE":
			return "La demande d'immatriculation est introuvable.";
		case "TRANSITION_INVALIDE":
			return "Le changement d'état demandé est invalide.";
		default:
			return message || "Une erreur est survenue.";
	}
};

const safeParseJsonResponse = async <T>(response: Response): Promise<T | null> => {
	const contentType = response.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		return null;
	}
	try {
		return (await response.json()) as T;
	} catch {
		return null;
	}
};

export function useRegistrationWorkflow() {
	const [records, setRecords] = useState<RegistrationWorkflowRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(REGISTRATION_WORKFLOW_API_BASE_PATH, {
				method: "GET",
				cache: "no-store",
			});
			const result =
				(await safeParseJsonResponse<{
					data?: RegistrationWorkflowRecord[];
					message?: string;
				}>(response)) ?? {};

			if (!response.ok) {
				throw new Error(
					result.message ||
						"Session expirée ou réponse inattendue du serveur. Rechargez la page."
				);
			}
			setRecords(Array.isArray(result.data) ? result.data : []);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Erreur lors du chargement des demandes.";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const createRequest = useCallback(
		async (payload: RegistrationCreateRequestPayload): Promise<ActionResult> => {
			try {
				const response = await fetch(REGISTRATION_WORKFLOW_API_BASE_PATH, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});
				const result =
					(await safeParseJsonResponse<{ message?: string }>(response)) ?? {};
				if (!response.ok) {
					return {
						ok: false,
						message: mapApiErrorToMessage(
							result.message ||
								"Session expirée ou réponse inattendue du serveur. Rechargez la page."
						),
					};
				}
				await refresh();
				return { ok: true };
			} catch {
				return { ok: false, message: "Impossible de soumettre la demande." };
			}
		},
		[refresh]
	);

	const runAction = useCallback(
		async (
			id: string,
			action: RegistrationWorkflowAction,
			reason?: string
		): Promise<ActionResult> => {
			try {
				const response = await fetch(`${REGISTRATION_WORKFLOW_API_BASE_PATH}/${id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ action, reason }),
				});
				const result =
					(await safeParseJsonResponse<{ message?: string }>(response)) ?? {};
				if (!response.ok) {
					return {
						ok: false,
						message: mapApiErrorToMessage(
							result.message ||
								"Session expirée ou réponse inattendue du serveur. Rechargez la page."
						),
					};
				}
				await refresh();
				return { ok: true };
			} catch {
				return { ok: false, message: "Action impossible pour le moment." };
			}
		},
		[refresh]
	);

	const stats = useMemo(() => {
		const statusCounter = records.reduce<Record<RegistrationWorkflowStatus, number>>(
			(acc, row) => {
				acc[row.status] += 1;
				return acc;
			},
			{
				PENDING: 0,
				MUTATION_VALIDATED: 0,
				PERMIT_ISSUED: 0,
				WITHDRAWN: 0,
				CORRECTION_REQUIRED: 0,
				REJECTED: 0,
			}
		);
		return {
			total: records.length,
			...statusCounter,
		};
	}, [records]);

	return {
		records,
		stats,
		isLoading,
		error,
		refresh,
		createRequest,
		runAction,
	};
}
