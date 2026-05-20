"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const parseReportDate = (value: string): Date | null => {
	const safeValue = value?.trim();
	if (!safeValue) {
		return null;
	}

	const frenchDateMatch = safeValue.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
	if (frenchDateMatch) {
		const day = Number(frenchDateMatch[1]);
		const month = Number(frenchDateMatch[2]) - 1;
		const parsedYear = Number(frenchDateMatch[3]);
		const year = parsedYear < 100 ? 2000 + parsedYear : parsedYear;
		const date = new Date(year, month, day);
		return Number.isNaN(date.getTime()) ? null : date;
	}

	const parsed = new Date(safeValue);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isNonEmptyString = (value: string | undefined): value is string =>
	Boolean(value && value.trim());

export default function DiplomaticReportView({
	title,
	description,
	fileName,
	sectionTitle,
	records,
}: DiplomaticReportViewProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const dateFrom = searchParams.get("dateFrom") ?? "";
	const dateTo = searchParams.get("dateTo") ?? "";
	const institutionFilter = searchParams.get("institution") ?? "all";
	const statusFilter = searchParams.get("status") ?? "all";

	const updateQueryParams = (updates: Record<string, string>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (!value || value === "all") {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});

		const nextQuery = params.toString();
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false,
		});
	};

	const institutionOptions = useMemo(() => {
		return Array.from(
			new Set(
				records
					.map((record) => record.institutionTitulaire?.trim())
					.filter(isNonEmptyString)
			)
		).sort((a, b) => a.localeCompare(b, "fr"));
	}, [records]);

	const statusOptions = useMemo(() => {
		return Array.from(
			new Set(
				records
					.map((record) => record.etatDemande?.trim())
					.filter(isNonEmptyString)
			)
		).sort((a, b) => a.localeCompare(b, "fr"));
	}, [records]);

	const filteredRecords = useMemo(() => {
		const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
		const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

		return records.filter((record) => {
			if (
				institutionFilter !== "all" &&
				record.institutionTitulaire !== institutionFilter
			) {
				return false;
			}

			if (statusFilter !== "all" && record.etatDemande !== statusFilter) {
				return false;
			}

			if (!fromDate && !toDate) {
				return true;
			}

			const recordDate = parseReportDate(record.dateDemande);
			if (!recordDate) {
				return false;
			}

			if (fromDate && recordDate < fromDate) {
				return false;
			}

			if (toDate && recordDate > toDate) {
				return false;
			}

			return true;
		});
	}, [records, dateFrom, dateTo, institutionFilter, statusFilter]);

	const section = useMemo(
		() => recordsToReportSection(sectionTitle, filteredRecords),
		[sectionTitle, filteredRecords]
	);

	const resetFilters = () => {
		updateQueryParams({
			dateFrom: "",
			dateTo: "",
			institution: "",
			status: "",
		});
	};

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

			<div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5 dark:border-slate-700 dark:bg-slate-900">
				<div>
					<label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Date (du)
					</label>
					<input
						type="date"
						value={dateFrom}
						onChange={(event) =>
							updateQueryParams({ dateFrom: event.target.value })
						}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Date (au)
					</label>
					<input
						type="date"
						value={dateTo}
						onChange={(event) => updateQueryParams({ dateTo: event.target.value })}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Institution
					</label>
					<select
						value={institutionFilter}
						onChange={(event) =>
							updateQueryParams({ institution: event.target.value })
						}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<option value="all">Toutes les institutions</option>
						{institutionOptions.map((institution) => (
							<option key={institution} value={institution}>
								{institution}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						Statut
					</label>
					<select
						value={statusFilter}
						onChange={(event) => updateQueryParams({ status: event.target.value })}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
					>
						<option value="all">Tous les statuts</option>
						{statusOptions.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-end gap-2">
					<button
						type="button"
						onClick={resetFilters}
						className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
					>
						Réinitialiser
					</button>
					<div className="ml-auto rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
						{filteredRecords.length} résultat(s)
					</div>
				</div>
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
						{filteredRecords.length === 0 ? (
							<tr>
								<td
									className="px-3 py-4 text-center text-slate-500 dark:text-slate-400"
									colSpan={DIPLOMATIC_REPORT_HEADERS.length}
								>
									Aucune donnée ne correspond aux filtres appliqués.
								</td>
							</tr>
						) : (
							filteredRecords.map((record, index) => (
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
