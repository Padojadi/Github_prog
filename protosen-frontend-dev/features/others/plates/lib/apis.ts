"use server";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { convertDateToLocalString } from "@/components/utils/utils";
import { fetchData } from "@/lib/actions/common";

export const getPlates = async () => {
  const session = await getServerSession(authOptions);
  let url = `${Backend_URL}/plaque`;

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
        result?.message || "Échec de la récupération de la liste des plaques"
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

export const createPlates = async <T>(
  data: T,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/plaque`;

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
      throw new Error(result?.error || "Une erreur est survenue!");
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

export const updatePlates = async <T>(
  id: unknown,
  data: T,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/plaque/${id}`;

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
    // console.log(response);
    result = await response.json();
    // console.log(result);

    if (!response.ok) {
      throw new Error(result?.error || "Une erreur est survenue!");
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

export const deletePlates = async (
  id: unknown,
  errorMessage: string,
  successMessage: string
) => {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  let url = `${Backend_URL}/plaque/${id}`;

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
