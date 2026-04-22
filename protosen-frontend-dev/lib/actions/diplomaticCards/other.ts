"use server";
import { authOptions } from "@/lib/auth/authOptions";
import { Backend_URL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { fetchData } from "../common";
import { convertDateToLocalString } from "@/components/utils/utils";

export const fetchInstitutionsR = async () => {
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

  // if (session?.user?.role === "admin" || session?.user?.role === "user") {
  //   url = `${Backend_URL}/card/owner/admin/list`;
  // }

  const res = await fetchData(
    url,
    "Liste des titulaires récupérées avec succès",
    "Échec de la récupération de la liste des titulaires"
  );

  // console.log(res);

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
      if (response.status === 401) {
        throw new Error(result?.msg || "Veuillez vous connecter");
      }
      throw new Error(
        result?.msg || "Échec de la récupération de la liste des rôles d'accès"
      );
    }

    // Format the date fields
    result = result.map((row: any) => {
      dateFields.map((field) => {
        row[field] = convertDateToLocalString(row[field], true);
      });
      return row;
    });
  } catch (error) {
    return {
      message: "Échec de la récupération de la liste des rôles d'accès",
      status: "error",
      errors: result,
    };
  }
  return {
    data: result,
    message: "Liste des rôles d'accès récupérée avec succès",
    status: "success",
  };
};
