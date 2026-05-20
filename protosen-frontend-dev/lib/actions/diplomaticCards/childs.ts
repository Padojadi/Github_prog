"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { schemaChildNewRequest } from "@/app/(default)/panel/diplomatic/childs/formMeta";
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

// Childs Actions
const documentsStageParamsForUnprintedCards =
	"?documentStage[]=confirmed&documentStage[]=onhold&documentStage[]=pending&documentStage[]=accepted&documentStage[]=rejected";

export const createChildNewRequest = async (dataToSend: unknown) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const successMessage = "Nouvelle demande créée avec succès";
	const errorMessage = "Échec de la création de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/childs";

	const res = await createData(
		`${Backend_URL}/card/child`,
		dataToSend,
		schemaChildNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const updateChildNewRequest = async (dataToSend: unknown) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const id = (dataToSend as { [x: string]: string }).id;
	const successMessage = "Nouvelle demande mise à jour avec succès";
	const errorMessage = "Échec de la mise à jour de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/childs";

	const res = await updateData(
		`${Backend_URL}/card/child/${id}`,
		dataToSend,
		schemaChildNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const fetchChildCardById = async (id: any) => {
	// const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const res = await fetchData(
		`${Backend_URL}/card/child/${id}`,
		"Informations de la carte de l'enfant récupérées avec succès",
		"Échec de la récupération des informations de la carte de l'enfant",
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

export const fetchChildsCards = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"createdAt",
	];
	const res = await fetchData(
		`${Backend_URL}/card/child${documentsStageParamsForUnprintedCards}`,
		"Informations de la carte de l'enfant récupérées avec succès",
		"Échec de la récupération des informations de la carte de l'enfant",
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

export const submitChildDiplomaticCardFiles = async (formData: FormData) => {
	const res = await submitDataFiles(
		formData,
		`${Backend_URL}/card/child/files`,
		"Fichiers soumis avec succès",
		"Échec de la soumission des fichiers",
	);
	return res;
};

export const updateChildDiplomaticCardFiles = async (formData: FormData) => {
	const id = formData.get("childDCId");
	const revalidatePath = `/panel/diplomatic/childs/${id}/files-form`;
	const res = await updateDataFiles(
		formData,
		`${Backend_URL}/card/child/files`,
		"Fichiers mis à jour avec succès",
		"Échec de la mise à jour des fichiers",
		revalidatePath,
	);
	return res;
};

export const deleteChildDCFiles = async (formData: FormData) => {
	const id = formData.get("childDCId");
	const revalidatePath = `/panel/diplomatic/childs/${id}/files-form`;
	const res = await deleteDataFiles(
		formData,
		`${Backend_URL}/card/child/files/other/delete/${id}`,
		"Fichiers supprimés avec succès",
		"Échec de la suppression des fichiers",
		revalidatePath,
	);
	return res;
};

export const submitChildDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/child/pointfocal/validate/${id}`,
		"L'état de la carte de l'enfant a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte de l'enfant",
		"/panel/diplomatic/childs",
	);
	return res;
};

export const validateChildDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");
	let url = `${Backend_URL}/card/child/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/child/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}
	const res = await validateData(
		url,
		formData,
		"L'état de la carte de l'enfant a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte de l'enfant",
		"/panel/diplomatic/childs",
	);
	return res;
};

export const fetchActiveChildsCards = async () => {
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

	let url = `${Backend_URL}/card/child?documentStage[]=printed&expired=false`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/child?documentStage[]=printed&expired=false`;
	}

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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
	const renewUrl = `${Backend_URL}/card/child/renew?documentStage[]=printed&expired=false`;
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

// Childs Actions - Renew

export const getChildsCardsForRenew = async () => {
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
	const url = `${Backend_URL}/card/child?documentStage[]=printed`;

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
			message: "Echec de récupération de la liste des cartes des enfants",
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
	const oneMonthFrowNow = new Date(now);
	oneMonthFrowNow.setMonth(now.getMonth() + 1);

	result.data = result.data.filter((row: any) => {
		if (!row.validUntil) return false;
		// Try to parse the date, fallback to original if already a Date
		const validUntilDate =
			typeof row.validUntil === "string"
				? new Date(row.validUntil)
				: row.validUntil;

		return (
			validUntilDate <= oneMonthFrowNow &&
			Array.isArray(row.renewals) &&
			row.renewals.length < 2
		);
	});

	// console.log(result.data[0]);
	return {
		data: result.data,
		message: "Liste des enfants récupérée avec succès",
		status: "success",
	};
};

export const fetchRenewChildsCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/child/renew${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des renouvellements des enfants récupérées avec succès",
		"Échec de la récupération de la liste des renouvellements des enfants",
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

export const createChildsRenewCard = async (id: string) => {
	const session = await getServerSession(authOptions);

	const url = `${Backend_URL}/card/child/renew/create/${id}`;

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

	revalidatePath("/panel/diplomatic/childs/renew");

	return {
		data: result.data,
		message: "Renouvellement créé avec succès",
		status: "success",
	};
};

export const submitRenewChildDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/child/renew/pointfocal/validate/${id}`,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/holders/renew",
	);
	return res;
};

export const validateRenewChildDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/child/renew/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/child/renew/superadmin/validate/${id}`;
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

export const fetchRenewChildCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/child/renew/${id}`,
		"Informations du renouvellement récupérées avec succès",
		"Échec de la récupération des informations du renouvellement",
	);
	return res;
};

// Childs Actions - Duplicate

export const createChildDuplicateNewRequest = async (dataToSend: unknown) => {
	const successMessage = "Nouveau duplicata créée avec succès";
	const errorMessage = "Échec de la création du nouveau de duplicata";
	const revalidatePathLink = "/panel/diplomatic/childs/duplicates";

	let result;

	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	try {
		const res = await fetch(
			`${Backend_URL}/card/child/duplicata`,
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

export const fetchDuplicateChildsCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/child/duplicata${documentsStageParamsForUnprintedCards}`;

	const res = await fetchData(
		url,
		"Liste des duplicatas des enfants récupérées avec succès",
		"Échec de la récupération de la liste des duplicatas des enfants",
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

export const submitDuplicateChildDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/child/duplicata/pointfocal/validate/${id}`,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/holders/duplicates",
	);
	return res;
};

export const validateDuplicateChildDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/child/duplicata/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/child/duplicata/superadmin/validate/${id}`;
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

export const fetchDuplicateChildCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/child/duplicata/${id}`,
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
			`${Backend_URL}/card/child/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/childs");
		revalidatePath("/panel/diplomatic/childs/printed-cards");
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
			`${Backend_URL}/card/child/renew/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/childs/renew");
		revalidatePath("/panel/diplomatic/childs/renew/renew-printed-cards");
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

export const markCardAsPrintedDuplicate = async (data: any, id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res: any;
	try {
		const response = await fetch(
			`${Backend_URL}/card/child/duplicata/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/childs/duplicates");
		revalidatePath("/panel/diplomatic/childs/duplicates/duplicate-printed-cards");
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
		const response = await fetch(`${Backend_URL}/card/child/undo-print/${id}`, {
			method: "PATCH",
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
		revalidatePath("/panel/diplomatic/childs");
		revalidatePath("/panel/diplomatic/childs/printed-cards");
	} catch (error) {
		// console.log(error);
		if (error instanceof Error)
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
			`${Backend_URL}/card/child/renew/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/childs/renew");
		revalidatePath("/panel/diplomatic/childs/renew/renew-printed-cards");
	} catch (error) {
		// console.log(error);
		if (error instanceof Error)
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
	let res: any;

	try {
		const response = await fetch(
			`${Backend_URL}/card/child/duplicata/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/childs/duplicates");
		revalidatePath("/panel/diplomatic/childs/duplicates/duplicate-printed-cards");
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

export const fetchChildsPrintedCards = async () => {
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

	const url = `${Backend_URL}/card/child?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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

export const fetchChildsPrintedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/child/renew?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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

export const fetchChildsPrintedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/child/duplicata?documentStage[]=printed`;

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

export const markCardAsReturned = async (id: unknown) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	let res: any;
	try {
		const response = await fetch(
			`${Backend_URL}/card/child/set-returned/${id}`,
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
		}
		revalidatePath("/panel/diplomatic/childs");
		revalidatePath("/panel/diplomatic/childs/returned-cards");
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
	let res: any;
	try {
		const response = await fetch(
			`${Backend_URL}/card/child/renew/set-returned/${id}`,
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
		}
		revalidatePath("/panel/diplomatic/childs");
		revalidatePath("/panel/diplomatic/childs/renew/renew-returned-cards");
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
	let res: any;
	try {
		const response = await fetch(
			`${Backend_URL}/card/child/duplicata/set-returned/${id}`,
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
		}
		revalidatePath("/panel/diplomatic/childs");
		revalidatePath("/panel/diplomatic/childs/duplicates/duplicate-returned-cards");
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

export const fetchChildsReturnedCards = async () => {
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

	let url = `${Backend_URL}/card/child?documentStage[]=RETURNED`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/child/admin/list?documentStage[]=RETURNED`;
	}

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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

export const fetchChildsReturnedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/child/renew?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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

export const fetchChildsReturnedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/child/duplicata?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des enfants récupérées avec succès",
		"Échec de la récupération de la liste des enfants",
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
		const response = await fetch(`${Backend_URL}/card/child/` + id, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log(response);
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
		revalidatePath("/panel/diplomatic/childs");
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
