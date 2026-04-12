"use server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { getApiErrorMessage } from "@/lib/api-status-codes";
import { authOptions } from "@/lib/auth/authOptions";
import { BACKEND_URL_CONFERENCES } from "@/lib/constants";
import { createSafeError, ServerActionError } from "@/lib/errors";

// conferences

export const requestConference = async <T>(
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/request`;

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
		// console.log(result);

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
					: "Erreur lors de la création de la demande de conférence.",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const updateConference = async <T>(
	id: unknown,
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/request/${id}`;
	// console.log(data, id);

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		// console.log(response);
		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors de la mise à jour de la conférence.",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const deleteConference = async (
	id: unknown,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/${id}`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors de la suppression de la conférence.",
			);
		}

		return {
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const acceptConference = async (
	id: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference-request/${id}/accept`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				changedBy: session?.user.id,
			}),
		});

		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors de la acceptation de la conférence.",
			);
		}

		revalidatePath(`/panel/conferences/${id}`);

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const validateConference = async (
	id: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference-request/${id}/validate`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				changedBy: session?.user.id,
			}),
		});

		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors de la validation de la conférence.",
			);
		}

		revalidatePath(`/panel/conferences/${id}`);

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const confirmConference = async (
	id: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference-request/${id}/confirm`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				changedBy: session?.user.id,
			}),
		});

		const result = await response.json();
		// console.log(result);

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					"401",
					result?.message || "Veuillez vous connecter",
				);
			}
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Erreur lors de la confirmation de la conférence.",
			);
		}

		revalidatePath(`/panel/conferences/${id}`);

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const rejectConference = async (
	id: string,
	reason: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference-request/${id}/reject`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				changedBy: session?.user.id,
				rejectionReason: reason,
			}),
		});

		// console.log(response);
		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors du rejet de la conférence.",
			);
		}

		revalidatePath(`/panel/conferences/${id}`);

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const rejectDefinitelyConference = async (
	id: string,
	reason: string,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference-request/${id}/reject-permanently`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				changedBy: session?.user.id,
				rejectionReason: reason,
			}),
		});

		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors du rejet défintif de la conférence.",
			);
		}

		revalidatePath(`/panel/conferences/${id}`);

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const createConference = async <T>(
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/publish`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		// console.log(response);

		const result = await response.json();
		// console.log(result);

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
					: "Erreur lors de la création de la conférence.",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const updateCreatedConference = async <T>(
	id: unknown,
	data: T,
	_errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/${id}`;
	// console.log(data, id);

	let result: any;

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		// console.log(response);
		try {
			result = await response.json();
		} catch {
			result = null;
		}
		// console.log(result);

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
					: "Erreur lors de la mise à jour de la conférence.",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};

export const assignParticipantTypes = async <T>(
	data: T,
	errorMessage: string,
	successMessage: string,
) => {
	const session = await getServerSession(authOptions);

	const token = session?.backendTokens?.accessToken;

	const url = `${BACKEND_URL_CONFERENCES}/conference/assign-participant-types`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(data),
		});

		// console.log(response);

		const result = await response.json();
		console.log(result);

		if (!response.ok) {
			if (response.status === 401) {
				throw new ServerActionError(
					"401",
					result?.message || "Veuillez vous connecter",
				);
			}
			throw new ServerActionError(
				result?.code ? String(result?.code) : String(response.status),
				result?.code
					? getApiErrorMessage(result?.code)
					: "Erreur lors de l'assignation des catégories de participants.",
			);
		}

		return {
			data: result,
			status: "success",
			message: successMessage,
		};
	} catch (error) {
		return createSafeError(error);
	}
};
