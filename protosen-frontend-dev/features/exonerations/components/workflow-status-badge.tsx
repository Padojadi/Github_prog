"use client";

import {
	exonerationStatusBadgeMap,
	getExonerationStatusLabel,
} from "@/features/exonerations/hooks/use-exoneration-workflow";
import type { ExonerationWorkflowStatus } from "@/features/exonerations/lib/workflow-types";

export default function ExonerationWorkflowStatusBadge({
	status,
}: {
	status: ExonerationWorkflowStatus;
}) {
	return (
		<span
			className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${exonerationStatusBadgeMap[status]}`}
		>
			{getExonerationStatusLabel(status)}
		</span>
	);
}
