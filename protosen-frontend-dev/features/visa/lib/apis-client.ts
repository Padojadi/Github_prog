import { getSession } from "next-auth/react";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type {
  CreateVisaRequestPayload,
  IssueVisaPayload,
  UpdateVisaRequestPayload,
  ValidateVisaPayload,
  VisaKpiSummary,
  VisaListResponse,
  VisaRequest,
  VisaSearchParams,
  VisaStatusHistory,
  WithdrawVisaPayload,
} from "../types/index";

const buildSearchParams = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  return query;
};

const fetchWithAuth = async (url: string, init?: RequestInit) => {
  const session = await getSession();
  const token = session?.backendTokens?.accessToken;

  return fetch(url, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
};

const handleError = (response: Response, result: any, fallback: string) => {
  if (response.status === 401) {
    throw new ServerActionError(
      result?.code ? String(result?.code) : "401",
      result?.message || "Veuillez vous connecter",
    );
  }

  throw new ServerActionError(
    result?.code ? String(result?.code) : String(response.status),
    result?.code ? getApiErrorMessage(result?.code) : fallback,
  );
};

export const getVisaRequestsClient = async (params: VisaSearchParams = {}) => {
  const query = buildSearchParams(params);
  const url = `${BACKEND_URL_CONFERENCES}/visa?${query.toString()}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(
        response,
        result,
        "Erreur lors de la récupération des demandes de visa",
      );
    }
    return {
      data: result as VisaListResponse,
      status: "success",
      message: "Demandes de visa récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getVisaRequestByIdClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération de la demande");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Demande de visa récupérée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getVisaHistoryClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/history`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération de l'historique");
    }
    return {
      data: result as VisaStatusHistory[],
      status: "success",
      message: "Historique récupéré avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getVisaStatusHistoryClient = getVisaHistoryClient;

export const createVisaRequestClient = async (payload: CreateVisaRequestPayload) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa`;

  try {
    const response = await fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la création de la demande");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Demande de visa créée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const autoVerifyVisaRequestClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/auto-verify`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(
        response,
        result,
        "Erreur lors de la vérification automatique de la demande",
      );
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Vérification automatique effectuée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const validateVisaRequestClient = async (
  id: string,
  payload: ValidateVisaPayload,
) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/validate`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la validation de la demande");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Validation enregistrée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const notifyVisaRequestClient = async (
  id: string,
  payload: { dossierNumber: string; notes?: string },
) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/notify`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la notification de la demande");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Notification marquée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const issueVisaRequestClient = async (
  id: string,
  payload: IssueVisaPayload,
) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/emit`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de l'émission du visa");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Visa émis avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const withdrawVisaRequestClient = async (
  id: string,
  payload: WithdrawVisaPayload,
) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}/withdraw`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de l'enregistrement du retrait");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Retrait enregistré avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const updateVisaRequestClient = async (
  id: string,
  payload: UpdateVisaRequestPayload,
) => {
  const url = `${BACKEND_URL_CONFERENCES}/visa/${id}`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la mise à jour de la demande");
    }
    return {
      data: result as VisaRequest,
      status: "success",
      message: "Demande mise à jour avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getVisaKpisClient = async (from?: string, to?: string) => {
  const query = buildSearchParams({ from, to });
  const url = `${BACKEND_URL_CONFERENCES}/visa/kpis/summary?${query.toString()}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération des KPI Visa");
    }
    return {
      data: result as VisaKpiSummary,
      status: "success",
      message: "KPI Visa récupérés avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};
