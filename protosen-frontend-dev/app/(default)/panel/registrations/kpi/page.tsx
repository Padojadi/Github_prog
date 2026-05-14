import { registrationKpiCards } from "@/features/registrations/lib/tdr";

export default function RegistrationsKpiPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Immatriculations - Indicateurs KPI
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Indicateurs clés du système d'immatriculation et permis.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{registrationKpiCards.map((kpi) => (
					<div
						key={kpi.label}
						className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
					>
						<p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
							{kpi.label}
						</p>
						<p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
							{kpi.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
