"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getVipLoungesClient } from "@/features/vip-lounge/lib/apis-client";
import type { VipLounge } from "@/features/vip-lounge/types";
import useCurrentUser from "@/hooks/useCurrentUser";

function statusVariant(status: VipLounge["status"]) {
  if (status === "active") return "default";
  if (status === "maintenance") return "secondary";
  return "outline";
}

export default function VipLoungesPage() {
  const [lounges, setLounges] = useState<VipLounge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const currentUser = useCurrentUser();

  const canManage =
    currentUser.isAdmin ||
    currentUser.isSuperAdmin ||
    (currentUser.accessGroup?.permissions || []).includes("MANAGE_VIP_LOUNGE");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return lounges;
    return lounges.filter(
      (lounge) =>
        lounge.name.toLowerCase().includes(term) ||
        lounge.location.toLowerCase().includes(term),
    );
  }, [lounges, search]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await getVipLoungesClient();
      if (!("data" in result)) {
        toast.error(result.message || "Erreur chargement salons VIP");
        setLoading(false);
        return;
      }
      setLounges(result.data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Salons VIP</h1>
          <p className="text-muted-foreground text-sm">
            Catalogue des salons disponibles pour réservations et accès.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            className="w-64"
            placeholder="Rechercher un salon..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {canManage ? (
            <Button asChild>
              <Link href="/panel/vip-lounge/admin">Administration</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des salons...
        </div>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Aucun salon VIP trouvé.
          </CardContent>
        </Card>
      ) : null}

      {!loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((lounge) => (
            <Card key={lounge.id}>
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{lounge.name}</CardTitle>
                  <Badge variant={statusVariant(lounge.status)}>
                    {lounge.status}
                  </Badge>
                </div>
                <CardDescription>
                  {lounge.description || "Aucune description disponible."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{lounge.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacité: {lounge.capacity}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Tarif horaire: </span>
                  <span>{lounge.hourlyRate.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link
                      href={`/panel/vip-lounge/bookings?loungeId=${lounge.id}`}
                    >
                      Réserver
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/panel/vip-lounge/lounges/${lounge.id}`}>Détails</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
