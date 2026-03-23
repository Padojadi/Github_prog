"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVipAccessRequestClient } from "@/features/vip-lounge/lib/apis-client";

export default function VipAccessRequestPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      function: String(formData.get("function") || ""),
      phone: String(formData.get("phone") || ""),
      organization: String(formData.get("organization") || ""),
      nationality: String(formData.get("nationality") || ""),
      passportType: String(formData.get("passportType") || ""),
      passportNumber: String(formData.get("passportNumber") || ""),
      travelPurpose: String(formData.get("travelPurpose") || ""),
      airline: String(formData.get("airline") || ""),
      flightNumber: String(formData.get("flightNumber") || ""),
      flightOrigin: String(formData.get("flightOrigin") || ""),
      flightArrivalTime: String(formData.get("flightArrivalTime") || ""),
      startTime: String(formData.get("startTime") || ""),
      endTime: String(formData.get("endTime") || ""),
      specialRequests: String(formData.get("specialRequests") || ""),
    };

    setLoading(true);
    const result = await createVipAccessRequestClient(payload);
    setLoading(false);

    if ("data" in result) {
      toast.success("Demande d'accès envoyée avec succès.");
      form.reset();
    } else {
      toast.error(result.message || "Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Demande d'accès VIP Lounge</h1>
        <p className="text-muted-foreground">
          Soumettez une demande d'accès complète (informations personnelles et vol).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire de demande</CardTitle>
          <CardDescription>
            Les champs marqués sont nécessaires au traitement protocolaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="function">Fonction</Label>
              <Input id="function" name="function" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organisation</Label>
              <Input id="organization" name="organization" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalité</Label>
              <Input id="nationality" name="nationality" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportType">Type passeport</Label>
              <Input id="passportType" name="passportType" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Numéro passeport</Label>
              <Input id="passportNumber" name="passportNumber" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airline">Compagnie aérienne</Label>
              <Input id="airline" name="airline" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flightNumber">Numéro de vol</Label>
              <Input id="flightNumber" name="flightNumber" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flightOrigin">Provenance du vol</Label>
              <Input id="flightOrigin" name="flightOrigin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flightArrivalTime">Arrivée vol (ISO)</Label>
              <Input
                id="flightArrivalTime"
                name="flightArrivalTime"
                placeholder="2026-03-26T09:30:00.000Z"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Début d'accès (ISO)</Label>
              <Input
                id="startTime"
                name="startTime"
                required
                placeholder="2026-03-26T10:00:00.000Z"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fin d'accès (ISO)</Label>
              <Input
                id="endTime"
                name="endTime"
                required
                placeholder="2026-03-26T12:00:00.000Z"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="travelPurpose">Objet du déplacement</Label>
              <Input id="travelPurpose" name="travelPurpose" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialRequests">Demandes spéciales</Label>
              <Textarea id="specialRequests" name="specialRequests" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Envoi en cours..." : "Envoyer la demande"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
