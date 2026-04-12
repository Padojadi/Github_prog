import React from "react";
import TableComponentReturned from "@/features/diplomatic-cards/returned/components/table-component-returned";
import {
	fetchSpousesReturnedCards,
} from "@/lib/actions/diplomaticCards/spouses";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchSpousesReturnedCards();

	const headers = [
		{ label: "Prénom", code: "firstName" },
		{ label: "Nom", code: "lastName" },
		{ label: "Numéro de carte", code: "cardNumber" },
		{ label: "Statut", code: "documentStage" },
		{ label: "Créé le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	return (
		<div>
			<TableComponentReturned
				headers={headers}
				title="Cartes restituées conjoints"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/spouses/returned-cards",
					},
				]}
			/>
		</div>
	);
}

