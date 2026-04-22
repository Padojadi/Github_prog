"use client";

import {
  BarChart3,
  Clock3,
  Percent,
  ScrollText,
  Smile,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetVisaKpis } from "@/features/visa/hooks/use-visa";

export default function VisaStatisticsPage() {
  const { data } = useGetVisaKpis();

  const kpis = useMemo(() => {
    if (!data || "code" in data) {
      return null;
    }
    return data.data;
  }, [data]);

  const kpiCards = [
    {
      title: "Temps de traitement moyen",
      value: `${kpis?.avgProcessingHours ?? 0} h`,
      icon: Clock3,
      description: "Durée moyenne entre soumission et décision",
    },
    {
      title: "Taux de rejet",
      value: `${kpis?.rejectionRate ?? 0}%`,
      icon: Percent,
      description: "Part des demandes rejetées",
    },
    {
      title: "Nombre de visas délivrés",
      value: `${kpis?.issued ?? 0}`,
      icon: ScrollText,
      description: "Visas effectivement émis",
    },
    {
      title: "Satisfaction usagers",
      value: `${kpis?.deliveryRate ?? 0}%`,
      icon: Smile,
      description: "Taux de délivrance des visas",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Statistiques et KPI</h1>
        <p className="text-sm text-muted-foreground">
          Suivi des indicateurs de performance du module Visa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm inline-flex items-center gap-2">
                <kpi.icon className="h-4 w-4" />
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyse avancée
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Cette section est prête pour brancher les graphiques détaillés
            (évolution, segmentation, comparaison périodique).
          </p>
          <p className="inline-flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Le branchement aux données temps réel sera fait lors de l'implémentation du backend Visa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
