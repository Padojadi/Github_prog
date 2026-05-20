import { getSession } from "next-auth/react";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type { ParticipantType } from "../types";

export const getParticipantTypes = async () => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/referentiels/participantType`;

	try {
		const token = session?.backendTokens?.accessToken;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					result?.message || "Veuillez vous connecter",
				);
			}

			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération de la liste des types de participants",
			);
		}

		return {
			data: result.data as ParticipantType[],
			message: "Liste des types de participants récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		// console.log(error);
		return createSafeError(error);
	}
};
