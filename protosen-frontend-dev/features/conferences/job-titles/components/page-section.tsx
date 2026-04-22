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
import { JobTitleForm } from "@/features/conferences/job-titles/components/job-title-form";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/components/table-skeleton";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { getJobTitles } from "../lib/apis-client";
import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";
import { useGetJobTitles } from "../hooks/use-get-job-titles";

export default function JobTitlesSection() {
  const { data, isLoading, error, refetch } = useGetJobTitles();
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
          Ajouter une nouvelle fonction
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
            title="Fonctions"
            dataName="fonctions"
          />
        )
      )}

      <ResponsiveModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Ajouter une nouvelle fonction
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <JobTitleForm onClose={() => setIsAddModalOpen(false)} />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}
