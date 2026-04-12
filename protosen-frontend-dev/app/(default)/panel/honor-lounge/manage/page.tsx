"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLoungeClient } from "@/features/honor-lounge/lib/apis-client";
import type { LoungeStatus } from "@/features/honor-lounge/types";
import { toast } from "sonner";

type FormValues = {
  name: string;
  location: string;
  description: string;
  capacity: string;
  hourlyRate: string;
  status: LoungeStatus;
  amenities: string;
};

export default function HonorLoungeManagePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    location: "",
    description: "",
    capacity: "1",
    hourlyRate: "0",
    status: "ACTIVE",
    amenities: "",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      location: formData.location,
      description: formData.description || undefined,
      capacity: Number(formData.capacity),
      hourlyRate: Number(formData.hourlyRate),
      status: formData.status,
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
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
      amenities: "",
    });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestion des salons</h1>
        <p className="text-sm text-muted-foreground">
          Ajouter un nouveau salon d'honneur.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
          rows={4}
        />
        <div className="grid grid-cols-2 gap-4">
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
            min={0}
            step="0.01"
            placeholder="Tarif horaire"
            value={formData.hourlyRate}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, hourlyRate: event.target.value }))
            }
            required
          />
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
          placeholder="Équipements (séparés par des virgules)"
          value={formData.amenities}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, amenities: event.target.value }))
          }
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          Créer le salon
        </Button>
      </form>
    </div>
  );
}
