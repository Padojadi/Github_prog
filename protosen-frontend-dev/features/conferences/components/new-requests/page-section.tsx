"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import ErrorComponent from "@/components/error";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/features/others/components/data-table";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import { useGetNewConferencesRequest } from "../../hooks/use-get-conferences";
import { columns } from "./columns";

export default function NewConferenceRequestSection() {
	const { data, isLoading, error, refetch } = useGetNewConferencesRequest();
	const currentUser = useCurrentUser();

	const canRequest = hasPermission(currentUser.accessGroup?.permissions || [], [
		"REQUEST_CONFERENCE",
	]);

	return (
		<div className="p-4 mx-auto">
			<div className="mb-5 flex justify-end">
				<Link href={canRequest ? "/panel/conferences/create" : "#"}>
					<Button variant="primary" disabled={!canRequest}>
						<Plus className="mr-2 h-4 w-4" />
						Nouvelle demande de conférence
					</Button>
				</Link>
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
						title="Demandes de conférences"
						dataName="demandes de conférences"
					/>
				)
			)}
		</div>
	);
}
