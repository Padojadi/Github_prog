import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	fetchHoldersPrintedCardsDuplicate,
	undoPrintDuplicate,
	markCardAsReturnedDuplicate,
} from "@/lib/actions/diplomaticCards/holders";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchHoldersPrintedCardsDuplicate();

	const headers = [
		{ label: "Titre", code: "previousCard.title" },
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "État civil", code: "previousCard.matrimonialStatus" },
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
				title="Duplicatas imprimés titulaires"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/holders/duplicates" },
					{
						label: "unlock",
						href: "/panel/diplomatic/holders/duplicates",
						customAction: undoPrintDuplicate,
					},
					{
						label: "return",
						href: "/panel/diplomatic/holders/duplicates",
						customAction: markCardAsReturnedDuplicate,
					},
				]}
			/>
		</div>
	);
}
