import { useQuery } from "@tanstack/react-query";
import { getSystemSettings } from "../lib/apis";

export function useSystemSettingsClient() {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: () => getSystemSettings(),
  });
}