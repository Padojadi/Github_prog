"use client";

import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, FileCheck2, FileSearch, Plane, ShieldCheck, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetVisaKpis } from "@/features/visa/hooks/use-visa";

const workflowSteps = [
  {
    title: "Soumission demande",
    description: "Le demandeur soumet son dossier de visa en ligne.",
    icon: UploadCloud,
  },
  {
    title: "Vérification automatique",
    description: "Contrôles automatiques des champs et des pièces.",
    icon: FileSearch,
  },
  {
    title: "Validation DPCT",
    description: "Analyse DPI et décision de validation/rejet.",
    icon: ShieldCheck,
  },
  {
    title: "Notification",
    description: "Envoi d'information au demandeur (SMS/Email).",
    icon: Bell,
  },
  {
    title: "Émission visa",
    description: "Production du visa validé.",
    icon: FileCheck2,
  },
  {
    title: "Retrait",
    description: "Retrait électronique sécurisé du visa.",
    icon: CheckCircle2,
  },
];

export default function VisasDashboardPage() {
  const { data: kpiResponse } = useGetVisaKpis();
  const kpis =
    kpiResponse && !("code" in kpiResponse)
      ? kpiResponse.data
      : {
          submitted: 0,
          issued: 0,
          avgProcessingHours: 0,
          rejectionRate: 0,
        };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord - Visa</h1>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble du module Visa selon le TDR (workflow, KPI et formulaires).
          </p>
        </div>
        <Button asChild>
          <Link href="/panel/visas/requests/new">
            Nouvelle demande de visa
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nouvelles demandes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{kpis.submitted}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Visas délivrés</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{kpis.issued}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Temps de traitement (moy.)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {Number((kpis.avgProcessingHours ?? 0).toFixed(2))} h
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux de rejet</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {Number((kpis.rejectionRate ?? 0).toFixed(2))}%
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fonctionnalités clés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Demande en ligne avec upload de documents</p>
            <p>- Vérification automatique des données</p>
            <p>- Validation intelligente (algorithme + DPI)</p>
            <p>- Notifications SMS/Email</p>
            <p>- Alertes expiration et rejet</p>
            <p>- Retrait électronique sécurisé</p>
            <p>- Bordereaux de retrait automatisés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">KPI suivis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Temps de traitement</p>
            <p>- Taux de rejet</p>
            <p>- Nombre de visas délivrés</p>
            <p>- Satisfaction usagers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accès rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/panel/visas/requests/new">
                Formulaire demande
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/panel/visas/validation">
                Formulaire validation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/panel/visas/retrait">
                Formulaire retrait
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Workflow Visa (TDR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-md border p-3">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                    {step.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
