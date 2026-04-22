"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [formValues, setFormValues] = useState<ValidationFormValues>(defaultFormValues);
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (key: keyof ValidationFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const isRejected = formValues.decision === "REJECT";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Formulaire Validation (TDR)</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Button type="submit">Enregistrer validation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {submitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu de la validation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
