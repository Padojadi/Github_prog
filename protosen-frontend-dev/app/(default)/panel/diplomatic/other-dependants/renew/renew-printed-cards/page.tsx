import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	fetchOtherDependantsPrintedCardsRenew,
	undoPrintRenew,
	markCardAsReturnedRenew
} from "@/lib/actions/diplomaticCards/otherDependants";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchOtherDependantsPrintedCardsRenew();

	const headers = [
		{ label: "Prénom", code: "previousCard.firstName" },
		{ label: "Nom", code: "previousCard.lastName" },
		{ label: "Sexe", code: "previousCard.gender" },
		{ label: "Date de naissance", code: "previousCard.dateOfBirth" },
		{ label: "Lieu de naissance", code: "previousCard.placeOfBirth" },
		{ label: "Citoyenneté", code: "previousCard.citizenship" },
		{ label: "Pays de naissance", code: "previousCard.countryOfBirth" },
		{ label: "Statut", code: "expired" },
		{ label: "Organisation", code: "previousCard.organism.libelle" },
		{ label: "Créer le", code: "createdAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	// console.log(data)

	return (
		<div>
			<TableComponentRenew
				headers={headers}
				title="Renouvellements imprimés autres dépendants"
				data={Array.isArray(data) ? data : []}
				actions={[
					{
						label: "details",
						href: "/panel/diplomatic/other-dependants/renew",
					},
					{
						label: "unlock",
						href: "/panel/diplomatic/other-dependants/renew",
						customAction: undoPrintRenew,
					},
					{
						label: "return",
						href: "/panel/diplomatic/other-dependants/renew",
						customAction: markCardAsReturnedRenew,
					},
				]}
			/>
		</div>
	);
}
