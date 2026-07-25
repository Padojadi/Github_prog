import { ModalRenew } from "@/components/modal-renew";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createSpousesRenewCard,
	fetchRenewSpousesCards,
	getSpousesCardsForRenew,
} from "@/lib/actions/diplomaticCards/spouses";

export default async function Page() {
	const res = await fetchRenewSpousesCards();

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
				fetchFn={getSpousesCardsForRenew}
				createFn={createSpousesRenewCard}
				key="spouses"
			/>
			<TableComponentRenew
				headers={headers}
				title="Renouvellement conjoints du titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/spouses/renew",
					},
					{
						label: "edit",
						href: "/panel/diplomatic/spouses/renew",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/spouses/renew",
					},
				]}
			/>
		</div>
	);
}
