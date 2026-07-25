import { getSession } from "next-auth/react";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import { tryCatchSync } from "@/lib/try-catch-tuple";
import type { ConferenceRegistration, Participant } from "../types";

export const sendLoginCode = async (
	id: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const url = `${BACKEND_URL_CONFERENCES}/auth/participant/${id}/send-login-code`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// console.log(response)
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
					: "Erreur lors de l'envoi du code",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getParticipantByCode = async (code: string) => {
	const url = `${BACKEND_URL_CONFERENCES}/public/participant/${code}`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					"Veuillez vous connecter",
				);
			}

			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération du participant",
			);
		}
		// console.log(result);

		return {
			data: result as Partial<Participant>,
			message: "Participant récupéré avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const attachAccommodationToParticipant = async (
	id: string,
	token: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const url = `${BACKEND_URL_CONFERENCES}/participants/${id}/attach`;

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-conference-participant-bearer": token,
			},
		});

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
					: "Erreur lors de la mise à jour",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceRegistrations = async (
	id: string,
	status?: string,
) => {
	const session = await getSession();
	const params = new URLSearchParams();
	if (status) {
		params.append("status", status);
	}

	const url = `${BACKEND_URL_CONFERENCES}/conference/${id}/participants?${params.toString()}`;

	const token = session?.backendTokens?.accessToken;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
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
					: "Échec de la récupération des inscriptions",
			);
		}
		// console.log(result);

		return {
			data: result.data as ConferenceRegistration[],
			message: "Inscriptions récupérées avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceRegistrationById = async (id: string) => {
	const session = await getSession();

	const url = `${BACKEND_URL_CONFERENCES}/participants/${id}`;

	const token = session?.backendTokens?.accessToken;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		// console.log(response);
		const result = await response.json();
		console.log(result);

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
					: "Échec de la récupération de l'inscription",
			);
		}
		// console.log(result);

		return {
			data: result as ConferenceRegistration,
			message: "Inscription récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getCurrentConferenceParticipant = async (token: string) => {
	const url = `${BACKEND_URL_CONFERENCES}/participants/me`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-conference-participant-bearer": token,
			},
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					"Veuillez vous connecter",
				);
			}

			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération du participant",
			);
		}
		// console.log(result);

		const [data, error] = tryCatchSync(
			() => JSON.parse(result.conference.description),
			"PARSE_DESCRIPTION_JSON",
		);
		if (!error) {
			result.conference.description = data;
		}

		return {
			data: result as Participant,
			message: "Participant récupéré avec succès",
			status: "success",
		};
	} catch (error) {
		// if (error instanceof ServerActionError) {
		//   if (error.code === "401") {
		//     redirect("/");
		//   }
		// }
		return createSafeError(error);
	}
};

export const getPaymentUrl = async (
	token: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const url = `${BACKEND_URL_CONFERENCES}/participants/paiement-url`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-conference-participant-bearer": token,
			},
		});

		// console.log(response)
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
					: "Erreur lors de la confirmation du code",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};
