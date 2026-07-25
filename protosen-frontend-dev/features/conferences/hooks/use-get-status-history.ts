import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getConferenceStatusHistoryClient } from "../lib/apis-client";

export function useGetConferenceStatusHistory(id: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["status-history", id],
		queryFn: async () => {
			const response = await getConferenceStatusHistoryClient(id);
			if ("code" in response) {
				if (
					response.code === "237" ||
					response.code === "235" ||
					response.code === "236"
				) {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				console.error(response.code, response.message);
				throw new Error("Échec de la récupération de l'historique des statuts");
			}
			return response;
		},
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}
