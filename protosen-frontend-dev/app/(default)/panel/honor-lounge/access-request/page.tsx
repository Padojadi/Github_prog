"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLoungeBooking } from "@/features/honor-lounge/lib/apis";
import type { LoungeCompanion } from "@/features/honor-lounge/types";
import { useGetLounges } from "@/features/honor-lounge/hooks/use-get-lounges";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";

export default function HonorLoungeAccessRequestPage() {
  const currentUser = useCurrentUser();
  const [submitting, setSubmitting] = useState(false);
  const { data, isLoading } = useGetLounges(1, 100, "", "ACTIVE");
  const [companions, setCompanions] = useState<LoungeCompanion[]>([]);
  const [formData, setFormData] = useState({
    loungeId: "",
    startTime: "",
    endTime: "",
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
    numGuests: "1",
    specialRequests: "",
  });

  const lounges = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data;
  }, [data]);

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

  const updateCompanion = (index: number, key: keyof LoungeCompanion, value: string) => {
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
    if (!formData.loungeId || !formData.startTime || !formData.endTime) {
      toast.error("Veuillez renseigner le salon et les horaires.");
      return;
    }
    setSubmitting(true);
    const response = await createLoungeBooking(
      {
        loungeId: formData.loungeId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        numGuests: Number(formData.numGuests),
        specialRequests: [
          formData.specialRequests,
          formData.passportNumber ? `Passeport: ${formData.passportNumber}` : "",
          formData.travelPurpose ? `Motif: ${formData.travelPurpose}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
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
      "Erreur de création de la demande d'accès",
      "Demande d'accès envoyée avec succès",
    );
    setSubmitting(false);
    if ("code" in response) {
      toast.error(response.message || "Erreur lors de l'envoi");
      return;
    }
    toast.success("Demande d'accès envoyée avec succès");
    setFormData({
      loungeId: "",
      startTime: "",
      endTime: "",
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
      numGuests: "1",
      specialRequests: "",
    });
    setCompanions([]);
  };

  if (!canAccessLounge) {
    return (
      <div className="py-10">
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas les permissions pour soumettre une demande d&apos;accès.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demande d&apos;accès Salon d&apos;honneur</h1>
        <p className="text-sm text-muted-foreground">
          Formulaire protocolaire inspiré de 2ticglobal pour soumettre une demande.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={formData.loungeId}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, loungeId: event.target.value }))
            }
            disabled={isLoading}
            required
          >
            <option value="">Sélectionner un salon</option>
            {lounges.map((lounge) => (
              <option key={lounge.id} value={lounge.id}>
                {lounge.name} - {lounge.location}
              </option>
            ))}
          </select>
          <Input
            placeholder="Nombre d'invités"
            type="number"
            min={1}
            value={formData.numGuests}
            onChange={(event) => setFormData((prev) => ({ ...prev, numGuests: event.target.value }))}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="datetime-local"
            value={formData.startTime}
            onChange={(event) => setFormData((prev) => ({ ...prev, startTime: event.target.value }))}
            required
          />
          <Input
            type="datetime-local"
            value={formData.endTime}
            onChange={(event) => setFormData((prev) => ({ ...prev, endTime: event.target.value }))}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Prénom"
            value={formData.guestFirstName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, guestFirstName: event.target.value }))
            }
          />
          <Input
            placeholder="Nom"
            value={formData.guestLastName}
            onChange={(event) => setFormData((prev) => ({ ...prev, guestLastName: event.target.value }))}
          />
          <Input
            placeholder="Fonction"
            value={formData.guestFunction}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, guestFunction: event.target.value }))
            }
          />
          <Input
            placeholder="Organisation"
            value={formData.guestOrganization}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, guestOrganization: event.target.value }))
            }
          />
          <Input
            placeholder="Téléphone"
            value={formData.guestPhone}
            onChange={(event) => setFormData((prev) => ({ ...prev, guestPhone: event.target.value }))}
          />
          <Input
            placeholder="Nationalité"
            value={formData.guestNationality}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, guestNationality: event.target.value }))
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Numéro de passeport"
            value={formData.passportNumber}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, passportNumber: event.target.value }))
            }
          />
          <Input
            placeholder="Motif de voyage"
            value={formData.travelPurpose}
            onChange={(event) => setFormData((prev) => ({ ...prev, travelPurpose: event.target.value }))}
          />
          <Input
            placeholder="Compagnie aérienne"
            value={formData.airline}
            onChange={(event) => setFormData((prev) => ({ ...prev, airline: event.target.value }))}
          />
          <Input
            placeholder="Numéro de vol"
            value={formData.flightNumber}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, flightNumber: event.target.value }))
            }
          />
          <Input
            placeholder="Provenance du vol"
            value={formData.flightOrigin}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, flightOrigin: event.target.value }))
            }
          />
          <Input
            type="datetime-local"
            value={formData.flightArrivalTime}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, flightArrivalTime: event.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Accompagnants</p>
            <Button type="button" variant="outline" size="sm" onClick={addCompanion}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-3">
            {companions.map((companion, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-5">
                <Input
                  placeholder="Prénom"
                  value={companion.firstName}
                  onChange={(event) => updateCompanion(index, "firstName", event.target.value)}
                />
                <Input
                  placeholder="Nom"
                  value={companion.lastName}
                  onChange={(event) => updateCompanion(index, "lastName", event.target.value)}
                />
                <Input
                  placeholder="Lien"
                  value={companion.relation || ""}
                  onChange={(event) => updateCompanion(index, "relation", event.target.value)}
                />
                <Input
                  placeholder="Passeport"
                  value={companion.passportNumber || ""}
                  onChange={(event) =>
                    updateCompanion(index, "passportNumber", event.target.value)
                  }
                />
                <Button type="button" variant="ghost" onClick={() => removeCompanion(index)}>
                  Supprimer
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Demandes spécifiques"
          rows={4}
          value={formData.specialRequests}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, specialRequests: event.target.value }))
          }
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Envoi..." : "Soumettre la demande"}
        </Button>
      </form>
    </div>
  );
}
