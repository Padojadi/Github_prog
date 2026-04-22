import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getConferenceParticipantTypes } from "../lib/apis-client";
import { getParticipantTypes } from "../participant-types/lib/apis-client";
import type { ParticipantType } from "../participant-types/types";
import type { ParticipantTypeAssigned } from "../types";

type TConferenceParticipantTypesReturnData = {
	all: {
		data: ParticipantType[];
		message: string;
		status: "error" | "success";
		details: "PROMISE_REJECT_ERROR" | (string & {});
	};
	conferenceId: {
		data: ParticipantTypeAssigned[];
		message: string;
		status: "error" | "success";
		details: "PROMISE_REJECT_ERROR" | (string & {});
	};
};

export function useGetConferenceParticipantTypes(id: string) {
	return useQuery({
		queryKey: ["participant-types-conference", id],
		queryFn: async () => {
			const dataToReturn: TConferenceParticipantTypesReturnData = {
				all: {
					data: [],
					message: "",
					status: "success",
					details: "",
				},
				conferenceId: {
					data: [],
					message: "",
					status: "success",
					details: "",
				},
			};

			const response = await Promise.allSettled([
				getParticipantTypes(),
				getConferenceParticipantTypes(id),
			]);

			if (response[0].status === "rejected") {
				console.error(response[0].reason);
				toast.error("Échec de la récupération de catégories de participant");
				dataToReturn.all = {
					data: [],
					message: "Une erreur inconnue est survenue",
					status: "error",
					details: "PROMISE_REJECT_ERROR",
				};
			}

			if (response[1].status === "rejected") {
				console.error(response[1].reason);
				toast.error(
					"Échec de la récupération de catégories de participant de la conférence",
				);

				dataToReturn.conferenceId = {
					data: [],
					message: "Une erreur inconnue est survenue",
					status: "error",
					details: "PROMISE_REJECT_ERROR",
				};
			}

			if (
				response[0].status === "rejected" ||
				response[1].status === "rejected"
			) {
				return dataToReturn;
			}

			if ("code" in response[0].value) {
				console.error(response[0].value.code, response[0].value.message);
				toast.error(
					response[0].value.message ||
						"Échec de la récupération de catégories de participant de la conférence",
				);
				dataToReturn.all = {
					data: [],
					message: response[0].value.message,
					status: "error",
					details: String(response[0].value.details) ?? "",
				};
			}

			if ("code" in response[1].value) {
				console.error(response[1].value.code, response[1].value.message);
				toast.error(
					response[1].value.message ||
						"Échec de la récupération de catégories de participant de la conférence",
				);
				dataToReturn.conferenceId = {
					data: [],
					message: response[1].value.message,
					status: "error",
					details: String(response[1].value.details) ?? "",
				};
			}

			if ("code" in response[0].value || "code" in response[1].value) {
				return dataToReturn;
			}

			dataToReturn.all = {
				data: response[0].value.data,
				message: response[0].value.message,
				status: "success",
				details: "",
			};

			dataToReturn.conferenceId = {
				data: response[1].value.data,
				message: response[1].value.message,
				status: "success",
				details: "",
			};

			return dataToReturn;
		},
		retry: 2,
	});
}

export function useGetConferenceParticipantTypeAlone(id: string) {
	return useQuery({
		queryKey: ["participant-types-conference-alone", id],
		queryFn: async () => {
			const response = await getConferenceParticipantTypes(id);

			if ("code" in response) {
				console.error(response.code, response.message);
				toast.error(
					response.message ||
						"Échec de la récupération de catégories de participant de la conférence",
				);
				return {
					data: [],
					message: response.message,
					status: "error",
					details: String(response.details) ?? "",
				};
			}

			return response;
		},
		retry: 2,
	});
}
