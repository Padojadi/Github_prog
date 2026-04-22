import { getSession } from "next-auth/react";
import { Backend_URL } from "@/lib/constants";

export const getPlatesClient = async () => {
	const session = await getSession();
	const url = `${Backend_URL}/plaque`;

	const token = session?.backendTokens?.accessToken;

	let result;

	try {
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
				result?.message || "Échec de la récupération de la liste des plaques",
			);
		}
	} catch (error) {
		// console.log(error);
		return {
			message: "Échec de la récupération de la liste des types de cartes",
			status: "error",
			errors: result,
		};
	}

	return {
		data: result,
		message: "Liste des plaques récupérée avec succès",
		status: "success",
	};
};
