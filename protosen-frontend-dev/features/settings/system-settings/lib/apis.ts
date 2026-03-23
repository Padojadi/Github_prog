"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";

export const getSystemSettings = async () => {
  const session = await getServerSession(authOptions);

  const url = `${Backend_URL}/system-settings`;

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

    result = await response.json();
    

    if (!response.ok) {
      throw new Error(
        "Échec de la récupération des paramètres système",
      );
    }

  } catch (err) {
    return {
      message: "Échec de la récupération des paramètres système",
      status: "error",
      errors: result,
    };
  }
  return {
    data: result?.data,
    message: "Paramètres système récupérés avec succès",
    status: "success",
  };
};

export const updateSystemSettings = async (
  data: {
    directorSignature?: string;
    ministryName?: string;
    protocolDirectionName?: string;
  },
  errorMessage: string,
  successMessage: string,
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const url = `${Backend_URL}/system-settings`;

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

    if (!response.ok) {
      throw new Error(result?.error || "Une erreur est survenue!");
    }
  } catch (error) {
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

