"use client";

import {
	getRegistrationStatusLabel,
	registrationStatusBadgeMap,
} from "@/features/registrations/hooks/use-registration-workflow";
import type { RegistrationWorkflowStatus } from "@/features/registrations/lib/workflow-types";

export default function RegistrationWorkflowStatusBadge({
	status,
}: {
	status: RegistrationWorkflowStatus;
}) {
	return (
		<span
			className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${registrationStatusBadgeMap[status]}`}
		>
			{getRegistrationStatusLabel(status)}
		</span>
	);
}
