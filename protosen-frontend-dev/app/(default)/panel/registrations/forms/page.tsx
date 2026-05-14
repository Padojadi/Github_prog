import Link from "next/link";
import { registrationForms } from "@/features/registrations/lib/tdr";

export default function RegistrationsFormsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
					Immatriculations - Formulaires
				</h1>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
					Formulaires requis par le TDR pour la gestion des numéros et permis.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{registrationForms.map((item) => (
					<Link
						key={item.key}
						href={`/panel/registrations/forms/${item.key}`}
						className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
							{item.title}
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							{item.description}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
