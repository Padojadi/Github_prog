import { ModalRenew } from "@/components/modal-renew";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createOtherStaffsRenewCard,
	fetchRenewOtherStaffsCards,
	getOtherStaffsCardsForRenew,
} from "@/lib/actions/diplomaticCards/otherStaffs";

export default async function Page() {
	const res = await fetchRenewOtherStaffsCards();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "cardNumber" },
		{ label: "Statut (renouvellement)", code: "documentStage" },
		{ label: "Créer le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: any) => {
		return Object.fromEntries(Object.entries(item));
	});

	return (
		<div>
			<ModalRenew
				fetchFn={getOtherStaffsCardsForRenew}
				createFn={createOtherStaffsRenewCard}
				key="otherStaffs"
			/>
			<TableComponentRenew
				headers={headers}
				title="Renouvellement"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-staff/renew",
					},
					{
						label: "edit",
						href: "/panel/diplomatic/other-staff/renew",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/other-staff/renew",
					},
				]}
			/>
		</div>
	);
}
