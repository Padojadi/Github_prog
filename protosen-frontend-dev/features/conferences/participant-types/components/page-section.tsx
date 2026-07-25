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
import { ParticipantTypeForm } from "@/features/conferences/participant-types/components/participant-type-form";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import { useGetParticipantTypes } from "../hooks/use-get-participant-types";

export default function ParticipantTypesSection() {
  const { data, isLoading, error, refetch } = useGetParticipantTypes();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = useCurrentUser();

  const canCreate = hasPermission(currentUser.accessGroup?.permissions || [], [
    "MANAGE_CONFERENCES",
  ]);

  return (
    <div className="p-4 mx-auto">
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
          disabled={!canCreate}
        >
          <Plus className="size-4 mr-2" />
          Ajouter un nouveau type de participant
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
            title="Types de participants"
            dataName="types de participants"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Ajouter un nouveau type de participant
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <ParticipantTypeForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
