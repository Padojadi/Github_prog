"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { schemaSpouseNewRequest } from "@/app/(default)/panel/diplomatic/spouses/formMeta";
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

// Spouses Actions
const documentsStageParamsForUnprintedCards =
	"?documentStage[]=confirmed&documentStage[]=onhold&documentStage[]=pending&documentStage[]=accepted&documentStage[]=rejected";

export const createSpouseNewRequest = async (dataToSend: unknown) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const successMessage = "Nouvelle demande créée avec succès";
	const errorMessage = "Échec de la création de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/spouses";

	const res = await createData(
		`${Backend_URL}/card/spouse`,
		dataToSend,
		schemaSpouseNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const updateSpouseNewRequest = async (dataToSend: unknown) => {
	const dateFields = ["deliverThe", "dateOfBirth", "travellingTitleValidUntil"];
	const id = (dataToSend as { [x: string]: string })["id"];
	const successMessage = "Nouvelle demande mise à jour avec succès";
	const errorMessage = "Échec de la mise à jour de la nouvelle demande";
	const revalidatePath = "/panel/diplomatic/spouses";

	const res = await updateData(
		`${Backend_URL}/card/spouse/${id}`,
		dataToSend,
		schemaSpouseNewRequest,
		dateFields,
		successMessage,
		errorMessage,
		revalidatePath,
	);
	return res;
};

export const fetchSpouseCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/spouse/${id}`,
		"Informations de la carte du conjoint récupérées avec succès",
		"Échec de la récupération des informations de la carte du conjoint",
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

export const fetchSpousesCards = async () => {
	const dateFields = [
		"deliverThe",
		"dateOfBirth",
		"travellingTitleValidUntil",
		"createdAt",
	];
	const res = await fetchData(
		`${Backend_URL}/card/spouse${documentsStageParamsForUnprintedCards}`,
		"Informations de la carte du conjoint récupérées avec succès",
		"Échec de la récupération des informations de la carte du conjoint",
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

export const submitSpouseDiplomaticCardFiles = async (formData: FormData) => {
	const res = await submitDataFiles(
		formData,
		`${Backend_URL}/card/spouse/files`,
		"Fichiers soumis avec succès",
		"Échec de la soumission des fichiers",
	);
	return res;
};

export const updateSpouseDiplomaticCardFiles = async (formData: FormData) => {
	const id = formData.get("spouseDCId");
	const revalidatePath = `/panel/diplomatic/spouses/${id}/files-form`;
	const res = await updateDataFiles(
		formData,
		`${Backend_URL}/card/spouse/files`,
		"Fichiers mis à jour avec succès",
		"Échec de la mise à jour des fichiers",
		revalidatePath,
	);
	return res;
};

export const deleteSpouseDCFiles = async (formData: FormData) => {
	const id = formData.get("spouseDCId");
	const revalidatePath = `/panel/diplomatic/spouses/${id}/files-form`;
	const res = await deleteDataFiles(
		formData,
		`${Backend_URL}/card/spouse/files/other/delete/${id}`,
		"Fichiers supprimés avec succès",
		"Échec de la suppression des fichiers",
		revalidatePath,
	);
	return res;
};

export const submitSpouseDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/spouse/pointfocal/validate/${id}`,
		"L'état de la carte du conjoint a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du conjoint",
		"/panel/diplomatic/holders",
	);
	return res;
};

export const validateSpouseDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");
	let url = `${Backend_URL}/card/spouse/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/spouse/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}
	const res = await validateData(
		url,
		formData,
		"L'état de la carte du conjoint a été mis à jour avec succès",
		"Échec de la mise à jour de l'état de la carte du conjoint",
		"/panel/diplomatic/holders",
	);
	return res;
};

export const fetchActiveSpousesCards = async () => {
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

	let url = `${Backend_URL}/card/spouse?documentStage[]=printed&expired=false`;

	if (session?.user?.role === "admin" || session?.user?.role === "user") {
		url = `${Backend_URL}/card/spouse?documentStage[]=printed&expired=false`;
	}

	const res = await fetchData(
		url,
		"Liste des conjoints récupérées avec succès",
		"Échec de la récupération de la liste des conjoints",
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
	const renewUrl = `${Backend_URL}/card/spouse/renew?documentStage[]=printed&expired=false`;
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

// Spouses Actions - Renew

export const getSpousesCardsForRenew = async () => {
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
	const url = `${Backend_URL}/card/spouse?documentStage[]=printed`;

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
	// console.log(result.data.rows[0]);

	if (!response.ok) {
		return {
			message: "Echec de récupération de la liste des cartes des époux(ses)",
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
		message: "Liste des époux(ses) récupérée avec succès",
		status: "success",
	};
};

export const fetchRenewSpousesCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/spouse/renew${documentsStageParamsForUnprintedCards}`;

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

export const createSpousesRenewCard = async (id: string) => {
	const session = await getServerSession(authOptions);

	const url = `${Backend_URL}/card/spouse/renew/create/${id}`;

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

	revalidatePath("/panel/diplomatic/spouses/renew");

	return {
		data: result.data,
		message: "Renouvellement créé avec succès",
		status: "success",
	};
};

export const submitRenewSpouseDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/spouse/renew/pointfocal/validate/${id}`,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/spouses/renew",
	);
	return res;
};

export const validateRenewSpouseDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/spouse/renew/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/spouse/renew/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du renouvellement a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du renouvellement",
		"/panel/diplomatic/spouses/renew",
	);
	// console.log(res);
	return res;
};

export const fetchRenewSpouseCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/spouse/renew/${id}`,
		"Informations du renouvellement récupérées avec succès",
		"Échec de la récupération des informations du renouvellement",
	);
	return res;
};

// Spouses Actions - Duplicate

export const fetchDuplicateSpousesCards = async () => {
	const dateFields = ["createdAt", "updatedAt"];
	const mergeFields = ["firstName", "lastName"];
	const url = `${Backend_URL}/card/spouse/duplicata${documentsStageParamsForUnprintedCards}`;

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

export const createSpouseDuplicateNewRequest = async (dataToSend: unknown) => {
	const successMessage = "Nouveau duplicata créée avec succès";
	const errorMessage = "Échec de la création du nouveau de duplicata";
	const revalidatePathLink = "/panel/diplomatic/spouses/duplicates";

	let result;

	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	try {
		const res = await fetch(
			`${Backend_URL}/card/spouse/duplicata`,
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

export const submitDuplicateSpouseDC = async (formData: FormData) => {
	const id = formData.get("id");
	const res = await submitData(
		`${Backend_URL}/card/spouse/duplicata/pointfocal/validate/${id}`,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/spouses/duplicates",
	);
	return res;
};

export const validateDuplicateSpouseDC = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	const id = formData.get("id");
	const documentStage = formData.get("documentStage");

	let url = `${Backend_URL}/card/spouse/duplicata/admin/validate/${id}`;
	if (session?.user?.role === "admin") {
		if (documentStage === "confirmed") {
			formData.set("documentStage", "accepted");
		}
	}

	if (session?.user?.role === "super_admin") {
		url = `${Backend_URL}/card/spouse/duplicata/superadmin/validate/${id}`;
		if (documentStage === "accepted") {
			formData.set("documentStage", "confirmed");
		}
	}

	const res = await validateData(
		url,
		formData,
		"L'état du duplicata a été mis à jour avec succès",
		"Échec de la mise à jour de l'état du duplicata",
		"/panel/diplomatic/spouses/duplicates",
	);
	return res;
};

export const fetchDuplicateSpouseCardById = async (id: any) => {
	const res = await fetchData(
		`${Backend_URL}/card/spouse/duplicata/${id}`,
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
			`${Backend_URL}/card/spouse/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses");
		revalidatePath("/panel/diplomatic/spouses/printed-cards");
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
			`${Backend_URL}/card/spouse/renew/set-printed/${id}`,
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
			console.log(res);
			throw new Error(res?.error || "Erreur lors de l'action");
			// return {
			//   message: "Erreur de mise à jour",
			//   status: "error",
			//   errors: res,
			// };
			// throw new Error(errorMessage);
		}
		revalidatePath("/panel/diplomatic/spouses/renew");
		revalidatePath("/panel/diplomatic/spouses/renew/renew-printed-cards");
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
			`${Backend_URL}/card/spouse/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses");
		revalidatePath("/panel/diplomatic/spouses/printed-cards");
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
			`${Backend_URL}/card/spouse/renew/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses/renew");
		revalidatePath("/panel/diplomatic/spouses/renew/renew-printed-cards");
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

export const fetchSpousesPrintedCards = async () => {
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

	const url = `${Backend_URL}/card/spouse?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des époux(se) récupérées avec succès",
		"Échec de la récupération de la liste des époux(se)",
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

export const fetchSpousesPrintedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/spouse/renew?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des époux(se) récupérées avec succès",
		"Échec de la récupération de la liste des époux(se)",
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
			`${Backend_URL}/card/spouse/set-returned/` + id,
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
		revalidatePath("/panel/diplomatic/spouses");
		revalidatePath("/panel/diplomatic/spouses/returned-cards");
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
			`${Backend_URL}/card/spouse/renew/set-returned/` + id,
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
		revalidatePath("/panel/diplomatic/spouses");
		revalidatePath("/panel/diplomatic/spouses/renew/renew-returned-cards");
	} catch (error) {
		console.log(error);
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
			`${Backend_URL}/card/spouse/duplicata/set-returned/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses");
		revalidatePath("/panel/diplomatic/spouses/duplicates/duplicate-returned-cards");
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

export const fetchSpousesReturnedCards = async () => {
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

	const url = `${Backend_URL}/card/spouse?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des conjoints récupérées avec succès",
		"Échec de la récupération de la liste des conjoints",
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

export const fetchSpousesReturnedCardsRenew = async () => {
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

	const url = `${Backend_URL}/card/spouse/renew?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des conjoints récupérées avec succès",
		"Échec de la récupération de la liste des conjoints",
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

export const fetchSpousesReturnedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/spouse/duplicata?documentStage[]=RETURNED`;

	const res = await fetchData(
		url,
		"Liste des conjoints récupérées avec succès",
		"Échec de la récupération de la liste des conjoints",
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
		const response = await fetch(`${Backend_URL}/card/spouse/${id}`, {
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
		revalidatePath("/panel/diplomatic/spouses");
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

// Spouses Actions - Duplicate Printed Cards

export const fetchSpousesPrintedCardsDuplicate = async () => {
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

	const url = `${Backend_URL}/card/spouse/duplicata?documentStage[]=printed`;

	const res = await fetchData(
		url,
		"Liste des duplicatas des conjoints récupérées avec succès",
		"Échec de la récupération de la liste des duplicatas des conjoints",
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
			`${Backend_URL}/card/spouse/duplicata/undo-print/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses/duplicates");
		revalidatePath("/panel/diplomatic/spouses/duplicates/duplicate-printed-cards");
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
			`${Backend_URL}/card/spouse/duplicata/set-printed/${id}`,
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
		revalidatePath("/panel/diplomatic/spouses/duplicates");
		revalidatePath("/panel/diplomatic/spouses/duplicates/duplicate-printed-cards");
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
