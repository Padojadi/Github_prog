import TableComponentReturned from "@/features/diplomatic-cards/returned/components/table-component-returned";
import { fetchChildsReturnedCardsRenew } from "@/lib/actions/diplomaticCards/childs";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchChildsReturnedCardsRenew();

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
				title="Cartes renouvelées restituées enfants du titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/childs/renew/renew-returned-cards",
					},
				]}
			/>
		</div>
	);
}
