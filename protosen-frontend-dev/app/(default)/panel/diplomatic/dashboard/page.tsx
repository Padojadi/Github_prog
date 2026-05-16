import SimpleTableComponent from "@/components/table/simpleTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	fetchStatsCards,
	fetchStatsCardsDuplicata,
	fetchStatsCardsRenew,
} from "@/lib/actions/diplomaticCards/holders";
import { DashboardReportActions } from "@/components/dashboard/report-export-actions";

export default async function DiplomaticDashboard() {
	const res = await fetchStatsCards();
	const resRenew = await fetchStatsCardsRenew();
	const resDuplicata = await fetchStatsCardsDuplicata();
	const data = Array.isArray(res?.data) ? res.data : [];
	const dataRenew = Array.isArray(resRenew?.data) ? resRenew.data : [];
	const dataDuplicata = Array.isArray(resDuplicata?.data) ? resDuplicata.data : [];

	const headers = [
		{ label: "Nom", code: "name" },
		{ label: "En attente", code: "pending" },
		{ label: "Confirmé", code: "confirmed" },
		{ label: "Accepté", code: "accepted" },
		{ label: "Rejeté", code: "rejected" },
		{ label: "Brouillon", code: "onHold" },
		{ label: "Total", code: "total" },
	];

	const sumTotal = (rows: any[]) =>
		rows.map((item) => Number(item?.total ?? 0)).reduce((a, b) => a + b, 0);

	const statsData = [
		{
			title: "Nouvelles Demandes",
			value: sumTotal(data),
			color: "bg-blue-600",
		},
		{
			title: "Renouvellement",
			value: sumTotal(dataRenew),
			color: "bg-green-600",
		},
		{
			title: "Duplicatas",
			value: sumTotal(dataDuplicata),
			color: "bg-yellow-400",
		},
		{
			title: "Cartes au total",
			value: sumTotal(data) + sumTotal(dataRenew) + sumTotal(dataDuplicata),
			color: "bg-orange-400",
		},
	];

	const getRowValue = (row: Record<string, unknown>, code: string): string | number => {
		if (code === "onHold") {
			const holdValue = row.onHold ?? row.onhold ?? 0;
			if (typeof holdValue === "number" || typeof holdValue === "string") {
				return holdValue;
			}
			return String(holdValue ?? "");
		}
		const value = row[code];
		if (typeof value === "number" || typeof value === "string") {
			return value;
		}
		return String(value ?? "");
	};

	const toSectionRows = (rows: any[]) =>
		rows.map((row) => headers.map((header) => getRowValue(row, header.code)));

	const reportSections = [
		{
			title: "Synthese globale",
			headers: ["Indicateur", "Valeur"],
			rows: statsData.map((stat) => [stat.title, stat.value]),
		},
		{
			title: "Statuts - Nouvelles demandes",
			headers: headers.map((header) => header.label),
			rows: toSectionRows(data),
		},
		{
			title: "Statuts - Renouvellements",
			headers: headers.map((header) => header.label),
			rows: toSectionRows(dataRenew),
		},
		{
			title: "Statuts - Duplicatas",
			headers: headers.map((header) => header.label),
			rows: toSectionRows(dataDuplicata),
		},
	];

	const CardStats = ({
		title,
		value,
		color,
	}: {
		title: string;
		value: number;
		color: string;
	}) => {
		return (
			<div className={`flex flex-col text-white p-4 ${color}`}>
				<span className="text-3xl font-bold">{value}</span>
				<span className="text-xl">{title}</span>
			</div>
		);
	};

	return (
		<>
			<div className="mb-4 flex justify-end">
				<DashboardReportActions
					title="Tableau de bord Cartes Diplomatiques - Rapport"
					fileName="tableau-de-bord-cartes-diplomatiques"
					sections={reportSections}
				/>
			</div>
			<div className="grid grid-cols-4 gap-4">
				{statsData.map((stat) => (
					<CardStats key={stat.title} {...stat} />
				))}
			</div>

			<Tabs defaultValue="new-request" className="mt-4">
				<TabsList>
					<TabsTrigger value="new-request">Nouvelle demande</TabsTrigger>
					<TabsTrigger value="renew">Renouvellement</TabsTrigger>
					<TabsTrigger value="duplicatas">Duplicatas</TabsTrigger>
				</TabsList>
				<TabsContent value="new-request">
					<SimpleTableComponent
						className="mt-2"
						title="Status nouvelle demande"
						headers={headers}
						data={data}
					/>
				</TabsContent>
				<TabsContent value="renew">
					<SimpleTableComponent
						className="mt-2"
						title="Status renouvellement"
						headers={headers}
						data={dataRenew}
					/>
				</TabsContent>
				<TabsContent value="duplicatas">
					<SimpleTableComponent
						className="mt-2"
						title="Status duplicatas"
						headers={headers}
						data={dataDuplicata}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
