import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { PARTICIPANT_TOKEN_KEY } from "@/lib/constants";
import {
	getCurrentConferenceParticipant,
	getParticipantByCode,
} from "../lib/participants-apis-client";
import type { Participant, ParticipantTokenData } from "../types";

export function useGetCurrentParticipant(token: string) {
	const [_, _t, removeToken] = useSessionStorage<ParticipantTokenData>(
		PARTICIPANT_TOKEN_KEY,
	);
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["current-participant"],
		queryFn: async () => {
			const response = await getCurrentConferenceParticipant(token);
			if ("code" in response) {
				console.error(response.code, response.message);
				toast.error("Échec de la récupération des informations");
				removeToken();
				return {
					data: {} as Participant,
					message: response.message,
					status: "error",
				};
			}
			return response;
		},
		retry: 1,
		enabled: !!token,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}

export function useGetParticipantByCode(code: string) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["participant", code],
		queryFn: async () => {
			const response = await getParticipantByCode(code);
			if ("code" in response) {
				console.error(response.code, response.message);
				toast.error("Échec de la récupération du ticket");
				return {
					data: {} as Partial<Participant>,
					message: response.message,
					status: "error",
				};
			}
			return response;
		},
		retry: 1,
		enabled: !!code,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}
