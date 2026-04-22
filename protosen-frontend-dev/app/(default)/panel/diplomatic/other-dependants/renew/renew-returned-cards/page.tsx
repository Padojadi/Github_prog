import React from "react";
import TableComponentReturned from "@/features/diplomatic-cards/returned/components/table-component-returned";
import {
	fetchOtherDependantsReturnedCardsRenew,
} from "@/lib/actions/diplomaticCards/otherDependants";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchOtherDependantsReturnedCardsRenew();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
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
				title="Cartes renouvelées restituées autres dépendants"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-dependants/renew/renew-returned-cards",
					},
				]}
			/>
		</div>
	);
}

