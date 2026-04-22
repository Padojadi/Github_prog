"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGetVisaRequests } from "@/features/visa/hooks/use-visa";
import { validateVisaRequestClient } from "@/features/visa/lib/apis-client";

type ValidationFormValues = {
  dossierNumber: string;
  automaticScore: string;
  dpiAnalysis: string;
  decision: "APPROVE" | "REJECT";
  rejectionReason: string;
};

const defaultFormValues: ValidationFormValues = {
  dossierNumber: "",
  automaticScore: "",
  dpiAnalysis: "",
  decision: "APPROVE",
  rejectionReason: "",
};

export default function VisaValidationPage() {
  const searchParams = useSearchParams();
  const dossierFromUrl = searchParams.get("dossier") || "";
  const [search, setSearch] = useState("");
  const { data, refetch, isFetching } = useGetVisaRequests(1, 100, search);
  const [formValues, setFormValues] = useState<ValidationFormValues>(defaultFormValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dossierFromUrl) return;
    setFormValues((prev) => ({ ...prev, dossierNumber: dossierFromUrl }));
  }, [dossierFromUrl]);

  const updateForm = (key: keyof ValidationFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const visaRows = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data;
  }, [data]);

  const selectedVisa = useMemo(
    () => visaRows.find((row) => row.dossierNumber === formValues.dossierNumber),
    [visaRows, formValues.dossierNumber],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVisa) {
      toast.error("Veuillez sélectionner un dossier valide.");
      return;
    }

    setSubmitting(true);
    const response = await validateVisaRequestClient(selectedVisa.id, {
      dossierNumber: formValues.dossierNumber,
      automaticScore:
        formValues.automaticScore.trim() === ""
          ? undefined
          : Number(formValues.automaticScore),
      dpiAnalysis: formValues.dpiAnalysis,
      decision: formValues.decision,
      rejectionReason:
        formValues.decision === "REJECT"
          ? formValues.rejectionReason
          : undefined,
    });
    setSubmitting(false);

    if ("code" in response) {
      toast.error(response.message || "Erreur de validation.");
      return;
    }

    toast.success("Validation enregistrée avec succès.");
    await refetch();
    setFormValues(defaultFormValues);
  };

  const isRejected = formValues.decision === "REJECT";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Formulaire Validation (TDR)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Rechercher dossier / passeport / nom..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={formValues.dossierNumber}
              onChange={(event) =>
                updateForm("dossierNumber", event.target.value)
              }
            >
              <option value="">Sélectionner un dossier</option>
              {visaRows.map((row) => (
                <option key={row.id} value={row.dossierNumber}>
                  {row.dossierNumber} - {row.lastName} {row.firstName}
                </option>
              ))}
            </select>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="dossierNumber">Numéro dossier</Label>
              <Input
                id="dossierNumber"
                value={formValues.dossierNumber}
                onChange={(event) => updateForm("dossierNumber", event.target.value)}
                placeholder="Ex: DOS-2026-0001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="automaticScore">Score automatique</Label>
              <Input
                id="automaticScore"
                value={formValues.automaticScore}
                onChange={(event) => updateForm("automaticScore", event.target.value)}
                placeholder="Ex: 82/100"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dpiAnalysis">Analyse DPI</Label>
              <Textarea
                id="dpiAnalysis"
                value={formValues.dpiAnalysis}
                onChange={(event) => updateForm("dpiAnalysis", event.target.value)}
                placeholder="Synthèse d'analyse DPI"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Décision</Label>
              <div className="flex gap-6 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="decision"
                    value="APPROVE"
                    checked={formValues.decision === "APPROVE"}
                    onChange={(event) =>
                      updateForm("decision", event.target.value as "APPROVE" | "REJECT")
                    }
                  />
                  <span>Approuver</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="decision"
                    value="REJECT"
                    checked={formValues.decision === "REJECT"}
                    onChange={(event) =>
                      updateForm("decision", event.target.value as "APPROVE" | "REJECT")
                    }
                  />
                  <span>Rejeter</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="rejectionReason">Motif rejet</Label>
              <Textarea
                id="rejectionReason"
                value={formValues.rejectionReason}
                onChange={(event) => updateForm("rejectionReason", event.target.value)}
                placeholder="Obligatoire si décision = Rejeter"
                rows={3}
                disabled={!isRejected}
                required={isRejected}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting || isFetching}>
                {submitting ? "Validation..." : "Enregistrer validation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {selectedVisa ? (
        <Card>
          <CardHeader>
            <CardTitle>Demande sélectionnée</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(selectedVisa, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
