"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { schemaHolderNewRequest } from "@/app/(default)/panel/diplomatic/holders/formMeta";
import { convertDateToLocalString } from "@/components/utils/utils";
import { authOptions } from "../../auth/authOptions";
import { Backend_URL } from "../../constants";
import {
	createData,
	deleteDataFiles,
	fetchData,
	submitData,
	submitDataFiles,
	updateData,
	updateDataFiles,
	validateData,
} from "../common";

// Holders Actions
const documentsStageParamsForUnprintedCards =
	"?documentStage[]=confirmed&documentStage[]=onhold&documentStage[]=pending&documentStage[]=accepted&documentStage[]=rejected";

export const createHolderNewRequest = async (dataToSend: unknown) => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
	];
	const successMessage = "Nouvelle demande créée avec succès";
	const errorMessage = "Échec de la création de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/holders";

	const res = await createData(
		`${Backend_URL}/card/owner`,
		dataToSend,
		schemaHolderNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const updateHolderNewRequest = async (dataToSend: unknown) => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
	];
	const id = (dataToSend as { [x: string]: string })["id"];
	const successMessage = "Nouvelle demande mise à jour avec succès";
	const errorMessage = "Échec de la mise à jour de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/holders";

	const res = await updateData(
		`${Backend_URL}/card/owner/${id}`,
		dataToSend,
		schemaHolderNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const fetchHolderCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/owner/${id}`,
		"Informations de la carte du titulaire récupérées avec succès",
		"Échec de la récupération des informations de la carte du titulaire",
	);
	return res;
};

export const fetchHoldersCards = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	let url = `${Backend_URL}/card/owner${documentsStageParamsForUnprintedCards}`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list${documentsStageParamsForUnprintedCards}`;
	}

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersCardsAll = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	let url = `${Backend_URL}/card/owner`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list`;
	}

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const submitHolderDiplomaticCardFiles = async (formData: FormData) => {
	const res = await submitDataFiles(
		formData,
		`${Backend_URL}/card/owner/files`,
		"Fichiers soumis avec succès",
		"Échec de la soumission des fichiers",
	);
	return res;
};

export const updateHolderDiplomaticCardFiles = async (formData: FormData) => {
	const id = formData.get("ownerDiplomaticCardId");
	const revalidatePath = `/panel/diplomatic/holders/${id}/files-form`;
	const res = await updateDataFiles(
		formData,
		`${Backend_URL}/card/owner/files`,
		"Fichiers mis à jour avec succès",
		"Échec de la mise à jour des fichiers",
		revalidatePath,
	);
	return res;
};

export const deleteHolderDCFiles = async (formData: FormData) => {
	const id = formData.get("ownerDiplomaticCardId");
	const revalidatePath = `/panel/diplomatic/holders/${id}/files-form`;
	const res = await deleteDataFiles(
		formData,
		`${Backend_URL}/card/owner/files/other/delete/${id}`,
		"Fichiers supprimés avec succès",
		"Échec de la suppression des fichiers",
		revalidatePath,
	);
	return res;
};

export const submitHolderDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/owner/pointfocal/validate/${id}`,
		"L'état de la carte du titulaire a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du titulaire",
		"/panel/diplomatic/holders",
	);
	return res;
};

export const validateHolderDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/owner/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/owner/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}
	const res = await validateData(
		url,
		formData,
		"L'état de la carte du titulaire a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du titulaire",
		"/panel/diplomatic/holders",
	);
	return res;
};

export const fetchActiveHoldersCards = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
	];

	let url = `${Backend_URL}/card/owner?documentStage[]=printed&expired=false`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list?documentStage[]=printed&expired=false`;
	}

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			row._sourceType = "base";
			return row;
		});
	}

	// Fetch renew printed cards
	const renewUrl = `${Backend_URL}/card/owner/renew/admin/list?documentStage[]=printed&expired=false`;
	const renewRes = await fetchData(
		renewUrl,
		"Liste des renouvellements récupérées avec succès",
		"Échec de la récupération des renouvellements",
	);

	if (renewRes.status === "success" && res.status === "success") {
		const renewRows = renewRes.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			row.firstName = row.previousCard?.firstName ?? row.firstName;
			row.lastName = row.previousCard?.lastName ?? row.lastName;
			row._sourceType = "renew";
			return row;
		});
		res.data.rows = [...res.data.rows, ...renewRows];
	}

	return res;
};

// Holders Actions - Renew

export const getHoldersCardsForRenew = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
		"updatedAt",
	];
	let url = `${Backend_URL}/card/owner?documentStage[]=printed`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list?documentStage[]=printed`;
	}

	const token = session?.backendTokens?.accessToken;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	// console.log(response);
	var result = await response.json();
	// console.log(result);

	if (!response.ok) {
		return {
			message: "Echec de récupération de la liste des cartes des titulaires",
			status: "error",
		};
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});

	// Filter result.data to only include elements where validUntil is less than or equal to 1 months from now and renewals array length less than 2
	const now = new Date();
	const oneMonthFromNow = new Date(now);
	oneMonthFromNow.setMonth(now.getMonth() + 1);

	result.data = result.data.filter((row: any) => {
		if (!row.validUntil) return false;
		// Try to parse the date, fallback to original if already a Date
		const validUntilDate =
			typeof row.validUntil === "string"
				? new Date(row.validUntil)
				: row.validUntil;
		return (
			validUntilDate <= oneMonthFromNow &&
			Array.isArray(row.renewals) &&
			row.renewals.length < 2
		);
	});

	// console.log(result.data[0]);
	return {
		data: result.data,
		message: "Liste des titulaires récupérée avec succès",
		status: "success",
	};
};

export const fetchRenewHoldersCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/owner/renew/admin/list${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des renouvellements des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des renouvellements des titulaires",
	);
	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field]);
			});
			return row;
		});

		res.data.rows = res.data.rows.map((row: any) => {
			mergeFields.forEach((field) => {
				row[field] = row.previousCard[field];
			});
			return row;
		});
	}
	return res;
};

export const createHolderRenewCard = async (id: string) => {
	const session = await getServerSession(authOptions);

	const url = `${Backend_URL}/card/owner/renew/create/${id}`;

	const token = session?.backendTokens?.accessToken;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	// console.log(response);
	var result = await response.json();
	// console.log(result);

	if (!response.ok) {
		return {
			message: "Échec de création du renouvellement de la carte",
			status: "error",
			error: result.message ?? "",
		};
	}

	revalidatePath("/panel/diplomatic/holders/renew");

	return {
		data: result.data,
		message: "Renouvellement créé avec succès",
		status: "success",
	};
};

export const submitRenewHolderDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/owner/renew/pointfocal/validate/${id}`,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/holders/renew",
	);
	return res;
};

export const validateRenewHolderDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/owner/renew/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/owner/renew/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/holders/renew",
	);
	return res;
};

export const fetchRenewHolderCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/owner/renew/${id}`,
		"Informations du renouvellement récupérées avec succès",
		"Échec de la récupération des informations du renouvellement",
	);
	return res;
};

// Holders Actions - Duplicate

export const fetchDuplicateHoldersCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/owner/duplicata${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des duplicatas des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des duplicatas des titulaires",
	);
	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field]);
			});
			return row;
		});

		res.data.rows = res.data.rows.map((row: any) => {
			mergeFields.forEach((field) => {
				row[field] = row.previousCard[field];
			});
			return row;
		});
	}
	return res;
};

export const createHolderDuplicateNewRequest = async (dataToSend: unknown) => {
	const successMessage = "Nouveau duplicata créée avec succès";
	const errorMessage = "Échec de la création du nouveau de duplicata";
	const revalidatePathLink = "/panel/diplomatic/holders/duplicates";

	let result;

	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	try {
		const res = await fetch(
			`${Backend_URL}/card/owner/duplicata`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(dataToSend),
			},
			// schemaHolderNewRequest,
			// dateFields,
			// successMessage,
			// errorMessage,
			// revalidatePath
		);

		result = await res.json();

		if (res.status !== 201) {
			return {
				message: errorMessage,
				status: "error",
				errors: result,
			};
			// throw new Error(errorMessage);
		}
		// console.log(result);

		revalidatePath(revalidatePathLink);
	} catch (error) {
		return {
			message: errorMessage,
			status: "error",
		};
	}
	return {
		data: result.data,
		status: "success",
		message: successMessage,
	};
};

export const submitDuplicateHolderDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/owner/duplicata/pointfocal/validate/${id}`,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/holders/duplicates",
	);
	return res;
};

export const validateDuplicateHolderDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/owner/duplicata/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/owner/duplicata/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/holders/duplicates",
	);
	return res;
};

export const fetchDuplicateHolderCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/owner/duplicata/${id}`,
		"Informations du duplicata récupérées avec succès",
		"Échec de la récupération des informations du duplicata",
	);
	return res;
};

// Autres

export const fetchStatsCards = async () => {
	const res = await fetchData(
		`${Backend_URL}/stats/card`,
		"Statistiques de la carte récupérées avec succès",
		"Échec de la récupération des statistiques de la carte",
	);
	return res;
};

export const fetchStatsCardsRenew = async () => {
	const res = await fetchData(
		`${Backend_URL}/stats/card/renew`,
		"Statistiques de la carte récupérées avec succès",
		"Échec de la récupération des statistiques de la carte",
	);
	return res;
};

export const fetchStatsCardsDuplicata = async () => {
	const res = await fetchData(
		`${Backend_URL}/stats/card/duplicata`,
		"Statistiques de la carte récupérées avec succès",
		"Échec de la récupération des statistiques de la carte",
	);
	return res;
};

export const markCardAsPrinted = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/set-printed/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders");
		revalidatePath("/panel/diplomatic/holders/printed-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme imprimée",
	};
};

export const markCardAsReturned = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/set-returned/` + id,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/printed-cards");
		revalidatePath("/panel/diplomatic/holders/returned-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme restituée",
	};
};

export const markCardAsPrintedRenew = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/renew/set-printed/` + id,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(data),
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/renew");
		revalidatePath("/panel/diplomatic/holders/renew/renew-printed-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme imprimée",
	};
};

export const markCardAsReturnedRenew = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/renew/set-returned/` + id,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/renew/renew-printed-cards");
		revalidatePath("/panel/diplomatic/holders/renew/renew-returned-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme restituée",
	};
};

export const markCardAsPrintedDuplicate = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/duplicata/set-printed/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/duplicates");
		revalidatePath("/panel/diplomatic/holders/duplicates/duplicate-printed-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme imprimée",
	};
};

export const markCardAsReturnedDuplicate = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/duplicata/set-returned/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/duplicates/duplicate-printed-cards");
		revalidatePath("/panel/diplomatic/holders/duplicates/duplicate-returned-cards");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur de mise à jour",
			status: "error",
			errors: res,
		};
	}
	return {
		data: res,
		status: "success",
		message: "Carte marquée comme restituée",
	};
};

export const undoPrint = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;

	try {
		const response = await fetch(`${Backend_URL}/card/owner/undo-print/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");

			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders");
		revalidatePath("/panel/diplomatic/holders/printed-cards");
	} catch (error) {
		// console.log(error)
		return {
			message: "Erreur lors du débloquage de la carte",
			status: "error",
			errors: res,
		};
	}

	return {
		data: res,
		status: "success",
		message: "Carte débloquée avec succès",
	};
};

export const undoPrintRenew = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;

	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/renew/undo-print/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");

			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/renew");
		revalidatePath("/panel/diplomatic/holders/renew/renew-printed-cards");
	} catch (error) {
		// console.log(error)
		return {
			message: "Erreur lors du débloquage de la carte",
			status: "error",
			errors: res,
		};
	}

	return {
		data: res,
		status: "success",
		message: "Carte débloquée avec succès",
	};
};

export const undoPrintDuplicate = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;

	try {
		const response = await fetch(
			`${Backend_URL}/card/owner/duplicata/undo-print/${id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// console.log(response);
		res = await response.json();

		if (response.status !== 200) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");

			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders/duplicates");
		revalidatePath("/panel/diplomatic/holders/duplicates/duplicate-printed-cards");
	} catch (error) {
		// console.log(error)
		return {
			message: "Erreur lors du débloquage de la carte",
			status: "error",
			errors: res,
		};
	}

	return {
		data: res,
		status: "success",
		message: "Carte débloquée avec succès",
	};
};

export const fetchHoldersPrintedCards = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	let url = `${Backend_URL}/card/owner?documentStage[]=printed`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list?documentStage[]=printed`;
	}

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersReturnedCards = async () => {
	const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	let url = `${Backend_URL}/card/owner?documentStage[]=RETURNED`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/owner/admin/list?documentStage[]=RETURNED`;
	}

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.map((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersPrintedCardsRenew = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	const url = `${Backend_URL}/card/owner/renew/admin/list?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersReturnedCardsRenew = async () => {
	// const session = await getServerSession(authOptions);
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	const url = `${Backend_URL}/card/owner/renew/admin/list?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersPrintedCardsDuplicate = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	const url = `${Backend_URL}/card/owner/duplicata?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const fetchHoldersReturnedCardsDuplicate = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
		"createdAt",
	];

	const url = `${Backend_URL}/card/owner/duplicata?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des titulaires récupérées avec succès",
		"Échec de la récupération de la liste des titulaires",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.forEach((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			return row;
		});
	}
	return res;
};

export const deleteCard = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(`${Backend_URL}/card/owner/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log(response);
		res = await response.json();

		if (!response.ok) {
			// console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/holders");
	} catch (error) {
		// console.log(error);
		return {
			message: "Erreur lors de la suppression de la carte",
			status: "error",
			errors: res,
		};
	}

	return {
		data: res,
		status: "success",
		message: "Carte supprimée avec succès",
	};
};
