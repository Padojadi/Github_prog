import { ModalDuplicate } from "@/components/modalDuplicate";
import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	createChildDuplicateNewRequest,
	fetchActiveChildsCards,
	fetchDuplicateChildsCards,
} from "@/lib/actions/diplomaticCards/childs";

export default async function Page() {
	const res = await fetchDuplicateChildsCards();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Numéro de carte", code: "previousCard.cardNumber" },
		{ label: "Statut (duplicata)", code: "documentStage" },
		{ label: "Créé le", code: "createdAt" },
		{ label: "Mis à jour le", code: "updatedAt" },
	];

	const data = res?.data?.rows.map((item: any) => {
		return Object.fromEntries(Object.entries(item));
	});

	return (
		<div>
			<ModalDuplicate
				link="/panel/diplomatic/childs/duplicates"
				fetchActivePersonsCards={fetchActiveChildsCards}
				createAction={createChildDuplicateNewRequest}
			/>
			<TableComponentRenew
				headers={headers}
				title="Duplicata enfants du titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/childs/duplicates",
					},
					{
						label: "submit",
						href: "/panel/diplomatic/childs/duplicates",
					},
					{
						label: "validate",
						href: "/panel/diplomatic/childs/duplicates",
					},
				]}
			/>
		</div>
	);
}
