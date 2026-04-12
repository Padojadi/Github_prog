"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import LoadingComponent from "@/components/loadingComponent";
import { toast } from "sonner";
import {
  getLoungeBookingByIdClient,
  updateLoungeBookingStatusClient,
} from "@/features/honor-lounge/lib/apis-client";
import type { LoungeBooking, LoungeBookingStatus } from "@/features/honor-lounge/types";

function statusLabel(status: LoungeBookingStatus) {
  const labels: Record<LoungeBookingStatus, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    CANCELLED: "Annulée",
    COMPLETED: "Terminée",
  };
  return labels[status];
}

function statusVariant(status: LoungeBookingStatus): "default" | "secondary" | "destructive" {
  if (status === "CONFIRMED") return "default";
  if (status === "CANCELLED") return "destructive";
  return "secondary";
}

export default function HonorLoungeBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<LoungeBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await getLoungeBookingByIdClient(params.id);
      if (!("code" in result) && !("code" in result.data)) {
        setBooking(result.data);
        setAdminNotes(result.data.adminNotes || "");
      } else {
        toast.error("Impossible de charger la réservation.");
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleStatusUpdate = async (status: LoungeBookingStatus) => {
    if (!booking) return;
    setSubmitting(true);
    const result = await updateLoungeBookingStatusClient(booking.id, {
      status,
      adminNotes: adminNotes || undefined,
    });
    if (!("code" in result) && !("code" in result.data)) {
      setBooking(result.data);
      toast.success("Réservation mise à jour avec succès.");
    } else {
      toast.error("Erreur lors de la mise à jour de la réservation.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!booking) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Réservation introuvable.</p>
        <Button asChild variant="outline">
          <Link href="/panel/honor-lounge/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/panel/honor-lounge/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Détails de la réservation</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{booking.lounge?.name || "Salon"}</CardTitle>
            <Badge variant={statusVariant(booking.status)}>
              {statusLabel(booking.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Début:{" "}
            {format(new Date(booking.startTime), "dd MMM yyyy HH:mm", {
              locale: fr,
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            Fin:{" "}
            {format(new Date(booking.endTime), "dd MMM yyyy HH:mm", {
              locale: fr,
            })}
          </p>
          <p className="text-sm text-muted-foreground">Invités: {booking.numGuests}</p>
          <p className="text-sm text-muted-foreground">
            Montant: {booking.totalAmount.toLocaleString("fr-FR")} FCFA
          </p>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Notes administratives</p>
            <Textarea
              rows={3}
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="Ajouter une note..."
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={submitting}
            >
              Confirmer
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={submitting}
            >
              Marquer terminée
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
