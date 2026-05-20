"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TableSkeleton from "@/components/table-skeleton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { columns } from "./columns";
import { hasPermission } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useDebounce } from "@/hooks/use-debounce";
import RegistrationFilters from "./filters-dropdown";
import { useGetConferenceRegistrations } from "../../hooks/use-get-registrations";
import NewDataTable from "./data-table";
import { Input } from "@/components/ui/input";
import {
  TabsContentNew,
  TabsListNew,
  TabsNew,
  TabsTriggerNew,
} from "@/components/ui/tabs-new";
import { RegistrationProcessingTab } from "./registrations-processing-tab";
import { PaymentPendingTab } from "./payment-pending-tab";
import { PaidTab } from "./paid-tab";
import { RejectedTab } from "./rejected-tab";
import { CancelledTab } from "./cancelled-tab";
import { exportParticipantsToCSV } from "../../lib/export-csv";
import type { ConferenceRegistration } from "../../types";

export default function ConferenceRegistationsSection({
  conferenceId,
}: {
  conferenceId: string;
}) {
  const { data, isLoading, error, refetch } =
    useGetConferenceRegistrations(conferenceId);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useQueryState("search");
  const [inputValue, setInputValue] = useState("");

  const debouncedValue = useDebounce(inputValue);

  const canView = hasPermission(currentUser.accessGroup?.permissions || [], [
    "MANAGE_CONFERENCES",
  ]);

  useEffect(() => {
    if (globalFilter) {
      setInputValue(globalFilter);
    }
  }, []);

  useEffect(() => {
    setGlobalFilter(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="p-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Liste des inscriptions
        </h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-2 md:mt-0"
        >
          Retour
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 text-foreground rounded-lg shadow-sm border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder="Rechercher dans toutes les colonnes"
              className="w-1/2 pl-10 pr-4 py-2 border bg-transparent rounded-md focus:outline-none focus:ring-2 focus:w-full focus:ring-primary/50 transition-all duration-300"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          {/* <RegistrationFilters /> */}
        </div>

        <TabsNew
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsListNew>
            <TabsTriggerNew value="all">Tout</TabsTriggerNew>
            <TabsTriggerNew value="processing">
              En cours de traitement
            </TabsTriggerNew>
            <TabsTriggerNew value="payment-pending">
              Paiement en attente
            </TabsTriggerNew>
            <TabsTriggerNew value="paid">Payés</TabsTriggerNew>
            <TabsTriggerNew value="rejected">Rejetés</TabsTriggerNew>
            <TabsTriggerNew value="cancelled">Annulés</TabsTriggerNew>
          </TabsListNew>
          <TabsContentNew value="all" className="mt-4">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <NewDataTable
                data={data?.data ?? []}
                columns={columns}
                dataName="inscriptions"
                onExport={(filtered) =>
                  exportParticipantsToCSV(
                    filtered as ConferenceRegistration[],
                    "participants-tous"
                  )
                }
              />
            )}
          </TabsContentNew>
          <TabsContentNew value="processing" className="mt-4">
            <RegistrationProcessingTab conferenceId={conferenceId} />
          </TabsContentNew>
          <TabsContentNew value="payment-pending" className="mt-4">
            <PaymentPendingTab conferenceId={conferenceId} />
          </TabsContentNew>
          <TabsContentNew value="paid" className="mt-4">
            <PaidTab conferenceId={conferenceId} />
          </TabsContentNew>
          <TabsContentNew value="rejected" className="mt-4">
            <RejectedTab conferenceId={conferenceId} />
          </TabsContentNew>
          <TabsContentNew value="cancelled" className="mt-4">
            <CancelledTab conferenceId={conferenceId} />
          </TabsContentNew>
        </TabsNew>
      </div>
    </div>
  );
}
