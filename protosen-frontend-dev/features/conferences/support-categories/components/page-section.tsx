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
import { SupportCategoryForm } from "@/features/conferences/support-categories/components/support-category-form";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import { useGetSupportCategories } from "../hooks/use-get-support-categories";

export default function SupportCategoriesSection() {
  const { data, isLoading, error, refetch } = useGetSupportCategories();
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
          Ajouter une nouvelle catégorie de prise en charge
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
            title="Catégories de prise en charge"
            dataName="catégories de prise en charge"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Ajouter une nouvelle catégorie de prise en charge
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <SupportCategoryForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
