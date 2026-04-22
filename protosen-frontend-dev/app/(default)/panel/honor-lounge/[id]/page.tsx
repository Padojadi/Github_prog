"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, MapPin, Users, Clock4 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingComponent from "@/components/loadingComponent";
import { formatDateFnsLocale } from "@/lib/utils";
import { useGetLoungeById } from "@/features/honor-lounge/hooks/use-get-lounges";
import { getLoungeStatusLabel } from "@/features/honor-lounge/types";

export default function HonorLoungeDetailPage() {
  const params = useParams<{ id: string }>();
  const loungeId = params?.id || "";
  const { data, isLoading } = useGetLoungeById(loungeId);

  const lounge = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return null;
    }
    return data.data;
  }, [data]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!lounge) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Salon introuvable.</p>
        <Button asChild variant="outline">
          <Link href="/panel/honor-lounge">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste des salons
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/panel/honor-lounge">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{lounge.name}</h1>
        <Badge variant="secondary">{getLoungeStatusLabel(lounge.status)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du salon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{lounge.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Capacité: {lounge.capacity} personnes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock4 className="h-4 w-4 text-muted-foreground" />
              <span>Tarif horaire: {lounge.hourlyRate.toLocaleString()} XOF</span>
            </div>
            {lounge.maxBookings ? (
              <div className="flex items-center gap-2 text-sm">
                <Clock4 className="h-4 w-4 text-muted-foreground" />
                <span>Max réservations / jour: {lounge.maxBookings}</span>
              </div>
            ) : null}
          </div>

          {lounge.description ? (
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{lounge.description}</p>
            </div>
          ) : null}

          {Array.isArray(lounge.amenities) && lounge.amenities.length > 0 ? (
            <div>
              <p className="text-sm font-medium mb-2">Services</p>
              <div className="flex flex-wrap gap-2">
                {lounge.amenities.map((item, idx) => (
                  <Badge key={`${item}-${idx}`} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          <div className="text-xs text-muted-foreground">
            <p>Créé le: {formatDateFnsLocale(lounge.createdAt)}</p>
            <p>Mis à jour le: {formatDateFnsLocale(lounge.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/panel/honor-lounge/bookings/new?loungeId=${lounge.id}`}>
            Réserver ce salon
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/panel/honor-lounge/bookings">Voir mes réservations</Link>
        </Button>
      </div>
    </div>
  );
}
