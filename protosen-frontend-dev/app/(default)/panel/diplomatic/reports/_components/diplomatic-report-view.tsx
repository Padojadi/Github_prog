import { DashboardReportActions } from "@/components/dashboard/report-export-actions";
import {
	DIPLOMATIC_REPORT_HEADERS,
	type DiplomaticReportRecord,
	recordsToReportSection,
} from "@/features/diplomatic-cards/lib/reporting";

type DiplomaticReportViewProps = {
	title: string;
	description: string;
	fileName: string;
	sectionTitle: string;
	records: DiplomaticReportRecord[];
};

export default function DiplomaticReportView({
	title,
	description,
	fileName,
	sectionTitle,
	records,
}: DiplomaticReportViewProps) {
	const section = recordsToReportSection(sectionTitle, records);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
						{title}
					</h1>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						{description}
					</p>
				</div>
				<DashboardReportActions
					title={`${title} - Rapport détaillé`}
					fileName={fileName}
					sections={[section]}
				/>
			</div>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
				<table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
					<thead className="bg-slate-50 dark:bg-slate-800">
						<tr>
							{DIPLOMATIC_REPORT_HEADERS.map((header) => (
								<th
									key={header}
									className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
						{records.length === 0 ? (
							<tr>
								<td
									className="px-3 py-4 text-center text-slate-500 dark:text-slate-400"
									colSpan={DIPLOMATIC_REPORT_HEADERS.length}
								>
									Aucune donnée disponible pour ce rapport.
								</td>
							</tr>
						) : (
							records.map((record, index) => (
								<tr key={`${record.numeroCarte}-${record.dateDemande}-${index}`}>
									<td className="px-3 py-2">{record.nom}</td>
									<td className="px-3 py-2">{record.prenoms}</td>
									<td className="px-3 py-2">{record.telephone}</td>
									<td className="px-3 py-2">{record.numeroCarte}</td>
									<td className="px-3 py-2">{record.dateDemande}</td>
									<td className="px-3 py-2">{record.dateImpressionCarte}</td>
									<td className="px-3 py-2">{record.fonctionTitulaire}</td>
									<td className="px-3 py-2">{record.etatDemande}</td>
									<td className="px-3 py-2">{record.institutionTitulaire}</td>
									<td className="px-3 py-2">{record.fonctionDemandeur}</td>
									<td className="px-3 py-2">{record.dateExpirationCarte}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
