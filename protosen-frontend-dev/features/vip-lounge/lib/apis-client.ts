"use client";

import { getSession } from "next-auth/react";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type {
  VipAccessRequest,
  VipBooking,
  VipLounge,
  CreateVipAccessRequestPayload,
  CreateVipBookingPayload,
  VipLoungeStatus,
  VipBookingStatus,
  VipAccessRequestStatus,
} from "../types";

async function authFetch(url: string, init?: RequestInit) {
  const session = await getSession();
  const token = session?.backendTokens?.accessToken;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  return response;
}

export const getVipLoungesClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/lounges`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération des salons VIP"
      );
    }
    return {
      status: "success",
      data: result as VipLounge[],
      message: "Salons VIP récupérés avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const createVipBookingClient = async (payload: CreateVipBookingPayload) => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/bookings`;
  try {
    const response = await authFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la création de la réservation"
      );
    }
    return {
      status: "success",
      data: result as VipBooking,
      message: "Réservation créée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getMyVipBookingsClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/bookings/my`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération des réservations"
      );
    }
    return {
      status: "success",
      data: result as VipBooking[],
      message: "Réservations récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const createVipAccessRequestClient = async (
  payload: CreateVipAccessRequestPayload
) => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests`;
  try {
    const response = await authFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la création de la demande d'accès"
      );
    }
    return {
      status: "success",
      data: result as VipAccessRequest,
      message: "Demande d'accès créée avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getMyVipAccessRequestsClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests/my`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération des demandes d'accès"
      );
    }
    return {
      status: "success",
      data: result as VipAccessRequest[],
      message: "Demandes d'accès récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getMyVipAccessRequests = getMyVipAccessRequestsClient;

export const getVipBookingsAdminClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/bookings`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération des réservations admin"
      );
    }
    return {
      status: "success",
      data: result as VipBooking[],
      message: "Réservations admin récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getAllVipBookingsClient = getVipBookingsAdminClient;

export const updateVipBookingStatusClient = async (
  id: string,
  status: VipBookingStatus,
  adminNotes?: string
) => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/bookings/${id}/status`;
  try {
    const response = await authFetch(url, {
      method: "PATCH",
      body: JSON.stringify({ status, adminNotes }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la mise à jour du statut réservation"
      );
    }
    return {
      status: "success",
      data: result as VipBooking,
      message: "Statut de réservation mis à jour",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const updateVipBookingStatusAction = async (
  id: string,
  payload: { status: VipBookingStatus; adminNotes?: string }
) => updateVipBookingStatusClient(id, payload.status, payload.adminNotes);

export const getVipAccessRequestsAdminClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération des demandes admin"
      );
    }
    return {
      status: "success",
      data: result as VipAccessRequest[],
      message: "Demandes admin récupérées avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getAllVipAccessRequestsClient = getVipAccessRequestsAdminClient;

export const updateVipAccessRequestStatusClient = async (
  id: string,
  status: VipAccessRequestStatus,
  adminNotes?: string
) => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests/${id}/status`;
  try {
    const response = await authFetch(url, {
      method: "PATCH",
      body: JSON.stringify({ status, adminNotes }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la mise à jour du statut de demande"
      );
    }
    return {
      status: "success",
      data: result as VipAccessRequest,
      message: "Statut de la demande mis à jour",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const updateVipAccessRequestStatusAction = async (
  id: string,
  payload: { status: VipAccessRequestStatus; adminNotes?: string }
) => updateVipAccessRequestStatusClient(id, payload.status, payload.adminNotes);

export const createVipLoungeClient = async (
  payload: {
    name: string;
    description?: string;
    capacity: number;
    hourlyRate: number;
    location: string;
    status?: VipLoungeStatus;
    amenities?: string[];
    availableDays?: string[];
    timeSlots?: { start: string; end: string }[];
    imageUrl?: string;
  }
) => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/lounges`;
  try {
    const response = await authFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la création du salon"
      );
    }
    return {
      status: "success",
      data: result as VipLounge,
      message: "Salon créé avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

export const getVipBookingHistoryClient = async () => {
  const url = `${BACKEND_URL_CONFERENCES}/vip-lounge/bookings/history`;
  try {
    const response = await authFetch(url, { method: "GET" });
    const result = await response.json();
    if (!response.ok) {
      throw new ServerActionError(
        String(response.status),
        result?.message || "Erreur lors de la récupération de l'historique"
      );
    }
    return {
      status: "success",
      data: result as {
        id: string;
        booking_id: string;
        action: string;
        old_status: string | null;
        new_status: string | null;
        notes: string | null;
        processed_by: string | null;
        created_at: string;
      }[],
      message: "Historique récupéré avec succès",
    };
  } catch (error) {
    return createSafeError(error);
  }
};

