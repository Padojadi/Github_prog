import React from "react";
import { ModalDuplicate } from "@/components/modalDuplicate";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createOtherStaffDuplicateNewRequest,
	fetchActiveOtherStaffsCards,
	fetchDuplicateOtherStaffsCards,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchDuplicateOtherStaffsCards();

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
				link="/panel/diplomatic/other-staff/duplicates"
				fetchActivePersonsCards={fetchActiveOtherStaffsCards}
				createAction={createOtherStaffDuplicateNewRequest}
			/>
			<TableComponentRenew
				headers={headers}
				title="Duplicata autres personnels"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-staff/duplicates",
					},
					{
						label: "submit",
						href: "/panel/diplomatic/other-staff/duplicates",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/other-staff/duplicates",
					},
				]}
			/>
		</div>
	);
}
