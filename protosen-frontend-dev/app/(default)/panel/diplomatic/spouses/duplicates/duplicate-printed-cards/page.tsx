import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	fetchSpousesPrintedCardsDuplicate,
	markCardAsReturnedDuplicate,
	undoPrintDuplicate,
} from "@/lib/actions/diplomaticCards/spouses";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchSpousesPrintedCardsDuplicate();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Sexe", code: "previousCard.gender" },
		{ label: "Date de naissance", code: "previousCard.dateOfBirth" },
		{ label: "Citoyenneté", code: "previousCard.citizenship" },
		{ label: "Numéro de carte", code: "previousCard.cardNumber" },
		{ label: "Statut", code: "previousCard.expired" },
		{ label: "Organisation", code: "previousCard.organism.libelle" },
		{ label: "Créé le", code: "createdAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	// console.log(data[0])

	return (
		<div>
			<TableComponentRenew
				headers={headers}
				title="Duplicatas imprimés conjoints du titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/spouses/duplicates" },
					{
						label: "unlock",
						href: "/panel/diplomatic/spouses/duplicates",
						customAction: undoPrintDuplicate,
					},
					{
						label: "return",
						href: "/panel/diplomatic/spouses/duplicates",
						customAction: markCardAsReturnedDuplicate,
					},
				]}
			/>
		</div>
	);
}
