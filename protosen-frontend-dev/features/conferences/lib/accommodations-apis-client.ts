import { getSession } from "next-auth/react";
import { convertDateToLocalString } from "@/components/utils/utils";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type { ConferenceHotel } from "../types";

export const getAccommodations = async () => {
	const session = await getSession();
	const dateFields = ["createdAt", "updatedAt", "startDate", "endDate"];
	const url = `${BACKEND_URL_CONFERENCES}/accommodation`;

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
		let result = await response.json();
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
					: "Échec de la récupération de la liste des hébergements",
			);
		}

		result = result.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});

		return {
			data: result as ConferenceHotel[],
			message: "Liste des hébergements récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const getAccommodationById = async (id: string) => {
	const session = await getSession();

	const url = `${BACKEND_URL_CONFERENCES}/accommodation/${id}`;

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
					: "Échec de la récupération de l'hébergement",
			);
		}

		// console.log(result);

		return {
			data: result as ConferenceHotel,
			message: "Hébergement récupérée avec succès",
			status: "success",
		};
	} catch (error) {
		return createSafeError(error);
	}
};
