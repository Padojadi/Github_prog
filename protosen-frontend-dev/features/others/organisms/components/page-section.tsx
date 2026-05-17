"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "../../components/data-table";
import { Organism } from "../types";
import { OrganismForm } from "./organism-form";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGetOrganism } from "../hooks/use-get-organisms";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";

export default function OrganismsSection() {
  const { data, isLoading, error, refetch } = useGetOrganism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = useCurrentUser();
  const organisms = Array.isArray(data?.data) ? data.data : [];
  const reportSections = [
    {
      title: "Rapport des institutions",
      headers: ["Nom", "Code", "Type", "Service", "Statut", "Créé le"],
      rows: organisms.map((item) => [
        item.libelle,
        item.code,
        item.institutionType,
        item.service,
        item.status,
        item.createdAt,
      ]),
    },
  ];

  return (
    <div className="p-4 mx-auto">
      <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
        <DashboardReportActions
          title="Institutions - Rapport"
          fileName="rapport-institutions"
          sections={reportSections}
        />
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={!currentUser.isSuperAdmin}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <Plus className="size-4 mr-2" />
          Ajouter une nouvelle institution
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorComponent error={error} retry={refetch} />
      ) : (
        data && (
          <DataTable
            data={data.data!}
            columns={columns}
            title="Institutions"
            dataName="institutions"
          />
        )
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle institution</DialogTitle>
          </DialogHeader>
          <OrganismForm onClose={() => setIsAddModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
