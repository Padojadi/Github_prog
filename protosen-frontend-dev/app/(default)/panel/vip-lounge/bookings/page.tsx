"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createVipBookingClient,
  getMyVipBookingsClient,
  getVipLoungesClient,
} from "@/features/vip-lounge/lib/apis-client";
import type { VipBooking, VipLounge } from "@/features/vip-lounge/types";

function statusVariant(status: VipBooking["status"]): "default" | "secondary" | "destructive" {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

export default function VipLoungeBookingsPage() {
  const [lounges, setLounges] = useState<VipLounge[]>([]);
  const [bookings, setBookings] = useState<VipBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    loungeId: "",
    startTime: "",
    endTime: "",
    numGuests: "1",
    specialRequests: "",
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [loungesRes, bookingsRes] = await Promise.all([
        getVipLoungesClient(),
        getMyVipBookingsClient(),
      ]);

      if (!mounted) return;

      if ("data" in loungesRes) setLounges(loungesRes.data);
      if ("data" in bookingsRes) setBookings(bookingsRes.data);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.loungeId || !form.startTime || !form.endTime) {
      toast.error("Veuillez renseigner les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    const res = await createVipBookingClient({
      loungeId: form.loungeId,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      numGuests: Number(form.numGuests),
      specialRequests: form.specialRequests || undefined,
    });
    if ("code" in res) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setBookings((previous) => [res.data, ...previous]);
      setForm({
        loungeId: "",
        startTime: "",
        endTime: "",
        numGuests: "1",
        specialRequests: "",
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Réservations VIP Lounge</h1>
        <p className="text-muted-foreground">
          Créez une réservation et suivez vos demandes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loungeId">Salon</Label>
              <select
                id="loungeId"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.loungeId}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    loungeId: event.target.value,
                  }))
                }
                required
              >
                <option value="">Sélectionner un salon</option>
                {lounges.map((lounge) => (
                  <option key={lounge.id} value={lounge.id}>
                    {lounge.name} - {lounge.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numGuests">Nombre d'invités</Label>
              <Input
                id="numGuests"
                type="number"
                min={1}
                value={form.numGuests}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    numGuests: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Début</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    startTime: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    endTime: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialRequests">Demandes spéciales</Label>
              <Input
                id="specialRequests"
                value={form.specialRequests}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    specialRequests: event.target.value,
                  }))
                }
                placeholder="Ex: service restauration, écran, protocole..."
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Créer la réservation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes réservations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Chargement...</div>
          ) : bookings.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aucune réservation disponible.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Invités</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.lounge?.name ?? "-"}</TableCell>
                    <TableCell>{new Date(booking.startTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(booking.endTime).toLocaleString()}</TableCell>
                    <TableCell>{booking.numGuests}</TableCell>
                    <TableCell>{booking.totalAmount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
