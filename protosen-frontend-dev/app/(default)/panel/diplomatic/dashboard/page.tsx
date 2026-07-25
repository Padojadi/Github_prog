import Link from "next/link";
import React from "react";
import SimpleTableComponent from "@/components/table/simpleTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	fetchStatsCards,
	fetchStatsCardsDuplicata,
	fetchStatsCardsRenew,
} from "@/lib/actions/diplomaticCards/holders";

export default async function DiplomaticDashboard() {
	const res = await fetchStatsCards();
	const resRenew = await fetchStatsCardsRenew();
	const resDuplicata = await fetchStatsCardsDuplicata();
	const data = res.data;
	const dataRenew = resRenew.data;
	const dataDuplicata = resDuplicata.data;

	const headers = [
		{ label: "Nom", code: "name" },
		{ label: "En attente", code: "pending" },
		{ label: "Confirmé", code: "confirmed" },
		{ label: "Accepté", code: "accepted" },
		{ label: "Rejeté", code: "rejected" },
		{ label: "Brouillon", code: "onHold" },
		{ label: "Total", code: "total" },
	];

	// console.log(dataRenew);

	const statusData = [
		{
			name: "Titulaire",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
		{
			name: "Conjoint",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
		{
			name: "Enfants du Titulaire",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
		{
			name: "Autres Dépendants",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
		{
			name: "Personnel de service, domestiques et familles",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
		{
			name: "Autres personnels",
			pending: 0,
			confirmed: 0,
			rejected: 0,
			onhold: 0,
			total: 0,
		},
	];

	const statsData = [
		{
			title: "Nouvelles Demandes",
			value:
				data
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0) ?? 0,
			color: "bg-blue-600",
		},
		{
			title: "Renouvellement",
			value:
				dataRenew
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0) ?? 0,
			color: "bg-green-600",
		},
		{
			title: "Duplicatas",
			value:
				dataDuplicata
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0) ?? 0,
			color: "bg-yellow-400",
		},
		{
			title: "Cartes au total",
			value:
				data
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0) +
				dataRenew
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0) +
				dataDuplicata
					?.map((item: any) => item?.total)
					.reduce((a: any, b: any) => a + b, 0),
			color: "bg-orange-400",
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
