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
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAccessRoles } from "../lib/apis";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { AccessRoleForm } from "./access-role-form";

export default function AccessRoleSection() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["access-roles"],
    queryFn: () => getAccessRoles(),
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
          Ajouter un nouveau groupe d&apos;accès
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
            title="Groupes d'accès"
            dataName="groupes d'accès"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent className="lg:max-w-3xl">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Ajouter un nouveau groupe d&apos;accès
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <AccessRoleForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
