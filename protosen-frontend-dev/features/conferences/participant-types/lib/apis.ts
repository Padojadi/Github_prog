"use server";
import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";

export const createParticipantTypes = async <T>(
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/referentiels/participantType`;

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
				result?.code ? getApiErrorMessage(result?.code) : errorMessage,
			);
		}

		return {
			message: successMessage,
			status: "success",
		};
	} catch (error) {
		// console.log(error);
		return createSafeError(error);
	}
};

export const updateParticipantTypes = async <T>(
	id: unknown,
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/referentiels/participantType/${id}`;

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
				result?.code ? getApiErrorMessage(result?.code) : errorMessage,
			);
		}

		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		console.log(error);
		return createSafeError(error);
	}
};

export const deleteParticipantTypes = async (
	id: unknown,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/referentiels/participantType/${id}`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const result = await response.json();

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					result?.message || "Veuillez vous connecter",
				);
			}
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code ? getApiErrorMessage(result?.code) : errorMessage,
			);
		}

		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		// console.log(error);
		return createSafeError(error);
	}
};
