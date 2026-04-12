import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "../errors";
import { apiCodes } from "../api-status-codes";
import { getSession } from "next-auth/react";

export async function uploadFile(
  data: File,
  filename: string,
  contentType: string
) {
  const session = await getSession();
  const token = session?.backendTokens?.accessToken;

  let url = `${BACKEND_URL_CONFERENCES}/file-upload/presigned-url`;
  // console.log(url);

  try {
    let responseUrl = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        filename: filename,
        contentType: contentType,
      }),
    });

    // console.log(responseUrl);
    let result = await responseUrl.json();
    // console.log(result);

    if (!responseUrl.ok) {
      // console.log(result);
      if (responseUrl.status === 401) {
        throw new ServerActionError(
          "401",
          result?.message || "Veuillez vous connecter"
        );
      }
      throw new ServerActionError(
        String(result?.code),
        String(result?.code) === "202"
          ? apiCodes["202"]
          : result?.message || "Erreur d'obtention d'url"
      );
    }

    let response = await fetch(result.url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline"
      },
      body: data,
    });
    // console.log(response);

    if (!response.ok) {
      throw new Error("Erreur d'upload");
    }

    return (result.bucket_url + "/" + result.key) as string;
  } catch (error) {
    throw createSafeError(error);
  }
}
