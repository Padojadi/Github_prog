import React from "react";
import TableComponentReturned from "@/features/diplomatic-cards/returned/components/table-component-returned";
import {
	fetchHoldersReturnedCardsDuplicate,
} from "@/lib/actions/diplomaticCards/holders";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchHoldersReturnedCardsDuplicate();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "previousCard.cardNumber" },
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
				title="Duplicatas restituées titulaires"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/holders/duplicates/duplicate-returned-cards",
					},
				]}
			/>
		</div>
	);
}
