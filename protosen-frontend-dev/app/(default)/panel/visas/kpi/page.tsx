import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const kpiList = [
  "Temps de traitement",
  "Taux de rejet",
  "Nombre de visas delivres",
  "Satisfaction usagers",
];

export default function VisaKpiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Indicateurs KPI</h1>
          <p className="text-sm text-muted-foreground">
            Section KPI du TDR du module Visa.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/panel/visas/statistics">Ouvrir la vue statistiques</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des indicateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {kpiList.map((kpi) => (
              <li key={kpi}>{kpi}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
