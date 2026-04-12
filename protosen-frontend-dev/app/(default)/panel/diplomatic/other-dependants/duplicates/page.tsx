import React from "react";
import { ModalDuplicate } from "@/components/modalDuplicate";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createOtherDependantDuplicateNewRequest,
	fetchActiveOtherDependantsCards,
	fetchDuplicateOtherDependantsCards,
} from "@/lib/actions/diplomaticCards/otherDependants";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchDuplicateOtherDependantsCards();

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
				link="/panel/diplomatic/other-dependants/duplicates"
				fetchActivePersonsCards={fetchActiveOtherDependantsCards}
				createAction={createOtherDependantDuplicateNewRequest}
			/>
			<TableComponentRenew
				headers={headers}
				title="Duplicata autres dépendants"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-dependants/duplicates",
					},
					{
						label: "submit",
						href: "/panel/diplomatic/other-dependants/duplicates",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/other-dependants/duplicates",
					},
				]}
			/>
		</div>
	);
}
