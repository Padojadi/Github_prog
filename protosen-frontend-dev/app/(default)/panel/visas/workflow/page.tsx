import { visaWorkflowSteps } from "@/features/visas/lib/tdr";

export default function VisaWorkflowPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Visa - Workflow
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Chaîne de traitement du visa de la soumission jusqu'au retrait.
				</p>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<ol className="space-y-4">
					{visaWorkflowSteps.map((step, index) => (
						<li key={step} className="flex items-center gap-3">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
								{index + 1}
							</div>
							<span className="text-sm text-slate-700 dark:text-slate-200">{step}</span>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
