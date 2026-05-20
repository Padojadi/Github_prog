"use server";
import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type { ConferencePass } from "../types";

export const getConferenceTickets = async (id: string) => {
	const session = await getServerSession(authOptions);
	const url = `${BACKEND_URL_CONFERENCES}/ticket/conference/${id}`;

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
					: "Échec de la récupération de la liste des tickets",
			);
		}

		return {
			data: result as ConferencePass[],
			message: "Liste des tickets récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getTicketById = async (id: string) => {
	const session = await getServerSession(authOptions);
	const url = `${BACKEND_URL_CONFERENCES}/ticket/${id}`;

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
					: "Échec de la récupération du ticket",
			);
		}

		// console.log(result);

		return {
			data: result as ConferencePass,
			message: "Ticket récupéré avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const createTicket = async <T>(
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/ticket`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
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
					: "Erreur lors de la création du ticket",
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

export const updateTicket = async <T>(
	id: unknown,
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/ticket/${id}`;
	// console.log(data, id);

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
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
					: "Erreur lors de la mise à jour du ticket.",
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

export const deleteTicket = async (
	id: unknown,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/ticket/${id}`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
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
					: "Erreur lors de la suppression du ticket.",
			);
		}

		// return result;
		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};
