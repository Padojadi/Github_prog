import { getSession } from "next-auth/react";
import { convertDateToLocalString } from "@/components/utils/utils";
import { Backend_URL } from "@/lib/constants";

const documentsStageParamsForUnprintedCards =
	"?documentStage[]=confirmed&documentStage[]=onhold&documentStage[]=pending&documentStage[]=accepted&documentStage[]=rejected";

export const getHoldersDependantsSpouses = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/spouse${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des époux(se)");
		// return {
		//   message: "Échec de la récupération de la liste des époux(se)",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});

	return {
		data: result.data,
		message: "Liste des époux(se) récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsChilds = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/child${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des enfants");
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des enfants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherDependants = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/otherdependant${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres dépendants",
		);
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres dépendants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherStaff = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/otherstaff${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres personnels",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres personnels récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsDomesticAndRelatives = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/domesticandrelative${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste du personnel de service",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des du personnel de service récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsSpousesRenew = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/spouse/renew${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des époux(se)");
		// return {
		//   message: "Échec de la récupération de la liste des époux(se)",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});

	return {
		data: result.data,
		message: "Liste des époux(se) récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsChildsRenew = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/child/renew${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des enfants");
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des enfants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherDependantsRenew = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/other-dependant/renew${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres dépendants",
		);
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres dépendants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherStaffRenew = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/other-staff/renew${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres personnels",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres personnels récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsDomesticAndRelativesRenew = async (
	id: unknown,
) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/domestic-and-relative/renew${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste du personnel de service",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des du personnel de service récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsSpousesDuplicata = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/spouse/duplicata${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des époux(se)");
		// return {
		//   message: "Échec de la récupération de la liste des époux(se)",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});

	return {
		data: result.data,
		message: "Liste des époux(se) récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsChildsDuplicata = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/child/duplicata${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error("Échec de la récupération de la liste des enfants");
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des enfants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherDependantsDuplicata = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/other-dependant/duplicata${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres dépendants",
		);
		// return {
		//   message: "Échec de la récupération de la liste des enfants",
		//   status: "error",
		//   errors: result,
		// };
		// throw new Error(errorMessage);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres dépendants récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsOtherStaffDuplicata = async (id: unknown) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/other-staff/duplicata${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste des autres personnels",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des autres personnels récupérée avec succès",
		status: "success",
	};
};

export const getHoldersDependantsDomesticAndRelativesDuplicata = async (
	id: unknown,
) => {
	const session = await getSession();
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
	const url = `${Backend_URL}/card/domestic-and-relative/duplicata${documentsStageParamsForUnprintedCards}&ownerCardId=${id}`;

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
		throw new Error(
			"Échec de la récupération de la liste du personnel de service",
		);
	}

	result.data = result.data.rows.map((row: any) => {
		dateFields.forEach((field) => {
			row[field] = convertDateToLocalString(row[field], true);
		});
		return row;
	});
	return {
		data: result.data,
		message: "Liste des du personnel de service récupérée avec succès",
		status: "success",
	};
};
