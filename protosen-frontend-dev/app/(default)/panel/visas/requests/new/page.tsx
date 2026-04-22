"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVisaRequestClient } from "@/features/visa/lib/apis-client";

type VisaRequestForm = {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  passportNumber: string;
  visaType: string;
  documents: string;
};

const INITIAL_FORM: VisaRequestForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "",
  passportNumber: "",
  visaType: "",
  documents: "",
};

export default function NewVisaRequestPage() {
  const router = useRouter();
  const [form, setForm] = useState<VisaRequestForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: keyof VisaRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const response = await createVisaRequestClient({
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: new Date(form.birthDate).toISOString(),
      nationality: form.nationality,
      passportNumber: form.passportNumber,
      visaType: form.visaType,
      documents: form.documents,
    });

    setSubmitting(false);

    if ("code" in response) {
      toast.error(response.message || "Erreur lors de la soumission de la demande.");
      return;
    }

    toast.success(`Demande créée avec succès (${response.data.dossierNumber}).`);
    setForm(INITIAL_FORM);
    router.push("/panel/visas/requests");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nouvelle demande de visa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Formulaire – Demande de visa (TDR)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalité</Label>
              <Input
                id="nationality"
                value={form.nationality}
                onChange={(event) =>
                  updateField("nationality", event.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Numéro passeport</Label>
              <Input
                id="passportNumber"
                value={form.passportNumber}
                onChange={(event) =>
                  updateField("passportNumber", event.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visaType">Type de visa</Label>
              <Input
                id="visaType"
                value={form.visaType}
                onChange={(event) => updateField("visaType", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="documents">Documents à fournir</Label>
              <Input
                id="documents"
                placeholder="Ex: Passeport, photo, lettre d'invitation..."
                value={form.documents}
                onChange={(event) => updateField("documents", event.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Soumission..." : "Soumettre la demande"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
