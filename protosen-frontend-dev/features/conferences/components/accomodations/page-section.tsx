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

import { columns } from "./columns";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutionsR } from "@/lib/actions/diplomaticCards/other";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGetAccommodations } from "../../hooks/use-get-accommodations";
import { DataTable } from "@/features/others/components/data-table";
import { AccommodationForm } from "./accommodation-form";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { hasPermission } from "@/lib/utils";

export default function AccommodationsSection() {
  const { data, isLoading, error, refetch } = useGetAccommodations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = useCurrentUser();

  const canManageConf = hasPermission(
    currentUser?.accessGroup?.permissions ?? [],
    ["MANAGE_CONFERENCES"]
  );

  return (
    <div className="p-4 mx-auto">
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={!canManageConf}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <Plus className="size-4 mr-2" />
          Ajouter un nouvel hébergement
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorComponent error={error} retry={refetch} />
      ) : (
        data && (
          <DataTable
            data={data.data ? data.data : []}
            columns={columns}
            title="Hébergements"
            dataName="hébergements"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Nouvel hébergement</ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <AccommodationForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
