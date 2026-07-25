"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getLoungeBookingsClient,
  getLoungeByIdClient,
  getLoungesClient,
} from "../lib/apis-client";
import type { LoungeBookingStatus, LoungeStatus } from "../types";

export function useGetLounges(
  page: number,
  limit: number,
  search = "",
  status?: LoungeStatus,
) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["honor-lounge", "lounges", page, limit, search, status],
    queryFn: async () => getLoungesClient(page, limit, search, status),
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

export function useGetLoungeById(id: string) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["honor-lounge", "lounge", id],
    queryFn: async () => getLoungeByIdClient(id),
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

export function useGetLoungeBookings(
  page: number,
  limit: number,
  search = "",
  loungeId?: string,
  bookingStatus?: LoungeBookingStatus,
) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [
      "honor-lounge",
      "bookings",
      page,
      limit,
      search,
      loungeId,
      bookingStatus,
    ],
    queryFn: async () =>
      getLoungeBookingsClient(page, limit, search, loungeId, bookingStatus),
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
