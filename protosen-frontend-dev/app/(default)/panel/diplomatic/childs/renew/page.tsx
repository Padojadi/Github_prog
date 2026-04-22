import { ModalRenew } from "@/components/modal-renew";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createChildsRenewCard,
	fetchRenewChildsCards,
	getChildsCardsForRenew,
} from "@/lib/actions/diplomaticCards/childs";

export default async function Page() {
	const res = await fetchRenewChildsCards();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "cardNumber" },
		{ label: "Statut (renouvellement)", code: "documentStage" },
		{ label: "Créé le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: any) => {
		return Object.fromEntries(Object.entries(item));
	});

	return (
		<div>
			<ModalRenew
				fetchFn={getChildsCardsForRenew}
				createFn={createChildsRenewCard}
				key="childs"
			/>
			<TableComponentRenew
				headers={headers}
				title="Renouvellement"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/childs/renew" },
					{ label: "edit", href: "/panel/diplomatic/childs/renew" },
					{
						label: "validate",
						href: "/panel/diplomatic/childs/renew",
					},
				]}
			/>
		</div>
	);
}
