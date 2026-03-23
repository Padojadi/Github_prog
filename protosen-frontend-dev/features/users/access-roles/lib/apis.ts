"use server";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { convertDateToLocalString } from "@/components/utils/utils";

export const getAccessRoles = async () => {
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
  let url = `${Backend_URL}/accessgroup`;

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
        result?.msg || "Échec de la récupération de la liste des rôles d'accès"
      );
    }

    result = result.map((row: any) => {
      dateFields.map((field) => {
        row[field] = convertDateToLocalString(row[field], true);
      });
      return row;
    });
    return {
      data: result,
      message: "Liste des rôles d'accès récupérée avec succès",
      status: "success",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: "error",
        errors: result,
      };
    }
    return {
      message: "Une erreur est survenue!",
      status: "error",
      errors: result,
    };
  }
};

export const createAccessRole = async <T>(
  data: T,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/accessgroup`;

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

    console.log(response)
    result = await response.json();
    console.log(result);

    if (!response.ok) {
      throw new Error(result?.error || "Une erreur est survenue!");
    }

    return {
      data: result,
      status: "success",
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: "error",
        errors: result,
      };
    }
    return {
      message: "Une erreur est survenue!",
      status: "error",
      errors: result,
    };
  }
};

export const updateAccessRole = async <T>(
  id: unknown,
  data: T,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/accessgroup/${id}`;

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
    console.log(response);
    result = await response.json();
    console.log(result);

    if (!response.ok) {
      throw new Error(result?.error || "Une erreur est survenue!");
    }

    return {
      data: result,
      status: "success",
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: "error",
        errors: result,
      };
    }
    return {
      message: "Une erreur est survenue!",
      status: "error",
      errors: result,
    };
  }
};

export const deleteAccessRole = async (
  id: unknown,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/accessgroup/${id}`;

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

    // return result;
    return {
      status: "success",
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: "error",
        errors: result,
      };
    }
    return {
      message: "Une erreur est survenue!",
      status: "error",
      errors: result,
    };
  }
};
