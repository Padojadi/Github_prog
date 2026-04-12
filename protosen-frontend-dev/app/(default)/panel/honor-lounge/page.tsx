"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Building2, Clock3, MapPin, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryState } from "nuqs";
import { useGetLounges } from "@/features/honor-lounge/hooks/use-get-lounges";
import type { Lounge } from "@/features/honor-lounge/types";

function currency(amount: number) {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusBadge(status: Lounge["status"]) {
  if (status === "ACTIVE") {
    return <Badge className="bg-green-600">Actif</Badge>;
  }
  if (status === "MAINTENANCE") {
    return <Badge variant="secondary">Maintenance</Badge>;
  }
  return <Badge variant="destructive">Inactif</Badge>;
}

export default function HonorLoungePage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const currentPage = Number(page) || 1;
  const { data, isLoading, isFetching } = useGetLounges(
    currentPage,
    10,
    search,
  );

  const lounges = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [] as Lounge[];
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Salon d'honneur</h1>
          <p className="text-sm text-muted-foreground">
            Consultez et réservez les salons disponibles.
          </p>
        </div>
        <Button asChild>
          <Link href="/panel/honor-lounge/bookings/new">
            <Clock3 className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage("1");
          }}
          className="pl-9"
          placeholder="Rechercher un salon..."
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Chargement des salons...
          </CardContent>
        </Card>
      ) : lounges.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucun salon trouvé.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lounges.map((lounge) => (
            <Card key={lounge.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{lounge.name}</CardTitle>
                  {statusBadge(lounge.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lounge.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Capacité: {lounge.capacity} personnes
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Tarif: {currency(lounge.hourlyRate)} / heure
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/panel/honor-lounge/${lounge.id}`}>Détails</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/panel/honor-lounge/bookings/new?loungeId=${lounge.id}`}>
                      Réserver
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage(String(Math.max(1, currentPage - 1)))}
          disabled={currentPage <= 1 || isFetching}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(String(Math.min(totalPages, currentPage + 1)))}
          disabled={currentPage >= totalPages || isFetching}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
