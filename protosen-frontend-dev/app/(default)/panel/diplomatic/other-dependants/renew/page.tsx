import { ModalRenew } from "@/components/modal-renew";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createOtherDependantsRenewCard,
	fetchRenewOtherDependantsCards,
	getOtherDependantsCardsForRenew,
} from "@/lib/actions/diplomaticCards/otherDependants";

export default async function Page() {
	const res = await fetchRenewOtherDependantsCards();

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
				fetchFn={getOtherDependantsCardsForRenew}
				createFn={createOtherDependantsRenewCard}
				key="otherDependants"
			/>
			<TableComponentRenew
				headers={headers}
				title="Renouvellement autres dépendants"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-dependants/renew",
					},
					{
						label: "edit",
						href: "/panel/diplomatic/other-dependants/renew",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/other-dependants/renew",
					},
				]}
			/>
		</div>
	);
}
