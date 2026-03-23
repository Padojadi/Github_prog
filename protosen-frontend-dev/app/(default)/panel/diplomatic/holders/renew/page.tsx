import { ModalRenew } from "@/components/modal-renew";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createHolderRenewCard,
	fetchRenewHoldersCards,
	getHoldersCardsForRenew,
} from "@/lib/actions/diplomaticCards/holders";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchRenewHoldersCards();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "cardNumber" },
		{ label: "Statut (renouvellement)", code: "documentStage" },
		{ label: "Créé le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	// console.log(data);

	return (
		<div>
			<ModalRenew
				fetchFn={getHoldersCardsForRenew}
				createFn={createHolderRenewCard}
				key="holders"
			/>
			<TableComponentRenew
				headers={headers}
				title="Renouvellement"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/holders/renew" },
					{ label: "edit", href: "/panel/diplomatic/holders/renew" },
					{
						label: "validate",
						href: "/panel/diplomatic/holders/renew",
					},
				]}
			/>
		</div>
	);
}
