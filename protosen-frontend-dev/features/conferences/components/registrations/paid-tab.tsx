import TableSkeleton from "@/components/table-skeleton";
import { useGetConferenceRegistrations } from "../../hooks/use-get-registrations";
import NewDataTable from "./data-table";
import { columns } from "./columns";
import { RegistrationStatus } from "../../lib/data";
import { exportParticipantsToCSV } from "../../lib/export-csv";
import type { ConferenceRegistration } from "../../types";

type PaidTabProps = {
  conferenceId: string;
};

export function PaidTab({ conferenceId }: PaidTabProps) {
  const { data, isLoading } = useGetConferenceRegistrations(
    conferenceId,
    RegistrationStatus.paid
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
              "participants-payes"
            )
          }
        />
      )}
    </>
  );
}
