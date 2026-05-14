import { exonerationKeyFeatures } from "@/features/exonerations/lib/tdr";

export default function ExonerationsFunctionalitiesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Exonérations - Fonctionnalités clés
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Capacités fonctionnelles prévues par le TDR des titres d'exonération.
				</p>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
				<ul className="space-y-3">
					{exonerationKeyFeatures.map((feature) => (
						<li key={feature} className="flex items-start gap-3 text-sm">
							<span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
							<span className="text-slate-700 dark:text-slate-200">{feature}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
