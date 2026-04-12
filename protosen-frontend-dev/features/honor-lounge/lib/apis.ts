"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";
import { type LoungeBookingStatus, type LoungePaymentStatus } from "../types";

type CreateBookingInput = {
	loungeId: string;
	startTime: string;
	endTime: string;
	numGuests: number;
	specialRequests?: string;
	paymentMethod?: "ONLINE" | "ON_SITE";
	paymentStatus?: "PENDING" | "COMPLETED" | "FAILED";
	guestFirstName?: string;
	guestLastName?: string;
	guestFunction?: string;
	guestPhone?: string;
	guestOrganization?: string;
	guestNationality?: string;
	airline?: string;
	flightNumber?: string;
	flightOrigin?: string;
	flightArrivalTime?: string;
};

export const createLoungeBooking = async (
	data: CreateBookingInput,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					result?.message || "Veuillez vous connecter",
				);
			}
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Erreur lors de la création de la réservation.",
			);
		}

		revalidatePath("/panel/honor-lounge");
		revalidatePath("/panel/honor-lounge/bookings");

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const updateLoungeBookingStatus = async (
	id: string,
	status: LoungeBookingStatus,
	adminNotes?: string,
	paymentStatus?: LoungePaymentStatus,
	_errorMessage?: string,
	successMessage = "Statut de réservation mis à jour avec succès.",
) => {
	const session = await getServerSession(authOptions);
	const token = session?.backendTokens?.accessToken;
	const url = `${BACKEND_URL_CONFERENCES}/lounge/bookings/${id}/status`;

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				status,
				adminNotes,
				paymentStatus,
			}),
		});

		const result = await response.json();

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					result?.code ? String(result?.code) : "401",
					result?.message || "Veuillez vous connecter",
				);
			}
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Erreur lors de la mise à jour du statut de réservation.",
			);
		}

		revalidatePath("/panel/honor-lounge/bookings");

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};
