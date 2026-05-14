import TableComponentRenew from "@/features/diplomatic-cards/renew/components/table-component-renew";
import {
	fetchChildsPrintedCardsRenew,
	undoPrintRenew,
	markCardAsReturnedRenew
} from "@/lib/actions/diplomaticCards/childs";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchChildsPrintedCardsRenew();

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

	// console.log(data[0])

	return (
		<div>
			<TableComponentRenew
				headers={headers}
				title="Enfants du Titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/childs/renew" },
					{
						label: "unlock",
						href: "/panel/diplomatic/childs/renew",
						customAction: undoPrintRenew,
					},
					{
						label: "return",
						href: "/panel/diplomatic/childs/renew",
						customAction: markCardAsReturnedRenew,
					},
				]}
			/>
		</div>
	);
}
