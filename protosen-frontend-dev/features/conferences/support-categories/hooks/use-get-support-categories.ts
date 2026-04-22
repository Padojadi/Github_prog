import { useQuery } from "@tanstack/react-query";
import { getSupportCategories } from "../lib/apis-client";
import { toast } from "sonner";

export function useGetSupportCategories() {
  return useQuery({
    queryKey: ["support-categories"],
    queryFn: async () => {
      let response = await getSupportCategories();
      if ("code" in response) {
        console.error(response.code, response.message);
        toast.error(
          response.message ||
            "Échec de la récupération de la liste des prises en charges"
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
