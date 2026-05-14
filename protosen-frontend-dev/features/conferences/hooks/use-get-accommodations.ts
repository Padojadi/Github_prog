import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { getAccommodations } from "../lib/accommodations-apis-client";
import { getConferenceAccommodationsClient } from "../lib/apis-client";

export function useGetAccommodations() {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["accommodations"],
		queryFn: async () => {
			const response = await getAccommodations();
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
						"Échec de la récupération de la liste des hébergements",
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

export function useGetConferenceAccommodations(id: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["accommodations", id],
		queryFn: async () => {
			const response = await getConferenceAccommodationsClient(id);
			if ("code" in response) {
				if (response.code === "401") {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				console.error(response.code, response.message);
				toast.error(
					response.message ||
						"Échec de la récupération de la liste des hébergements",
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
