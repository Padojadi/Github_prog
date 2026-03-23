"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVipLoungesClient } from "@/features/vip-lounge/lib/apis-client";
import type { VipLounge } from "@/features/vip-lounge/types";

function statusVariant(status: VipLounge["status"]) {
  if (status === "active") return "default";
  if (status === "maintenance") return "secondary";
  return "outline";
}

export default function VipLoungeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [lounge, setLounge] = useState<VipLounge | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const result = await getVipLoungesClient();
      if (!mounted) return;
      if ("data" in result) {
        const found = result.data.find((item) => item.id === id) ?? null;
        setLounge(found);
      }
      setLoading(false);
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement...</div>;
  }

  if (!lounge) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">Salon introuvable.</p>
          <Button asChild variant="outline">
            <Link href="/panel/vip-lounge/lounges">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{lounge.name}</h1>
          <p className="text-sm text-muted-foreground">{lounge.description || "Sans description."}</p>
        </div>
        <Badge variant={statusVariant(lounge.status)}>{lounge.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{lounge.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Capacité: {lounge.capacity} personnes</span>
          </div>
          <div>
            <span className="font-medium">Tarif horaire: </span>
            {lounge.hourlyRate.toLocaleString("fr-FR")} FCFA
          </div>
          <div>
            <span className="font-medium">Services: </span>
            {lounge.amenities.length ? lounge.amenities.join(", ") : "Aucun"}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/panel/vip-lounge/bookings?loungeId=${lounge.id}`}>Réserver ce salon</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/panel/vip-lounge/lounges">Retour</Link>
        </Button>
      </div>
    </div>
  );
}
