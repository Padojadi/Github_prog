import React from "react";
import { ModalDuplicate } from "@/components/modalDuplicate";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createHolderDuplicateNewRequest,
	fetchActiveHoldersCards,
	fetchDuplicateHoldersCards,
} from "@/lib/actions/diplomaticCards/holders";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchDuplicateHoldersCards();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "previousCard.cardNumber" },
		{ label: "Statut (duplicata)", code: "documentStage" },
		{ label: "Créé le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	return (
		<div>
			{/* <ModalDuplicate /> */}
			<ModalDuplicate
				link="/panel/diplomatic/holders/duplicates"
				fetchActivePersonsCards={fetchActiveHoldersCards}
				createAction={createHolderDuplicateNewRequest}
			/>
			<TableComponentRenew
				headers={headers}
				title="Duplicata titulaires"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/holders/duplicates",
					},
					{
						label: "submit",
						href: "/panel/diplomatic/holders/duplicates",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/holders/duplicates",
					},
				]}
			/>
		</div>
	);
}
