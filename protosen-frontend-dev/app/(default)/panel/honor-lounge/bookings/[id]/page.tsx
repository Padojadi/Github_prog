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
  getLoungeBookingHistoryClient,
  updateLoungeBookingStatusClient,
} from "@/features/honor-lounge/lib/apis-client";
import {
  BookingQrCode,
} from "@/features/honor-lounge/components/booking-qr-code";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import type {
  LoungeBooking,
  LoungeBookingHistory,
  LoungeBookingStatus,
  LoungePaymentStatus,
} from "@/features/honor-lounge/types";

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
  const currentUser = useCurrentUser();
  const [booking, setBooking] = useState<LoungeBooking | null>(null);
  const [history, setHistory] = useState<LoungeBookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<LoungePaymentStatus>("PENDING");

  useEffect(() => {
    const load = async () => {
      const [bookingResult, historyResult] = await Promise.all([
        getLoungeBookingByIdClient(params.id),
        getLoungeBookingHistoryClient(params.id),
      ]);

      if (!("code" in bookingResult) && !("code" in bookingResult.data)) {
        setBooking(bookingResult.data);
        setAdminNotes(bookingResult.data.adminNotes || "");
        setPaymentStatus(bookingResult.data.paymentStatus);
      } else {
        toast.error("Impossible de charger la réservation.");
      }

      if (!("code" in historyResult) && !("code" in historyResult.data)) {
        setHistory(historyResult.data);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const canManageBookings =
    currentUser?.isAdmin ||
    currentUser?.isSuperAdmin ||
    hasPermission(currentUser?.accessGroup?.permissions || [], [
      "MANAGE_CONFERENCES",
    ]);

  const isOwner = booking?.userId === currentUser?.id;

  const handleStatusUpdate = async (status: LoungeBookingStatus) => {
    if (!booking) return;
    if (!canManageBookings && !(isOwner && status === "CANCELLED")) {
      toast.error("Vous n'avez pas les permissions pour cette action.");
      return;
    }

    setSubmitting(true);
    const result = await updateLoungeBookingStatusClient(booking.id, {
      status,
      adminNotes: adminNotes || undefined,
      paymentStatus,
    });
    if (!("code" in result) && !("code" in result.data)) {
      setBooking(result.data);
      const historyResult = await getLoungeBookingHistoryClient(booking.id);
      if (!("code" in historyResult) && !("code" in historyResult.data)) {
        setHistory(historyResult.data);
      }
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
          <p className="text-sm text-muted-foreground">
            Paiement:{" "}
            {booking.paymentMethod === "ONLINE" ? "En ligne" : "Sur place"} -{" "}
            {booking.paymentStatus}
          </p>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Notes administratives</p>
            <Textarea
              rows={3}
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="Ajouter une note..."
              disabled={!canManageBookings}
            />
          </div>

          {canManageBookings ? (
            <div className="space-y-1">
              <label className="text-sm font-medium">Statut de paiement</label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value as LoungePaymentStatus)
                }
              >
                <option value="PENDING">En attente</option>
                <option value="COMPLETED">Complété</option>
                <option value="FAILED">Échoué</option>
              </select>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={submitting || !canManageBookings}
            >
              Confirmer
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={submitting || (!canManageBookings && !isOwner)}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={submitting || !canManageBookings}
            >
              Marquer terminée
            </Button>
          </div>
        </CardContent>
      </Card>

      {booking.status === "CONFIRMED" && booking.qrCodeData ? (
        <BookingQrCode qrCodeData={booking.qrCodeData} bookingId={booking.id} />
      ) : null}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun historique disponible.</p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="border rounded-md p-3">
                <p className="text-sm font-medium">{entry.action}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.oldStatus || "-"} → {entry.newStatus || "-"}
                </p>
                {entry.notes ? <p className="text-sm mt-1">{entry.notes}</p> : null}
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
