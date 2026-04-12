import { useQuery } from "@tanstack/react-query";
import { getOrganisms } from "../lib/apis";
import { toast } from "react-toastify";

export function useGetOrganism() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organisms"],
    queryFn: async () => {
      let response = await getOrganisms();
      if (response.status === "error") {
        throw new Error(response.message);
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

// export function useGetOrganismById(id: string) {
//   // if (id === undefined) return;
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["organism", id],
//     queryFn: async () => {
//       let response = await getOrganismById(id);
//       if (response.status === "error") {
//         console.error(response.message);
//         toast.error(
//           response.message || "Échec de la récupération de l'institution"
//         );
//         return {
//           data: [],
//           message: response.message,
//           status: "error",
//         };
//       }
//       return response;
//     },
//     retry: 1,
//     enabled: !!id,
//   });

//   return {
//     data,
//     isLoading,
//     error,
//     refetch,
//   };
// }
