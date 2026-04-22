import Tooltip from "@/components/tooltip";
import { translateConferenceStatus } from "../../lib/utils";
import type { TConferenceStatus } from "../../types";

export default function StatusBadge({
	status,
	rejectReason,
}: {
	status: TConferenceStatus;
	rejectReason?: string | null;
}) {
	if (status === "REJECTED" || status === "REJECTED_PERMANENTLY") {
		return (
			<div className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
				<span>{translateConferenceStatus(status)}</span>
				{rejectReason && (
					<Tooltip size="md" bg="light">
						<p className="text-xs">{rejectReason}</p>
					</Tooltip>
				)}
			</div>
		);
	}
	return (
		<span
			className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
				status === "PENDING"
					? "bg-yellow-100 text-yellow-800"
					: status === "PUBLISHED"
						? "bg-orange-100 text-orange-800"
						: status === "CONFIRMED"
							? "bg-green-100 text-green-800"
							: status === "VALIDATED"
								? "bg-emerald-100 text-emerald-800"
								: status === "ACCEPTED"
									? "bg-blue-100 text-blue-800"
									: status === "REJECTED" || status === "REJECTED_PERMANENTLY"
										? "bg-red-100 text-red-800"
										: "bg-indigo-100 text-indigo-800"
			}`}
		>
			{translateConferenceStatus(status)}
		</span>
	);
}
