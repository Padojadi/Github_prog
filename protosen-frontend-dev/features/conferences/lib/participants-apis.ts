"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import { tryCatchSync } from "@/lib/try-catch-tuple";
import { ConferenceRegistration, Participant } from "../types";

export const registerParticipant = async (
	data: FormData,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/participants/register-conference`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				// "Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
			body: data,
		});

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
					: "Erreur lors de l'inscription du participant",
			);
		}

		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const acceptRegistration = async (
	id: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/participants/${id}/accept-subscription`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
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
					: "Erreur lors de l'acceptation de l'inscription.",
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

export const rejectRegistration = async <T>(
	id: string,
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/participants/${id}/reject-subscription`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
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
					: "Erreur lors du rejet de l'inscription.",
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

export const confirmLoginCode = async (
	id: string,
	data: any,
	_errorMessage: string,
	successMessage: string,
) => {
	const url = `${BACKEND_URL_CONFERENCES}/auth/participant/${id}/confirm-login`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
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
