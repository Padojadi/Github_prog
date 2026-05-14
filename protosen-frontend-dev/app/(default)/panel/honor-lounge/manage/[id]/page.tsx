"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteLoungeClient,
  getLoungeByIdClient,
  updateLoungeClient,
} from "@/features/honor-lounge/lib/apis-client";
import {
  AVAILABLE_AMENITIES,
  DAYS_OF_WEEK,
  LOUNGE_TYPES,
} from "@/features/honor-lounge/lib/constants";
import type { LoungeStatus } from "@/features/honor-lounge/types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";

type FormValues = {
  name: string;
  location: string;
  description: string;
  capacity: string;
  hourlyRate: string;
  status: LoungeStatus;
  loungeType: string;
  maxBookings: string;
  imageUrl: string;
  amenities: string[];
  availableDays: string[];
  timeSlots: Array<{ start: string; end: string }>;
};

export default function EditHonorLoungePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    location: "",
    description: "",
    capacity: "1",
    hourlyRate: "0",
    status: "ACTIVE",
    loungeType: LOUNGE_TYPES[0],
    maxBookings: "5",
    imageUrl: "",
    amenities: [],
    availableDays: [],
    timeSlots: [{ start: "09:00", end: "17:00" }],
  });

  useEffect(() => {
    const load = async () => {
      if (!params.id) return;
      const result = await getLoungeByIdClient(params.id);
      if ("code" in result || ("data" in result && "code" in (result as any).data)) {
        toast.error("Impossible de charger le salon.");
        setLoading(false);
        return;
      }
      const lounge = result.data;
      setFormData({
        name: lounge.name,
        location: lounge.location,
        description: lounge.description || "",
        capacity: String(lounge.capacity),
        hourlyRate: String(lounge.hourlyRate),
        status: lounge.status,
        loungeType: lounge.loungeType || LOUNGE_TYPES[0],
        maxBookings: String(lounge.maxBookings || 5),
        imageUrl: lounge.imageUrl || "",
        amenities: Array.isArray(lounge.amenities) ? lounge.amenities : [],
        availableDays: Array.isArray(lounge.availableDays) ? lounge.availableDays : [],
        timeSlots:
          Array.isArray(lounge.timeSlots) && lounge.timeSlots.length > 0
            ? lounge.timeSlots
            : [{ start: "09:00", end: "17:00" }],
      });
      setLoading(false);
    };

    load();
  }, [params.id]);

  const canSubmit = useMemo(
    () => formData.name.trim() && formData.location.trim() && formData.availableDays.length > 0,
    [formData],
  );
  const canManageLounges =
    currentUser?.isAdmin ||
    currentUser?.isSuperAdmin ||
    hasPermission(currentUser?.accessGroup?.permissions || [], ["MANAGE_CONFERENCES"]);

  const toggleValueInArray = (field: "amenities" | "availableDays", value: string) => {
    setFormData((prev) => {
      const has = prev[field].includes(value);
      return {
        ...prev,
        [field]: has ? prev[field].filter((item) => item !== value) : [...prev[field], value],
      };
    });
  };

  const updateTimeSlot = (index: number, field: "start" | "end", value: string) => {
    setFormData((prev) => {
      const timeSlots = [...prev.timeSlots];
      timeSlots[index] = {
        ...timeSlots[index],
        [field]: value,
      };
      return { ...prev, timeSlots };
    });
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { start: "09:00", end: "17:00" }],
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots:
        prev.timeSlots.length === 1
          ? prev.timeSlots
          : prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Renseignez les champs obligatoires et au moins un jour.");
      return;
    }

    setSubmitting(true);
    const res = await updateLoungeClient(params.id, {
      name: formData.name,
      location: formData.location,
      description: formData.description || undefined,
      capacity: Number(formData.capacity),
      hourlyRate: Number(formData.hourlyRate),
      status: formData.status,
      loungeType: formData.loungeType,
      maxBookings: Number(formData.maxBookings),
      imageUrl: formData.imageUrl || undefined,
      amenities: formData.amenities,
      availableDays: formData.availableDays,
      timeSlots: formData.timeSlots,
    });
    if ("code" in res || ("data" in res && "code" in (res as any).data)) {
      toast.error((res as any).message || "Erreur lors de la mise à jour du salon");
      setSubmitting(false);
      return;
    }
    toast.success("Salon mis à jour avec succès.");
    setSubmitting(false);
    router.push("/panel/honor-lounge/manage");
    router.refresh();
  };

  const onDelete = async () => {
    if (!confirm("Confirmer la suppression de ce salon ?")) return;
    setDeleting(true);
    const res = await deleteLoungeClient(params.id);
    if ("code" in res || ("data" in res && "code" in (res as any).data)) {
      toast.error((res as any).message || "Erreur lors de la suppression du salon");
      setDeleting(false);
      return;
    }
    toast.success(res.message || "Salon supprimé.");
    setDeleting(false);
    router.push("/panel/honor-lounge/manage");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!canManageLounges) {
    return (
      <div className="py-10">
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas les permissions pour modifier un salon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-2 px-0">
            <Link href="/panel/honor-lounge/manage">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la gestion
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Modifier le salon</h1>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={deleting || submitting}
        >
          {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Supprimer
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Nom du salon"
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
          <Input
            placeholder="Localisation"
            value={formData.location}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, location: event.target.value }))
            }
            required
          />
        </div>
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
          rows={4}
        />
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            type="number"
            min={1}
            placeholder="Capacité"
            value={formData.capacity}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, capacity: event.target.value }))
            }
            required
          />
          <Input
            type="number"
            min={1}
            placeholder="Max réservations/jour"
            value={formData.maxBookings}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, maxBookings: event.target.value }))
            }
            required
          />
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Tarif horaire"
            value={formData.hourlyRate}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, hourlyRate: event.target.value }))
            }
            required
          />
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={formData.loungeType}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, loungeType: event.target.value }))
            }
          >
            {LOUNGE_TYPES.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Statut</label>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={formData.status}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                status: event.target.value as LoungeStatus,
              }))
            }
          >
            <option value="ACTIVE">Actif</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactif</option>
          </select>
        </div>
        <Input
          placeholder="URL image (optionnel)"
          value={formData.imageUrl}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, imageUrl: event.target.value }))
          }
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">Jours disponibles</p>
          <div className="grid gap-2 md:grid-cols-4">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day)}
                  onChange={() => toggleValueInArray("availableDays", day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Créneaux horaires</p>
            <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {formData.timeSlots.map((slot, index) => (
              <div key={`${slot.start}-${slot.end}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Input
                  type="time"
                  value={slot.start}
                  onChange={(event) => updateTimeSlot(index, "start", event.target.value)}
                />
                <Input
                  type="time"
                  value={slot.end}
                  onChange={(event) => updateTimeSlot(index, "end", event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={formData.timeSlots.length <= 1}
                  onClick={() => removeTimeSlot(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Services offerts</p>
          <div className="grid gap-2 md:grid-cols-3">
            {AVAILABLE_AMENITIES.map((amenity) => (
              <label key={amenity} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleValueInArray("amenities", amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={!canSubmit || submitting} className="w-full">
          {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
}
