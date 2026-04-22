"use server";
import { convertDateToLocalString } from "@/components/utils/utils";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { Organism } from "../types";

export const getOrganisms = async () => {
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
  let url = `${Backend_URL}/institution`;

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

    console.log(response);
    result = await response.json();
    console.log(result);

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Échec de la récupération de la liste des institutions"
      );
    }

    result.data.rows = result.data.rows.map((row: any) => {
      dateFields.map((field) => {
        row[field] = convertDateToLocalString(row[field], true);
      });
      return row;
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Erreur lors de la récupération des institutions",
      status: "error",
      errors: result,
    };
  }

  return {
    data: result.data.rows as Organism[],
    message: "Liste des plaques récupérée avec succès",
    status: "success",
  };
};

// export const getOrganismById = async (id: string) => {
//   const session = await getServerSession(authOptions);
//   const dateFields = ["createdAt", "updatedAt", "startDate", "endDate"];
//   let url = `${Backend_URL}/institution/${id}`;

//   const token = session?.backendTokens?.accessToken;

//   let result;
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     });

//     console.log(response);
//     result = await response.json();
//     console.log(result);

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error(result?.message || "Veuillez vous connecter");
//       }

//       throw new Error(
//         result?.message || "Échec de la récupération de l'institution"
//       );
//     }

//     console.log(result);

//     return {
//       data: result,
//       message: "Institution récupérée avec succès",
//       status: "success",
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       message: "Erreur lors de la récupération de l'institution",
//       status: "error",
//       errors: result,
//     };
//   }
// };

export const createOrganism = async <T>(
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/institution`;

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
			throw new Error(result?.error || "Une erreur est survenue");
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

export const updateOrganism = async <T>(
	id: unknown,
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/institution/update/${id}`;

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

		result = await response.json();
		// console.log(result);

		if (!response.ok) {
			throw new Error(result?.error || "Une erreur est survenue");
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

export const deleteOrganism = async (
	id: unknown,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${Backend_URL}/institution/${id}`;

	let result;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});
		// console.log(response);

		if (!response.ok) {
			result = await response.json();
			console.log(result);
			throw new Error(result?.error || "Une erreur est survenue");
		}
	} catch (error) {
		// console.log(error);
		return {
			message: errorMessage,
			status: "error",
			errors: result,
		};
	}

	// return result;
	return {
		status: "success",
		message: successMessage,
	};
};
