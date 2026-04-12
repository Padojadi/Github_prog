"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetLounges } from "@/features/honor-lounge/hooks/use-get-lounges";
import { createLoungeBooking } from "@/features/honor-lounge/lib/apis";
import type { Lounge } from "@/features/honor-lounge/types";

export default function NewHonorLoungeBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLoungeId = searchParams.get("loungeId") || "";
  const { data, isLoading } = useGetLounges(1, 100, "", "ACTIVE");

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    loungeId: selectedLoungeId,
    startTime: "",
    endTime: "",
    numGuests: "1",
    specialRequests: "",
    guestFirstName: "",
    guestLastName: "",
    guestFunction: "",
    guestOrganization: "",
    guestPhone: "",
    guestNationality: "",
  });

  const lounges = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [] as Lounge[];
    }
    return data.data.data;
  }, [data]);
  const currentLounge = useMemo(
    () => lounges.find((l) => l.id === formData.loungeId),
    [lounges, formData.loungeId],
  );

  const estimatedAmount = useMemo(() => {
    if (!currentLounge || !formData.startTime || !formData.endTime) return 0;
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const hours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return Number((hours * Number(currentLounge.hourlyRate)).toFixed(2));
  }, [currentLounge, formData.startTime, formData.endTime]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.loungeId) {
      toast.error("Veuillez sélectionner un salon.");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      toast.error("Veuillez choisir des horaires valides.");
      return;
    }

    setSubmitting(true);
    const response = await createLoungeBooking(
      {
        loungeId: formData.loungeId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        numGuests: Number(formData.numGuests),
        specialRequests: formData.specialRequests || undefined,
        guestFirstName: formData.guestFirstName || undefined,
        guestLastName: formData.guestLastName || undefined,
        guestFunction: formData.guestFunction || undefined,
        guestOrganization: formData.guestOrganization || undefined,
        guestPhone: formData.guestPhone || undefined,
        guestNationality: formData.guestNationality || undefined,
      },
      "Erreur de création de la réservation",
      "Réservation créée avec succès",
    );

    setSubmitting(false);
    if ("code" in response) {
      toast.error(response.message || "Erreur lors de la création");
      return;
    }

    toast.success("Réservation créée avec succès");
    router.push("/panel/honor-lounge/bookings");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Nouvelle réservation</h1>
        <p className="text-sm text-muted-foreground">
          Créez une réservation dans le module Salon d&apos;honneur.
        </p>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        onSubmit={onSubmit}
      >
        <div className="space-y-4 rounded-lg border bg-card p-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Salon</label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={formData.loungeId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, loungeId: e.target.value }))
              }
              disabled={isLoading}
            >
              <option value="">Sélectionner un salon</option>
              {lounges.map((lounge) => (
                <option key={lounge.id} value={lounge.id}>
                  {lounge.name} - {lounge.location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Début</label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Fin</label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre d&apos;invités</label>
            <Input
              type="number"
              min={1}
              value={formData.numGuests}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, numGuests: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Prénom du visiteur"
              value={formData.guestFirstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestFirstName: e.target.value }))
              }
            />
            <Input
              placeholder="Nom du visiteur"
              value={formData.guestLastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestLastName: e.target.value }))
              }
            />
            <Input
              placeholder="Fonction"
              value={formData.guestFunction}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestFunction: e.target.value }))
              }
            />
            <Input
              placeholder="Organisation"
              value={formData.guestOrganization}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestOrganization: e.target.value }))
              }
            />
            <Input
              placeholder="Téléphone"
              value={formData.guestPhone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestPhone: e.target.value }))
              }
            />
            <Input
              placeholder="Nationalité"
              value={formData.guestNationality}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guestNationality: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Demandes spécifiques</label>
            <Textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Création..." : "Créer la réservation"}
            </Button>
            <Button variant="outline" type="button" asChild>
              <Link href="/panel/honor-lounge/bookings">Annuler</Link>
            </Button>
          </div>
        </div>

        <aside className="rounded-lg border bg-card p-4 space-y-4">
          <h2 className="font-semibold text-foreground">Récapitulatif</h2>
          {currentLounge ? (
            <>
              <p className="text-sm">{currentLounge.name}</p>
              <p className="text-xs text-muted-foreground">{currentLounge.location}</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> Capacité: {currentLounge.capacity}
                </p>
                <p className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Tarif/h: {currentLounge.hourlyRate} XOF
                </p>
                <p className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Estimation: {estimatedAmount} XOF
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sélectionnez un salon pour voir les informations.
            </p>
          )}
        </aside>
      </form>
    </div>
  );
}
