import TableSkeleton from "@/components/table-skeleton";
import { useGetConferenceRegistrations } from "../../hooks/use-get-registrations";
import NewDataTable from "./data-table";
import { columns } from "./columns";
import { RegistrationStatus } from "../../lib/data";
import { exportParticipantsToCSV } from "../../lib/export-csv";
import type { ConferenceRegistration } from "../../types";

type RegistrationProcessingTabProps = {
  conferenceId: string;
};

export function RegistrationProcessingTab({
  conferenceId,
}: RegistrationProcessingTabProps) {
  const { data, isLoading } = useGetConferenceRegistrations(
    conferenceId,
    RegistrationStatus.processing
  );
  return (
    <>
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
              "participants-en-cours"
            )
          }
        />
      )}
    </>
  );
}
