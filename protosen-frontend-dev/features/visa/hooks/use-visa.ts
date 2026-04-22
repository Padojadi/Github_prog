"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getVisaKpisClient,
  getVisaRequestByIdClient,
  getVisaRequestsClient,
  getVisaHistoryClient,
} from "../lib/apis-client";
import type { VisaValidationDecision, VisaWorkflowStatus } from "../types/index";

export function useGetVisaRequests(
  page: number,
  limit: number,
  search = "",
  status?: VisaWorkflowStatus,
  decision?: VisaValidationDecision,
  dossierNumber?: string,
  visaNumber?: string,
) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [
      "visa",
      "requests",
      page,
      limit,
      search,
      status,
      decision,
      dossierNumber,
      visaNumber,
    ],
    queryFn: async () =>
      getVisaRequestsClient({
        page,
        limit,
        search,
        status,
        decision,
        dossierNumber,
        visaNumber,
      }),
    retry: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export function useGetVisaRequestById(id: string) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["visa", "request", id],
    queryFn: async () => getVisaRequestByIdClient(id),
    enabled: !!id,
    retry: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export function useGetVisaRequestHistory(id: string) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["visa", "request-history", id],
    queryFn: async () => getVisaHistoryClient(id),
    enabled: !!id,
    retry: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export function useGetVisaKpis(from?: string, to?: string) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["visa", "kpis", from, to],
    queryFn: async () => getVisaKpisClient(from, to),
    retry: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
