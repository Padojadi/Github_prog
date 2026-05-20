import TableComponentReturned from "@/features/diplomatic-cards/returned/components/table-component-returned";
import { fetchDomesticsAndRelativesReturnedCards } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchDomesticsAndRelativesReturnedCards();

	const headers = [
		{ label: "Prénom", code: "firstName" },
		{ label: "Nom", code: "lastName" },
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
				title="Cartes restituées personnels de services, domestiques et familles"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/domestics-and-relatives/returned-cards",
					},
				]}
			/>
		</div>
	);
}
