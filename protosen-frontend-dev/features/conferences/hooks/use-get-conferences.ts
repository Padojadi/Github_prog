import {
	useInfiniteQuery,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
	getConferenceById,
	getConferenceByIdPublic,
	getConferences,
	getConferencesPublic,
	getConferencesRequest,
} from "../lib/apis-client";
import {
	type TGetConferenceByIdPublicResponse,
	TGetConferencesByIdResponse,
	type TGetConferencesPublicResponse,
	type TGetConferencesResponse,
} from "../types/responses-types";

export function useGetNewConferencesRequest() {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["conferences"],
		queryFn: async () => {
			const response = await getConferencesRequest();
			if ("code" in response) {
				if (
					response.code === "237" ||
					response.code === "235" ||
					response.code === "236"
				) {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				// console.error(response.code, response.message);
				throw new Error(
					"Échec de la récupération de la liste des demandes conférences",
				);
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

export function useGetConferences(initialData: TGetConferencesResponse) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: ["conferences", "carousel"],
		queryFn: async () => {
			const response = await getConferences(1, 10, "");
			if ("code" in response) {
				if (
					response.code === "237" ||
					response.code === "235" ||
					response.code === "236"
				) {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				// console.error(response.code, response.message);
				throw new Error("Échec de la récupération de la liste des conférences");
			}
			return response;
		},
		retry: 1,
		initialData: initialData,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}

export function useGetConferencesPublic(
	initialData: TGetConferencesPublicResponse,
) {
	const { data, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: ["conferences", "carousel"],
		queryFn: async () => {
			const response = await getConferencesPublic(1, 10, "");
			if ("code" in response) {
				// console.error(response.code, response.message);
				throw new Error("Échec de la récupération de la liste conférences");
			}
			return response;
		},
		retry: 1,
		initialData: initialData,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}

export function useGetConference(id: string) {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["conferences", id],
		queryFn: async () => {
			const response = await getConferenceById(id);
			if ("code" in response) {
				if (
					response.code === "237" ||
					response.code === "235" ||
					response.code === "236"
				) {
					await signOut({ redirect: false });
					router.push("/signin");
				}
				// console.error(response.code, response.message);
				throw new Error("Échec de la récupération de la conférence");
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

export function useGetConferencePublic(
	id: string,
	initialData: TGetConferenceByIdPublicResponse,
) {
	const { data, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: ["conferences", id],
		queryFn: async () => {
			const response = await getConferenceByIdPublic(id);
			if ("code" in response) {
				// console.error(response.code, response.message);
				throw new Error("Échec de la récupération de la conférence");
			}
			return response;
		},
		initialData,
	});

	return {
		data,
		isLoading,
		error,
		refetch,
	};
}

export function useGetInfiniteConferences(page: number, search: string) {
	const router = useRouter();
	const {
		data,
		isFetching,
		error,
		refetch,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["conferences", page, 10, search],
		queryFn: async () => {
			const response = await getConferences(page, 10, search);
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
				toast.error("Échec de la récupération de la liste des conférences");
				// return {
				//   ...response,
				//   data: {
				//     conferences: [],
				//     currentPage: 1,
				//     total: 0,
				//     totalPages: 0,
				//   },
				// };
				throw new Error(
					"Échec de la récupération de la liste des demandes conférences",
				);
			}
			return response;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) =>
			lastPage.data.totalPages === lastPage.data.currentPage
				? undefined
				: lastPage.data.totalPages === 0
					? undefined
					: lastPage.data.currentPage + 1,
		retry: 1,
	});

	return {
		data,
		isFetching,
		error,
		refetch,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		status,
	};
}

export function useGetInfiniteConferencesPublic(
	page: number,
	search: string,
	startDate?: string,
	endDate?: string,
) {
	const {
		data,
		isFetching,
		error,
		refetch,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["conferences", page, 10, search],
		queryFn: async () => {
			const response = await getConferencesPublic(page, 10, search);
			if ("code" in response) {
				// console.error(response.code, response.message);
				toast.error("Échec de la récupération de la liste des conférences");
				// return {
				//   ...response,
				//   data: {
				//     conferences: [],
				//     currentPage: 1,
				//     total: 0,
				//     totalPages: 0,
				//   },
				// };
				throw new Error(
					"Échec de la récupération de la liste des demandes conférences",
				);
			}
			return response;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) =>
			lastPage.data.totalPages === lastPage.data.currentPage
				? undefined
				: lastPage.data.currentPage + 1,
		retry: 1,
	});

	return {
		data,
		isFetching,
		error,
		refetch,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		status,
	};
}
