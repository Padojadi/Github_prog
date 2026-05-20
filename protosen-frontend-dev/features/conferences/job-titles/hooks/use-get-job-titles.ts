import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getJobTitles } from "../lib/apis-client";

export function useGetJobTitles() {
	return useQuery({
		queryKey: ["job-titles"],
		queryFn: async () => {
			const response = await getJobTitles();
			if ("code" in response) {
				// console.error(response.code, response.message);
				toast.error(
					response.message ||
						"Échec de la récupération de la liste des fonctions",
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
