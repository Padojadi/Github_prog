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
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutionsR } from "@/lib/actions/diplomaticCards/other";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGetOrganism } from "../hooks/use-get-organisms";

export default function OrganismsSection() {
  const { data, isLoading, error, refetch } = useGetOrganism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = useCurrentUser();

  return (
    <div className="p-4 mx-auto">
      <div className="mb-5 flex justify-end">
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
