"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/features/others/components/data-table";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { CardTypeForm } from "@/features/others/type-of-cards/components/type-of-card-form";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCardTypes } from "../lib/apis";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function CardTypesSection() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["card-types"],
    queryFn: async () => {
      let response = await getCardTypes();
      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = useCurrentUser();

  return (
    <div className="p-4 mx-auto">
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
          disabled={!currentUser.isSuperAdmin}
        >
          <Plus className="size-4 mr-2" />
          Ajouter un nouveau type de carte
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorComponent error={error} retry={refetch} />
      ) : (
        data && (
          <DataTable
            data={data.data}
            columns={columns}
            title="Types de cartes"
            dataName="types de cartes"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Ajouter un nouveau type de carte
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <CardTypeForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
