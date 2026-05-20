"use client";

import {
	getVisaStatusLabel,
	workflowStatusBadgeMap,
} from "@/features/visas/hooks/use-visa-workflow";
import type { VisaWorkflowStatus } from "@/features/visas/lib/workflow-types";

export default function WorkflowStatusBadge({
	status,
}: {
	status: VisaWorkflowStatus;
}) {
	return (
		<span
			className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${workflowStatusBadgeMap[status]}`}
		>
			{getVisaStatusLabel(status)}
		</span>
	);
}
