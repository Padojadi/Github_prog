"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetLoungeBookings } from "@/features/honor-lounge/hooks/use-get-lounges";
import type { LoungeBookingStatus } from "@/features/honor-lounge/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getStatusLabel(status: LoungeBookingStatus) {
  const mapping: Record<LoungeBookingStatus, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    CANCELLED: "Annulée",
    COMPLETED: "Terminée",
  };
  return mapping[status];
}

export default function HonorLoungeBookingHistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"ALL" | LoungeBookingStatus>("ALL");
  const limit = 20;

  const { data, isLoading, isFetching } = useGetLoungeBookings(
    page,
    limit,
    search,
    undefined,
    status === "ALL" ? undefined : status,
  );

  const bookings = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data;
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return 1;
    }
    return Math.max(1, data.data.totalPages);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Historique des réservations</h1>
          <p className="text-sm text-muted-foreground">
            Vue globale des réservations et de leurs statuts.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/panel/honor-lounge/bookings/new">Nouvelle réservation</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <Input
            placeholder="Rechercher un invité, salon, organisation..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "ALL" | LoungeBookingStatus);
              setPage(1);
            }}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmée</option>
            <option value="CANCELLED">Annulée</option>
            <option value="COMPLETED">Terminée</option>
          </select>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Chargement de l&apos;historique...
          </CardContent>
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
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{booking.lounge?.name || "Salon"}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.guestFirstName || "-"} {booking.guestLastName || ""} -{" "}
                      {booking.guestOrganization || "Organisation non renseignée"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{getStatusLabel(booking.status)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleString("fr-FR")}
                    </p>
                    <Button asChild variant="link" className="h-auto p-0 text-xs">
                      <Link href={`/panel/honor-lounge/bookings/${booking.id}`}>Voir détails</Link>
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
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isFetching}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
