import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { getConferenceTicketsClient } from "../lib/ticket-apis-client";

export function useGetConferenceTickets(id: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["tickets", id],
		queryFn: async () => {
			const response = await getConferenceTicketsClient(id);
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
				toast.error(
					response.message ||
						"Échec de la récupération de la liste des tickets",
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
		retry: 1,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}
