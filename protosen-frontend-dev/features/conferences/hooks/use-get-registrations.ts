import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
	getConferenceRegistrationById,
	getConferenceRegistrations,
} from "../lib/participants-apis-client";
import type { ConferenceRegistration } from "../types";

export function useGetConferenceRegistrations(id: string, status?: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["conference-registrations", id, status],
		queryFn: async () => {
			const response = await getConferenceRegistrations(id, status);
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
				toast.error("Échec de la récupération de la liste des inscriptions");
				return {
					data: [],
					message: response.message,
					status: "error",
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

export function useGetConferenceRegistrationById(id: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["conference-registration", id],
		queryFn: async () => {
			const response = await getConferenceRegistrationById(id);
			if ("code" in response) {
				if (response.code === "401") {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				console.error(response.code, response.message);
				toast.error("Échec de la récupération de l'inscription");
				return {
					data: {} as ConferenceRegistration,
					message: response.message,
					status: "error",
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
