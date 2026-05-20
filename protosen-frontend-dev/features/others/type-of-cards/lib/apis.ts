"use server";
import { getServerSession } from "next-auth";
import { convertDateToLocalString } from "@/components/utils/utils";
import { fetchData } from "@/lib/actions/common";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";

export const getCardTypes = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = ["createdAt", "updatedAt"];
	const url = `${Backend_URL}/card-types`;

	let result;
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
		result = await response.json();
		// console.log(result);

		if (!response.ok) {
			throw new Error(
				"Échec de la récupération de la liste des types de cartes",
			);
		}
	} catch (err) {
		// console.log(err);
		return {
			message: "Échec de la récupération de la liste des types de cartes",
			status: "error",
			errors: result,
		};
	}
	return {
		data: result,
		message: "Liste des types de carte récupérée avec succès",
		status: "success",
	};
};

export const createCardTypes = async <T>(
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/card-types`;

	let result;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(data),
		});

    result = await response.json();
    // console.log(result);

		if (!response.ok) {
			throw new Error(result?.error || "Une erreur est survenue!");
		}
	} catch (error) {
		// console.log(error);
		return {
			message: errorMessage,
			status: "error",
			errors: result,
		};
	}

	return {
		data: result,
		status: "success",
		message: successMessage,
	};
};

export const updateCardTypes = async <T>(
	id: unknown,
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/card-types/${id}`;

	let result;

	try {
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(data),
		});
		// console.log(response);
		result = await response.json();
		// console.log(result);

		if (!response.ok) {
			throw new Error(result?.error || "Une erreur est survenue!");
		}
	} catch (error) {
		// console.log(error);
		return {
			message: errorMessage,
			status: "error",
			errors: result,
		};
	}

	return {
		data: result,
		status: "success",
		message: successMessage,
	};
};

export const deleteCardTypes = async (
	id: unknown,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/card-types/${id}`;

	let result;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			result = await response.json();
			throw new Error(result?.error || "Une erreur est survenue!");
		}
	} catch (error) {
		// console.log(error);
		return {
			message: errorMessage,
			status: "error",
			errors: result,
		};
	}

	return {
		status: "success",
		message: successMessage,
	};
};
