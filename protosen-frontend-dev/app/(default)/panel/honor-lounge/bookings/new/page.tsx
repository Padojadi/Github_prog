"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetLounges } from "@/features/honor-lounge/hooks/use-get-lounges";
import { createLoungeBooking } from "@/features/honor-lounge/lib/apis";
import type { Lounge, LoungeCompanion } from "@/features/honor-lounge/types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";

export default function NewHonorLoungeBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  const selectedLoungeId = searchParams.get("loungeId") || "";
  const { data, isLoading } = useGetLounges(1, 100, "", "ACTIVE");

  const [submitting, setSubmitting] = useState(false);
  const [companions, setCompanions] = useState<LoungeCompanion[]>([]);
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
    passportNumber: "",
    travelPurpose: "",
    airline: "",
    flightNumber: "",
    flightOrigin: "",
    flightArrivalTime: "",
    paymentMethod: "ON_SITE" as "ON_SITE" | "ONLINE",
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
  const canAccessLounge =
    currentUser?.isAdmin ||
    currentUser?.isSuperAdmin ||
    hasPermission(currentUser?.accessGroup?.permissions || [], [
      "ACCESS_HONOR_LOUNGE_MODULE",
      "ACCESS_CONFERENCE_MODULE",
    ]);

  const addCompanion = () => {
    setCompanions((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        relation: "",
        passportNumber: "",
        nationality: "",
      },
    ]);
  };

  const updateCompanion = (
    index: number,
    key: keyof LoungeCompanion,
    value: string,
  ) => {
    setCompanions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const removeCompanion = (index: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

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
    const specialRequests = [
      formData.specialRequests,
      formData.passportNumber ? `Passeport: ${formData.passportNumber}` : "",
      formData.travelPurpose ? `Motif: ${formData.travelPurpose}` : "",
      companions.length > 0
        ? `Accompagnants: ${companions
            .map((item) =>
              [item.firstName, item.lastName, item.relation]
                .filter(Boolean)
                .join(" ")
                .trim(),
            )
            .filter(Boolean)
            .join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await createLoungeBooking(
      {
        loungeId: formData.loungeId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        numGuests: Number(formData.numGuests),
        specialRequests,
        paymentMethod: formData.paymentMethod,
        guestFirstName: formData.guestFirstName || undefined,
        guestLastName: formData.guestLastName || undefined,
        guestFunction: formData.guestFunction || undefined,
        guestOrganization: formData.guestOrganization || undefined,
        guestPhone: formData.guestPhone || undefined,
        guestNationality: formData.guestNationality || undefined,
        airline: formData.airline || undefined,
        flightNumber: formData.flightNumber || undefined,
        flightOrigin: formData.flightOrigin || undefined,
        flightArrivalTime: formData.flightArrivalTime || undefined,
        companions,
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

  if (!canAccessLounge) {
    return (
      <div className="py-10">
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas les permissions pour créer une réservation.
        </p>
      </div>
    );
  }

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

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Numéro de passeport"
              value={formData.passportNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, passportNumber: e.target.value }))
              }
            />
            <Input
              placeholder="Motif du voyage"
              value={formData.travelPurpose}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, travelPurpose: e.target.value }))
              }
            />
            <Input
              placeholder="Compagnie aérienne"
              value={formData.airline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, airline: e.target.value }))
              }
            />
            <Input
              placeholder="Numéro de vol"
              value={formData.flightNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, flightNumber: e.target.value }))
              }
            />
            <Input
              placeholder="Provenance du vol"
              value={formData.flightOrigin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, flightOrigin: e.target.value }))
              }
            />
            <Input
              type="datetime-local"
              value={formData.flightArrivalTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, flightArrivalTime: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mode de paiement</label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={formData.paymentMethod}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: event.target.value as "ON_SITE" | "ONLINE",
                }))
              }
            >
              <option value="ON_SITE">Paiement sur place</option>
              <option value="ONLINE">Paiement en ligne</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Accompagnants</label>
              <Button type="button" variant="outline" size="sm" onClick={addCompanion}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            {companions.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aucun accompagnant.</p>
            ) : (
              <div className="space-y-2">
                {companions.map((companion, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-5">
                    <Input
                      placeholder="Prénom"
                      value={companion.firstName}
                      onChange={(event) =>
                        updateCompanion(index, "firstName", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Nom"
                      value={companion.lastName}
                      onChange={(event) =>
                        updateCompanion(index, "lastName", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Relation"
                      value={companion.relation || ""}
                      onChange={(event) =>
                        updateCompanion(index, "relation", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Passeport"
                      value={companion.passportNumber || ""}
                      onChange={(event) =>
                        updateCompanion(index, "passportNumber", event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeCompanion(index)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
