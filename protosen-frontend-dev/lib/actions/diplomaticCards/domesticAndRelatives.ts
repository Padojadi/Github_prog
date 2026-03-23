"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { schemaDomesticAndRelativeNewRequest } from "@/app/(default)/panel/diplomatic/domestics-and-relatives/formMeta";
import {
	convertDate,
	convertDateToLocalString,
} from "@/components/utils/utils";
import { authOptions } from "@/lib/auth/authOptions";
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

// DomesticAndRelatives Actions
const documentsStageParamsForUnprintedCards =
	"?documentStage[]=confirmed&documentStage[]=onhold&documentStage[]=pending&documentStage[]=accepted&documentStage[]=rejected";

export const createDomesticAndRelativeNewRequest = async (
	dataToSend: unknown,
) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const successMessage = "Nouvelle demande créée avec succès";
	const errorMessage = "Échec de la création de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/domestics-and-relatives";

	const res = await createData(
		`${Backend_URL}/card/domestic-and-relative`,
		dataToSend,
		schemaDomesticAndRelativeNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const updateDomesticAndRelativeNewRequest = async (
	dataToSend: unknown,
) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const id = (dataToSend as { [x: string]: string })["id"];
	const successMessage = "Nouvelle demande mise à jour avec succès";
	const errorMessage = "Échec de la mise à jour de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/domestics-and-relatives";

	const res = await updateData(
		`${Backend_URL}/card/domestic-and-relative/${id}`,
		dataToSend,
		schemaDomesticAndRelativeNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const fetchDomesticAndRelativeCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/domestic-and-relative/${id}`,
		"Informations de la carte du personnel de service récupérées avec succès",
		"Échec de la récupération des informations de la carte du personnel de service",
	);
	if (res.status === "success") {
		return {
			...res,
			data: {
				...res.data,
				deliverThe: convertDate(res.data.deliverThe),
				dateOfBirth: convertDate(res.data.dateOfBirth),
				travellingTitleValidUntil: convertDate(
					res.data.travellingTitleValidUntil,
				),
			},
		};
	}
	return res;
};

export const fetchDomesticAndRelativesCards = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"createdAt",
	];
	const res = await fetchData(
		`${Backend_URL}/card/domestic-and-relative${documentsStageParamsForUnprintedCards}`,
		"Informations de la carte du personnel de service récupérées avec succès",
		"Échec de la récupération des informations de la carte du personnel de service",
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

export const submitDomesticAndRelativeDiplomaticCardFiles = async (
	formData: FormData,
) => {
	const res = await submitDataFiles(
		formData,
		`${Backend_URL}/card/domestic-and-relative/files`,
		"Fichiers soumis avec succès",
		"Échec de la soumission des fichiers",
	);
	return res;
};

export const updateDomesticAndRelativeDiplomaticCardFiles = async (
	formData: FormData,
) => {
	const id = formData.get("otherStaffDCId");
	const revalidatePath = `/panel/diplomatic/domestics-and-relatives/${id}/files-form`;
	const res = await updateDataFiles(
		formData,
		`${Backend_URL}/card/domestic-and-relative/files`,
		"Fichiers mis à jour avec succès",
		"Échec de la mise à jour des fichiers",
		revalidatePath,
	);
	return res;
};

export const deleteDomesticAndRelativeDCFiles = async (formData: FormData) => {
	const id = formData.get("domesticAndRelativeDCId");
	const revalidatePath =
		"/panel/diplomatic/domestics-and-relatives/" + id + "/files-form";
	const res = await deleteDataFiles(
		formData,
		`${Backend_URL}/card/domestic-and-relative/files/other/delete/${id}`,
		"Fichiers supprimés avec succès",
		"Échec de la suppression des fichiers",
		revalidatePath,
	);
	return res;
};

export const submitDomesticAndRelativeDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/domestic-and-relative/pointfocal/validate/${id}`,
		"L'état de la carte du personnel de service a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du personnel de service",
		"/panel/diplomatic/domestics-and-relatives",
	);
	return res;
};

export const validateDomesticAndRelativeDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/domestic-and-relative/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/domestic-and-relative/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}
	const res = await validateData(
		url,
		formData,
		"L'état de la carte du personnel de service a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du personnel de service",
		"/panel/diplomatic/domestics-and-relatives",
	);
	return res;
};

export const fetchActiveDomesticAndRelativesCards = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"dateTakingOffice",
		"dateArrivalSenegal",
		"dateEndOfMission",
		"lastestWorkDate",
	];

	const url = `${Backend_URL}/card/domestic-and-relative?documentStage[]=printed&expired=false`;

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
	);

	// Format the date fields
	if (res.status === "success") {
		res.data.rows = res.data.rows.map((row: any) => {
			dateFields.map((field) => {
				row[field] = convertDateToLocalString(row[field], true);
			});
			row._sourceType = "base";
			return row;
		});
	}

	// Fetch renew printed cards
	const renewUrl = `${Backend_URL}/card/domestic-and-relative/renew?documentStage[]=printed&expired=false`;
	const renewRes = await fetchData(
		renewUrl,
		"Liste des renouvellements récupérées avec succès",
		"Échec de la récupération des renouvellements",
	);

	if (renewRes.status === "success" && res.status === "success") {
		const renewRows = renewRes.data.rows.map((row: any) => {
			dateFields.map((field) => {
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

// DomesticAndRelatives Actions - Renew

export const getDomesticAndRelativesCardsForRenew = async () => {
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
	const url = `${Backend_URL}/card/domestic-and-relative?documentStage[]=printed`;

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
			message:
				"Echec de récupération de la liste des cartes des personnels de service",
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
		message: "Liste des personnels de service récupérée avec succès",
		status: "success",
	};
};

export const fetchRenewDomesticAndRelativesCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/domestic-and-relative/renew${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des renouvellements des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des renouvellements des personnels de service",
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

export const createDomesticAndRelativesRenewCard = async (id: string) => {
	const session = await getServerSession(authOptions);

	const url = `${Backend_URL}/card/domestic-and-relative/renew/create/${id}`;

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

	revalidatePath("/panel/diplomatic/domestics-and-relatives/renew");

	return {
		data: result.data,
		message: "Renouvellement créé avec succès",
		status: "success",
	};
};

export const submitRenewDomesticAndRelativeDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/domestic-and-relative/renew/pointfocal/validate/${id}`,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/domestics-and-relatives/renew",
	);
	return res;
};

export const validateRenewDomesticAndRelativeDC = async (
	formData: FormData,
) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/domestic-and-relative/renew/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/domestic-and-relative/renew/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/domestics-and-relatives/renew",
	);
	return res;
};

export const fetchRenewDomesticAndRelativeCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/domestic-and-relative/renew/${id}`,
		"Informations du renouvellement récupérées avec succès",
		"Échec de la récupération des informations du renouvellement",
	);
	return res;
};

// DomesticAndRelatives Actions - Duplicate

export const fetchDuplicateDomesticAndRelativesCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/domestic-and-relative/duplicata${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des duplicatas des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des duplicatas des personnels de service",
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

export const createDomesticsAndRelativesDuplicateNewRequest = async (
	dataToSend: unknown,
) => {
	const successMessage = "Nouveau duplicata créée avec succès";
	const errorMessage = "Échec de la création du nouveau de duplicata";
	const revalidatePathLink =
		"/panel/diplomatic/domestics-and-relatives/duplicates";

	let result;

	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	try {
		const res = await fetch(
			`${Backend_URL}/card/domestic-and-relative/duplicata`,
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

export const submitDuplicateDomesticAndRelativeDC = async (
	formData: FormData,
) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/domestic-and-relative/duplicata/pointfocal/validate/${id}`,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/domestics-and-relatives/duplicates",
	);
	return res;
};

export const validateDuplicateDomesticAndRelativeDC = async (
	formData: FormData,
) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/domestic-and-relative/duplicata/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/domestic-and-relative/duplicata/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/domestics-and-relatives/duplicates",
	);
	return res;
};

export const fetchDuplicateDomesticAndRelativeCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/domestic-and-relative/duplicata/${id}`,
		"Informations du duplicata récupérées avec succès",
		"Échec de la récupération des informations du duplicata",
	);
	return res;
};

export const markCardAsPrinted = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
		revalidatePath("/panel/diplomatic/domestics-and-relatives/printed-cards");
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

export const markCardAsPrintedRenew = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/renew/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives/renew");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/renew/renew-printed-cards",
		);
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

export const undoPrint = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
		revalidatePath("/panel/diplomatic/domestics-and-relatives/printed-cards");
	} catch (error) {
		// console.log(error);
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
			`${Backend_URL}/card/domestic-and-relative/renew/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives/renew");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/renew/renew-printed-cards",
		);
	} catch (error) {
		// console.log(error);
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

export const fetchDomesticAndRelativesPrintedCards = async () => {
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

	const url = `${Backend_URL}/card/domestic-and-relative?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des autres personnels récupérées avec succès",
		"Échec de la récupération de la liste des autres personnels",
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

export const fetchDomesticAndRelativesPrintedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/domestic-and-relative/renew?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des autres personnels récupérées avec succès",
		"Échec de la récupération de la liste des autres personnels",
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

export const markCardAsReturned = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/set-returned/` + id,
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
		}
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
		revalidatePath("/panel/diplomatic/domestics-and-relatives/returned-cards");
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

export const markCardAsReturnedRenew = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/renew/set-returned/` + id,
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
		}
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/renew/renew-returned-cards",
		);
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

export const markCardAsReturnedDuplicate = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/duplicata/set-returned/${id}`,
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
		}
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/duplicates/duplicate-returned-cards",
		);
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

export const fetchDomesticsAndRelativesReturnedCards = async () => {
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

	let url = `${Backend_URL}/card/domestic-and-relative?documentStage[]=RETURNED`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/domestic-and-relative/admin/list?documentStage[]=RETURNED`;
	}

	const res = await fetchData(
		url,
		"Liste des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des personnels de service",
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

export const fetchDomesticsAndRelativesReturnedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/domestic-and-relative/renew?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des personnels de service",
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

export const fetchDomesticsAndRelativesReturnedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/domestic-and-relative/duplicata?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des personnels de service",
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
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/${id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		console.log(response);
		res = await response.json();

		if (!response.ok) {
			console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/domestics-and-relatives");
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

// DomesticAndRelatives Actions - Duplicate Printed Cards

export const fetchDomesticsAndRelativesPrintedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/domestic-and-relative/duplicata?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des duplicatas des personnels de service récupérées avec succès",
		"Échec de la récupération de la liste des duplicatas des personnels de service",
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

export const undoPrintDuplicate = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;

	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/duplicata/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives/duplicates");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/duplicates/duplicate-printed-cards",
		);
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

export const markCardAsPrintedDuplicate = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res;
	try {
		const response = await fetch(
			`${Backend_URL}/card/domestic-and-relative/duplicata/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/domestics-and-relatives/duplicates");
		revalidatePath(
			"/panel/diplomatic/domestics-and-relatives/duplicates/duplicate-printed-cards",
		);
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
