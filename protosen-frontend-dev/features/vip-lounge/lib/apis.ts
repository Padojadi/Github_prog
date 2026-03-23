"use server";

import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import type {
	CreateVipAccessRequestPayload,
	CreateVipBookingPayload,
	CreateVipLoungeInput,
	UpdateVipAccessRequestStatusInput,
	UpdateVipBookingStatusInput,
	UpdateVipLoungeInput,
} from "../types";

async function getAuthToken() {
	const session = await getServerSession(authOptions);
	return session?.backendTokens?.accessToken;
}

function buildAuthHeaders(token?: string) {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token || ""}`,
	};
}

export async function createVipLounge(payload: CreateVipLoungeInput) {
	const token = await getAuthToken();
	try {
		const response = await fetch(`${BACKEND_URL_CONFERENCES}/vip-lounge/lounges`, {
			method: "POST",
			headers: buildAuthHeaders(token),
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la création du salon VIP.",
			);
		}
		return { data: result, status: "success", message: "Salon VIP créé." };
	} catch (error) {
		return createSafeError(error);
	}
}

export async function updateVipLounge(id: string, payload: UpdateVipLoungeInput) {
	const token = await getAuthToken();
	try {
		const response = await fetch(
			`${BACKEND_URL_CONFERENCES}/vip-lounge/lounges/${id}`,
			{
				method: "PATCH",
				headers: buildAuthHeaders(token),
				body: JSON.stringify(payload),
			},
		);
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la mise à jour du salon VIP.",
			);
		}
		return { data: result, status: "success", message: "Salon VIP mis à jour." };
	} catch (error) {
		return createSafeError(error);
	}
}

export async function deleteVipLounge(id: string) {
	const token = await getAuthToken();
	try {
		const response = await fetch(
			`${BACKEND_URL_CONFERENCES}/vip-lounge/lounges/${id}`,
			{
				method: "DELETE",
				headers: buildAuthHeaders(token),
			},
		);
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la suppression du salon VIP.",
			);
		}
		return { data: result, status: "success", message: "Salon VIP supprimé." };
	} catch (error) {
		return createSafeError(error);
	}
}

export async function createVipBooking(payload: CreateVipBookingPayload) {
	const token = await getAuthToken();
	try {
		const response = await fetch(`${BACKEND_URL_CONFERENCES}/vip-lounge/bookings`, {
			method: "POST",
			headers: buildAuthHeaders(token),
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la réservation VIP.",
			);
		}
		return { data: result, status: "success", message: "Réservation créée." };
	} catch (error) {
		return createSafeError(error);
	}
}

export async function updateVipBookingStatus(
	id: string,
	payload: UpdateVipBookingStatusInput,
) {
	const token = await getAuthToken();
	try {
		const response = await fetch(
			`${BACKEND_URL_CONFERENCES}/vip-lounge/bookings/${id}/status`,
			{
				method: "PATCH",
				headers: buildAuthHeaders(token),
				body: JSON.stringify(payload),
			},
		);
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la mise à jour de la réservation.",
			);
		}
		return {
			data: result,
			status: "success",
			message: "Réservation mise à jour.",
		};
	} catch (error) {
		return createSafeError(error);
	}
}

export async function createVipAccessRequest(payload: CreateVipAccessRequestPayload) {
	const token = await getAuthToken();
	try {
		const response = await fetch(
			`${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests`,
			{
				method: "POST",
				headers: buildAuthHeaders(token),
				body: JSON.stringify(payload),
			},
		);
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la création de la demande d'accès.",
			);
		}
		return {
			data: result,
			status: "success",
			message: "Demande d'accès soumise.",
		};
	} catch (error) {
		return createSafeError(error);
	}
}

export async function updateVipAccessRequestStatus(
	id: string,
	payload: UpdateVipAccessRequestStatusInput,
) {
	const token = await getAuthToken();
	try {
		const response = await fetch(
			`${BACKEND_URL_CONFERENCES}/vip-lounge/access-requests/${id}/status`,
			{
				method: "PATCH",
				headers: buildAuthHeaders(token),
				body: JSON.stringify(payload),
			},
		);
		const result = await response.json();
		if (!response.ok) {
			throw new ServerActionError(
				result?.code ? String(result.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result.code)
					: result?.message || "Erreur lors de la mise à jour de la demande.",
			);
		}
		return {
			data: result,
			status: "success",
			message: "Demande d'accès mise à jour.",
		};
	} catch (error) {
		return createSafeError(error);
	}
}
