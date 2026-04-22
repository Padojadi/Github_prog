"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  autoVerifyVisaRequestClient,
  issueVisaRequestClient,
  notifyVisaRequestClient,
} from "@/features/visa/lib/apis-client";
import { useGetVisaKpis, useGetVisaRequests } from "@/features/visa/hooks/use-visa";
import {
  getVisaStatusBadgeClass,
  getVisaStatusLabel,
  type VisaWorkflowStatus,
} from "@/features/visa/types";

const STATUS_OPTIONS: Array<{ value: "ALL" | VisaWorkflowStatus; label: string }> = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "SUBMITTED", label: "Soumise" },
  { value: "AUTO_VERIFIED", label: "Vérifiée auto" },
  { value: "VALIDATED", label: "Validée" },
  { value: "REJECTED", label: "Rejetée" },
  { value: "NOTIFIED", label: "Notifiée" },
  { value: "ISSUED", label: "Émise" },
  { value: "WITHDRAWN", label: "Retirée" },
];

export default function VisaRequestsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | VisaWorkflowStatus>("ALL");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const limit = 12;

  const { data, isLoading, isFetching, refetch } = useGetVisaRequests(
    page,
    limit,
    search,
    statusFilter === "ALL" ? undefined : statusFilter,
  );
  const { data: kpiData } = useGetVisaKpis();
  const highlightDossier = searchParams.get("dossier");

  const visaRows = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return [];
    }
    return data.data.data;
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data || "code" in data || "code" in data.data) {
      return 1;
    }
    return Math.max(1, data.data.totalPages);
  }, [data]);

  const kpis = useMemo(() => {
    if (!kpiData || "code" in kpiData || "code" in kpiData.data) {
      return null;
    }
    return kpiData.data;
  }, [kpiData]);

  const runAutoVerify = async (id: string) => {
    setBusyId(id);
    const response = await autoVerifyVisaRequestClient(id);
    setBusyId(null);
    if ("code" in response) {
      toast.error(response.message || "Erreur lors de la vérification automatique.");
      return;
    }
    toast.success("Vérification automatique effectuée.");
    await refetch();
  };

  const runNotify = async (id: string, dossierNumber: string) => {
    setBusyId(id);
    const response = await notifyVisaRequestClient(id, { dossierNumber });
    setBusyId(null);
    if ("code" in response) {
      toast.error(response.message || "Erreur lors de la notification.");
      return;
    }
    toast.success("Notification enregistrée.");
    await refetch();
  };

  const runIssue = async (id: string, dossierNumber: string) => {
    setBusyId(id);
    const response = await issueVisaRequestClient(id, { dossierNumber });
    setBusyId(null);
    if ("code" in response) {
      toast.error(response.message || "Erreur lors de l'émission.");
      return;
    }
    toast.success(`Visa émis (${response.data.visaNumber || "numéro généré"}).`);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Demandes de visa</h1>
          <p className="text-sm text-muted-foreground">
            Gestion opérationnelle: soumission, vérification, validation, notification, émission, retrait.
          </p>
        </div>
        <Button asChild>
          <Link href="/panel/visas/requests/new">Nouvelle demande</Link>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{kpis?.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Émis</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{kpis?.issued ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Retirés</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{kpis?.withdrawn ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux rejet</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {kpis?.rejectionRate ?? 0}%
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <Input
            placeholder="Rechercher dossier, passeport, nom..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "ALL" | VisaWorkflowStatus);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Chargement des demandes...
          </CardContent>
        </Card>
      ) : visaRows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune demande de visa trouvée.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visaRows.map((row) => (
            <Card key={row.id} className={highlightDossier === row.dossierNumber ? "border-blue-500" : ""}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {row.dossierNumber}{" "}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${getVisaStatusBadgeClass(
                          row.currentStatus,
                        )}`}
                      >
                        {getVisaStatusLabel(row.currentStatus)}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {row.lastName} {row.firstName} - Passeport: {row.passportNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Créé le{" "}
                      {format(new Date(row.createdAt), "dd MMM yyyy HH:mm", { locale: fr })} - Visa:{" "}
                      {row.visaNumber || "Non émis"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {row.currentStatus === "SUBMITTED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runAutoVerify(row.id)}
                        disabled={busyId === row.id}
                      >
                        Vérif auto
                      </Button>
                    ) : null}

                    {(row.currentStatus === "VALIDATED" || row.currentStatus === "REJECTED") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runNotify(row.id, row.dossierNumber)}
                        disabled={busyId === row.id}
                      >
                        Notifier
                      </Button>
                    )}

                    {(row.currentStatus === "VALIDATED" || row.currentStatus === "NOTIFIED") && (
                      <Button
                        size="sm"
                        onClick={() => runIssue(row.id, row.dossierNumber)}
                        disabled={busyId === row.id}
                      >
                        Émettre
                      </Button>
                    )}

                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/panel/visas/validation?dossier=${row.dossierNumber}`}>
                        Valider
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isFetching}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isFetching}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
