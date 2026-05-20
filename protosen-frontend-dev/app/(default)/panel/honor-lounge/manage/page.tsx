"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createLoungeClient,
  deleteLoungeClient,
} from "@/features/honor-lounge/lib/apis-client";
import type { LoungeStatus } from "@/features/honor-lounge/types";
import { toast } from "sonner";
import { useGetLounges } from "@/features/honor-lounge/hooks/use-get-lounges";
import {
  AVAILABLE_AMENITIES,
  DAYS_OF_WEEK,
  LOUNGE_TYPES,
} from "@/features/honor-lounge/lib/constants";
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

export default function HonorLoungeManagePage() {
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading, refetch } = useGetLounges(1, 100, "");
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

  const lounges = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data;
  }, [data]);
  const canManageLounges =
    currentUser?.isAdmin ||
    currentUser?.isSuperAdmin ||
    hasPermission(currentUser?.accessGroup?.permissions || [], ["MANAGE_CONFERENCES"]);

  if (!canManageLounges) {
    return (
      <div className="py-10">
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas les permissions pour gérer les salons.
        </p>
      </div>
    );
  }

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
    if (formData.availableDays.length === 0) {
      toast.error("Sélectionnez au moins un jour disponible.");
      return;
    }
    setLoading(true);

    const payload = {
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
    };

    const res = await createLoungeClient(payload);
    if ("code" in res || ("data" in res && "code" in (res as any).data)) {
      toast.error((res as any).message || "Erreur lors de la création");
      setLoading(false);
      return;
    }

    toast.success((res as any).message || "Salon créé avec succès");
    setFormData({
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
    setLoading(false);
    refetch();
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Confirmer la suppression de ce salon ?");
    if (!confirmed) return;
    setDeletingId(id);
    const res = await deleteLoungeClient(id);
    if ("code" in res || ("data" in res && "code" in (res as any).data)) {
      toast.error((res as any).message || "Erreur lors de la suppression du salon");
      setDeletingId(null);
      return;
    }
    toast.success(res.message || "Salon supprimé.");
    setDeletingId(null);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Gestion des salons</h1>
        <p className="text-sm text-muted-foreground">
          Ajouter et consulter les salons d&apos;honneur.
        </p>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          Créer le salon
        </Button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Salons existants</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement des salons...</p>
        ) : lounges.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun salon créé.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {lounges.map((lounge) => (
              <div key={lounge.id} className="border rounded-md p-3 space-y-2">
                <p className="font-medium">{lounge.name}</p>
                <p className="text-sm text-muted-foreground">
                  {lounge.location} — {lounge.capacity} places
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/panel/honor-lounge/manage/${lounge.id}`}>Modifier</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/panel/honor-lounge/${lounge.id}`}>Voir</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    disabled={deletingId === lounge.id}
                    onClick={() => onDelete(lounge.id)}
                  >
                    {deletingId === lounge.id ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
