import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getParticipantTypes } from "../lib/apis-client";

export function useGetParticipantTypes() {
	return useQuery({
		queryKey: ["participant-types"],
		queryFn: async () => {
			const response = await getParticipantTypes();
			if ("code" in response) {
				// console.error(response.code, response.message);
				toast.error(
					response.message ||
						"Échec de la récupération de la liste des types de participants",
				);
				return {
					data: [],
					message: response.message,
					status: "error",
					details: response.details,
				};
			}
			return response;
		},
	});
}
