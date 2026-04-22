"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Building2, CalendarClock, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetLounges, useGetLoungeBookings } from "@/features/honor-lounge/hooks/use-get-lounges";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";

export default function HonorLoungeDashboardPage() {
  const currentUser = useCurrentUser();
  const { data: loungesData } = useGetLounges(1, 200, "");
  const { data: bookingsData } = useGetLoungeBookings(1, 200, "");

  const stats = useMemo(() => {
    const lounges =
      loungesData && !("code" in loungesData) && !("code" in loungesData.data)
        ? loungesData.data.data
        : [];
    const bookings =
      bookingsData && !("code" in bookingsData) && !("code" in bookingsData.data)
        ? bookingsData.data.data
        : [];

    return {
      loungesTotal: lounges.length,
      bookingsTotal: bookings.length,
      pending: bookings.filter((item) => item.status === "PENDING").length,
      confirmed: bookings.filter((item) => item.status === "CONFIRMED").length,
      cancelled: bookings.filter((item) => item.status === "CANCELLED").length,
    };
  }, [loungesData, bookingsData]);

  const canManageLounges =
    currentUser?.isAdmin ||
    currentUser?.isSuperAdmin ||
    hasPermission(currentUser?.accessGroup?.permissions || [], ["MANAGE_CONFERENCES"]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord - Salon d'honneur</h1>
          <p className="text-sm text-muted-foreground">
            Vue d&apos;ensemble des salons et des réservations.
          </p>
        </div>
        <div className="flex gap-2">
          {canManageLounges ? (
            <Button variant="outline" asChild>
              <Link href="/panel/honor-lounge/manage">
                <Building2 className="h-4 w-4 mr-2" />
                Ajouter un salon
              </Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link href="/panel/honor-lounge/bookings/new">
              <CalendarClock className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Salons</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.loungesTotal}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Réservations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.bookingsTotal}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">En attente</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold inline-flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-amber-600" />
            {stats.pending}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Confirmées</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold inline-flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            {stats.confirmed}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Annulées</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold inline-flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            {stats.cancelled}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
