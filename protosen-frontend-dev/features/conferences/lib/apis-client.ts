import { getSession } from "next-auth/react";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type {
	Conference,
	ConferenceAccommodation,
	ConferencePublic,
	ConferencePublicGetAll,
	ParticipantTypeAssigned,
	StatusHistory,
} from "../types";

export const getConferencesRequest = async () => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/conference?status=PENDING&status=ACCEPTED&status=VALIDATED&status=CONFIRMED&status=REJECTED&status=REJECTED_PERMANENTLY`;

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
					: "Échec de la récupération de la liste des conférences",
			);
		}

		return {
			data: result.data,
			message: "Liste des conférences récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferences = async (
	page: number,
	perPage: number,
	search: string,
) => {
	const session = await getSession();
	const params = new URLSearchParams();
	params.append("page", page.toString());
	params.append("perPage", perPage.toString());
	params.append("search", search);

	const url = `${BACKEND_URL_CONFERENCES}/conference?${params.toString()}&status=PUBLISHED`;

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
					: "Échec de la récupération de la liste des conférences",
			);
		}

		return {
			data: {
				conferences: result.data as Conference[],
				total: result.total as number,
				currentPage: result.currentPage as number,
				totalPages: result.totalPages as number,
			},
			message: "Liste des conférences récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferencesPublic = async (
	page: number,
	perPage: number,
	search: string,
	startDate?: string,
	endDate?: string,
) => {
	const params = new URLSearchParams();
	params.append("page", page.toString());
	params.append("perPage", perPage.toString());
	params.append("search", search);
	if (startDate) {
		params.append("startDate", startDate);
	}
	if (endDate) {
		params.append("endDate", endDate);
	}

	const url = `${BACKEND_URL_CONFERENCES}/public/conferences?${params.toString()}`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération de la liste des conférences",
			);
		}

		return {
			data: {
				conferences: result.data as ConferencePublicGetAll[],
				total: result.total as number,
				currentPage: result.currentPage as number,
				totalPages: result.totalPages as number,
			},
			message: "Liste des conférences récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceById = async (id: string) => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/conference/${id}`;

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
					: "Échec de la récupération de la conférence",
			);
		}

		try {
			result.description = JSON.parse(result.description);
		} catch {
			result.description = [
				{ type: "p", children: [{ text: result.description }] },
			];
		}
		// console.log(result);

		return {
			data: result as Conference,
			message: "Conférence récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceByIdPublic = async (id: string) => {
	const url = `${BACKEND_URL_CONFERENCES}/public/conferences/${id}`;

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
					result?.message || "Veuillez vous connecter",
				);
			}

			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération de la conférence",
			);
		}

		try {
			result.description = JSON.parse(result.description);
		} catch {
			result.description = [
				{ type: "p", children: [{ text: result.description }] },
			];
		}
		// console.log(result);

		return {
			data: result as ConferencePublic,
			message: "Conférence récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceAccommodationsClient = async (id: string) => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/conference/${id}/accommodations`;

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
					"401",
					result?.message || "Veuillez vous connecter",
				);
			}

			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Échec de la récupération des hébergements",
			);
		}

		return {
			data: result as ConferenceAccommodation[],
			message: "Hébergements récupérés avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceStatusHistoryClient = async (id: string) => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/conference-request/statusHistory/${id}`;

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
					: "Échec de la récupération de l'historique des statuts",
			);
		}

		return {
			data: result as StatusHistory[],
			message: "Hstorique des statuts récupérés avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getConferenceParticipantTypes = async (id: string) => {
	const session = await getSession();
	const url = `${BACKEND_URL_CONFERENCES}/conference/participant-types/${id}`;

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
					: "Échec de la récupération des catégories de participant",
			);
		}

		return {
			data: result.items as ParticipantTypeAssigned[],
			message: "Catégories de participant récupérés avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};
