import TableComponent from "@/components/table/tableComponent";
import {
	fetchChildsPrintedCards,
	markCardAsReturned,
	undoPrint,
} from "@/lib/actions/diplomaticCards/childs";
import type { IHolder } from "@/lib/types";

export default async function Page() {
	const res = await fetchChildsPrintedCards();

	const headers = [
		{ label: "Prénom", code: "firstName" },
		{ label: "Nom", code: "lastName" },
		{ label: "Sexe", code: "gender" },
		{ label: "Date de naissance", code: "dateOfBirth" },
		{ label: "Lieu de naissance", code: "placeOfBirth" },
		{ label: "Citoyenneté", code: "citizenship" },
		{ label: "Pays de naissance", code: "countryOfBirth" },
		{ label: "Statut", code: "expired" },
		{ label: "Organisation", code: "organism" },
		{ label: "Créer le", code: "createdAt" },
	];

	const data = res?.data?.rows.map((item: IHolder) => {
		return Object.fromEntries(Object.entries(item));
	});

	// console.log(data)

	return (
		<div>
			<TableComponent
				headers={headers}
				title="Enfants du Titulaire"
				data={Array.isArray(data) ? data : []}
				actions={[
					{ label: "details", href: "/panel/diplomatic/childs/" },
					{
						label: "unlock",
						href: "/panel/diplomatic/childs/",
						customAction: undoPrint,
					},
					{
						label: "return",
						href: "/panel/diplomatic/childs/",
						customAction: markCardAsReturned,
					},
				]}
			/>
		</div>
	);
}
