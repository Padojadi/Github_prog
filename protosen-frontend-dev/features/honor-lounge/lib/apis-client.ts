import { getSession } from "next-auth/react";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type {
  Lounge,
  LoungeBooking,
  LoungeBookingHistory,
  LoungeBookingListResponse,
  LoungePaymentStatus,
  LoungeListResponse,
  LoungeBookingStatus,
} from "../types";

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

type CreateLoungeInput = {
  name: string;
  location: string;
  description?: string;
  capacity: number;
  amenities?: string[];
  hourlyRate: number;
  imageUrl?: string;
  status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  loungeType?: string;
  maxBookings?: number;
  availableDays?: string[];
  timeSlots?: Array<{ start: string; end: string }>;
};

type UpdateLoungeBookingStatusInput = {
  status: LoungeBookingStatus;
  adminNotes?: string;
  paymentStatus?: LoungePaymentStatus;
};

export const getLoungesClient = async (
  page = 1,
  limit = 20,
  search = "",
  status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE",
) => {
  const query = buildSearchParams({ page, limit, search, status });
  const url = `${BACKEND_URL_CONFERENCES}/lounge?${query.toString()}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération des salons");
    }
    return {
      data: result as LoungeListResponse,
      status: "success",
      message: "Salons récupérés avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const createLoungeClient = async (data: CreateLoungeInput) => {
  const url = `${BACKEND_URL_CONFERENCES}/lounge`;

  try {
    const response = await fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la création du salon");
    }
    return {
      data: result as Lounge,
      status: "success",
      message: "Salon créé avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getLoungeByIdClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/lounge/${id}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération du salon");
    }
    return {
      data: result as Lounge,
      status: "success",
      message: "Salon récupéré avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getLoungeBookingsClient = async (
  page = 1,
  limit = 20,
  search = "",
  loungeId?: string,
  bookingStatus?: LoungeBookingStatus,
) => {
  const query = buildSearchParams({
    page,
    limit,
    search,
    loungeId,
    bookingStatus,
  });
  const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings?${query.toString()}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération des réservations");
    }
    return {
      data: result as LoungeBookingListResponse,
      status: "success",
      message: "Réservations récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getLoungeBookingByIdClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings/${id}`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération de la réservation");
    }
    return {
      data: result as LoungeBooking,
      status: "success",
      message: "Réservation récupérée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getLoungeBookingHistoryClient = async (id: string) => {
  const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings/${id}/history`;

  try {
    const response = await fetchWithAuth(url);
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la récupération de l'historique");
    }
    return {
      data: result as LoungeBookingHistory[],
      status: "success",
      message: "Historique récupéré avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const updateLoungeBookingStatusClient = async (
  id: string,
  data: UpdateLoungeBookingStatusInput,
) => {
  const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings/${id}/status`;

  try {
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      handleError(response, result, "Erreur lors de la mise à jour de la réservation");
    }
    return {
      data: result as LoungeBooking,
      status: "success",
      message: "Réservation mise à jour avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};
