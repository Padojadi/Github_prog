"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetLoungeBookings } from "@/features/honor-lounge/hooks/use-get-lounges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LoungeBookingStatus } from "@/features/honor-lounge/types";

function statusLabel(status: string) {
  const mapping: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    CANCELLED: "Annulée",
    COMPLETED: "Terminée",
  };
  return mapping[status] || status;
}

function statusVariant(status: string): "default" | "destructive" | "secondary" {
  if (status === "CONFIRMED") return "default";
  if (status === "CANCELLED") return "destructive";
  return "secondary";
}

export default function HonorLoungeBookingsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const bookingStatus = searchParams.get("bookingStatus") || undefined;
  const limit = 10;

  const { data, isLoading, isFetching } = useGetLoungeBookings(
    page,
    limit,
    search,
    undefined,
    bookingStatus as LoungeBookingStatus | undefined,
  );
  const bookings =
    data && !("code" in data) && !("code" in data.data) ? data.data.data : [];
  const totalPages =
    data && !("code" in data) && !("code" in data.data)
      ? Math.max(1, data.data.totalPages)
      : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mes réservations - Salon d'honneur</h1>
          {bookingStatus ? (
            <p className="text-xs text-muted-foreground mt-1">
              Filtre actif: {statusLabel(bookingStatus)}
            </p>
          ) : null}
        </div>
        <Button asChild>
          <Link href="/panel/honor-lounge">Nouvelle réservation</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rechercher une réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nom invité, organisation ou salon..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center">Chargement...</CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune réservation trouvée.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">{booking.lounge?.name || "Salon"}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(booking.startTime), "dd MMM yyyy HH:mm", {
                        locale: fr,
                      })}{" "}
                      -{" "}
                      {format(new Date(booking.endTime), "dd MMM yyyy HH:mm", {
                        locale: fr,
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Invités: {booking.numGuests}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(booking.status)}>
                      {statusLabel(booking.status)}
                    </Badge>
                    <span className="text-sm font-medium">
                      {booking.totalAmount.toLocaleString("fr-FR")} FCFA
                    </span>
                    <Button variant="outline" asChild>
                      <Link href={`/panel/honor-lounge/bookings/${booking.id}`}>
                        Détails
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isFetching}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} / {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || isFetching}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
