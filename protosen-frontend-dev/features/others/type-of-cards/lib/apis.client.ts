import { getSession } from "next-auth/react";
import { Backend_URL } from "@/lib/constants";

export const getCardTypesClient = async () => {
	const session = await getSession();
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
