import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflowSteps = [
  "Soumission demande",
  "Vérification automatique",
  "Validation DPCT",
  "Notification",
  "Émission visa",
  "Retrait",
];

export default function VisasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visa - Structure TDR</h1>
        <p className="text-sm text-muted-foreground">
          Rubriques et formulaires du menu Visa alignes sur le TDR.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Link href="/panel/visas/dashboard">
          <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <CardHeader>
              <CardTitle>Tableau de bord</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              KPI et suivi global des visas.
            </CardContent>
          </Card>
        </Link>

        <Link href="/panel/visas/functionalities">
          <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <CardHeader>
              <CardTitle>Fonctionnalites cles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Couvre les capacites metier definies dans le TDR.
            </CardContent>
          </Card>
        </Link>

        <Link href="/panel/visas/workflow">
          <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Enchainement de la soumission au retrait.
            </CardContent>
          </Card>
        </Link>

        <Link href="/panel/visas/forms">
          <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <CardHeader>
              <CardTitle>Formulaires</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Demande de visa, validation et retrait.
            </CardContent>
          </Card>
        </Link>

        <Link href="/panel/visas/kpi">
          <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <CardHeader>
              <CardTitle>Indicateurs KPI</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Temps de traitement, rejet, delivrance, satisfaction.
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow du module Visa</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
