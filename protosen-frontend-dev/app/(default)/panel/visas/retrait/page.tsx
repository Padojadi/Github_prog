"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetVisaRequests } from "@/features/visa/hooks/use-visa";
import { withdrawVisaRequestClient } from "@/features/visa/lib/apis-client";

export default function VisaRetraitPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    visaNumber: "",
    collectorName: "",
    collectorIdentityDocument: "",
    collectorSignature: "",
    withdrawalDate: "",
  });

  const { data, isLoading, refetch } = useGetVisaRequests(1, 200, "", "ISSUED");

  const issuedRows = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data.filter((row) => row.currentStatus === "ISSUED");
  }, [data]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const selected = issuedRows.find((row) => row.visaNumber === form.visaNumber);
    if (!selected) {
      setSubmitting(false);
      toast.error("Veuillez sélectionner un visa émis valide.");
      return;
    }

    const response = await withdrawVisaRequestClient(selected.id, form);
    setSubmitting(false);

    if ("code" in response) {
      toast.error(response.message || "Erreur lors de l'enregistrement du retrait.");
      return;
    }

    toast.success("Retrait enregistré avec succès.");
    setForm({
      visaNumber: "",
      collectorName: "",
      collectorIdentityDocument: "",
      collectorSignature: "",
      withdrawalDate: "",
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Retrait électronique sécurisé</h1>
        <p className="text-sm text-muted-foreground">
          Formulaire de retrait connecté au backend Visa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire - Retrait</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visaNumber">Numero visa</Label>
                <select
                  id="visaNumber"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.visaNumber}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, visaNumber: event.target.value }))
                  }
                  required
                >
                  <option value="">
                    {isLoading ? "Chargement..." : "Selectionner un visa emis"}
                  </option>
                  {issuedRows.map((row) => (
                    <option key={row.id} value={row.visaNumber || ""}>
                      {(row.visaNumber || "Sans numero")} - {row.firstName} {row.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectorName">Nom collecteur</Label>
                <Input
                  id="collectorName"
                  value={form.collectorName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, collectorName: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectorIdentityDocument">Piece identite</Label>
                <Input
                  id="collectorIdentityDocument"
                  value={form.collectorIdentityDocument}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      collectorIdentityDocument: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawalDate">Date retrait</Label>
                <Input
                  id="withdrawalDate"
                  type="datetime-local"
                  value={form.withdrawalDate}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, withdrawalDate: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collectorSignature">Signature</Label>
              <Input
                id="collectorSignature"
                value={form.collectorSignature}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, collectorSignature: event.target.value }))
                }
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Valider le retrait"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
