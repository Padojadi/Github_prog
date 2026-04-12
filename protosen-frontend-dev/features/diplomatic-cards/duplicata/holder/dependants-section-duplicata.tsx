"use client";

import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/components/table-skeleton";
import {
	getHoldersDependantsChildsDuplicata,
	getHoldersDependantsDomesticAndRelativesDuplicata,
	getHoldersDependantsOtherDependantsDuplicata,
	getHoldersDependantsOtherStaffDuplicata,
	getHoldersDependantsSpousesDuplicata,
} from "@/lib/actions/diplomaticCards/holder.client";
import TableComponentDuplicataDependants from "../components/table-component-duplicata-dependants";

interface DependantsSectionProps {
	holder: any;
}

const headers = [
	{ label: "Prénom", code: "previousCard.firstName" },
	{ label: "Nom", code: "previousCard.lastName" },
	{ label: "Sexe", code: "previousCard.gender" },
	{ label: "Date de naissance", code: "previousCard.dateOfBirth" },
	{ label: "Lieu de naissance", code: "previousCard.placeOfBirth" },
	{ label: "Citoyenneté", code: "previousCard.citizenship" },
	{ label: "Pays de naissance", code: "previousCard.countryOfBirth" },
	{ label: "Statut", code: "documentStage" },
	{ label: "Organisation", code: "previousCard.organism.libelle" },
	{ label: "Créé le", code: "createdAt" },
];

export function DependantsSectionDuplicata({ holder }: DependantsSectionProps) {
	const { data } = useQuery({
		queryKey: ["holderChildsDuplicata", holder.id],
		queryFn: async () => {
			const [
				spouseRes,
				childRes,
				otherDependantRes,
				otherStaffRes,
				domesticRes,
			] = await Promise.allSettled([
				getHoldersDependantsSpousesDuplicata(holder.id),
				getHoldersDependantsChildsDuplicata(holder.id),
				getHoldersDependantsOtherDependantsDuplicata(holder.id),
				getHoldersDependantsOtherStaffDuplicata(holder.id),
				getHoldersDependantsDomesticAndRelativesDuplicata(holder.id),
			]);
			return {
				spouses: spouseRes.status === "fulfilled" ? spouseRes.value.data : [],
				childs: childRes.status === "fulfilled" ? childRes.value.data : [],
				otherDependants:
					otherDependantRes.status === "fulfilled"
						? otherDependantRes.value.data
						: [],
				otherStaffs:
					otherStaffRes.status === "fulfilled" ? otherStaffRes.value.data : [],
				domestics:
					domesticRes.status === "fulfilled" ? domesticRes.value.data : [],
			};
		},
	});
	// console.log(data && data);
	return (
		<div className="space-y-4">
			{data ? (
				<>
					<TableComponentDuplicataDependants
						headers={headers}
						title="Époux(se)"
						data={Array.isArray(data?.spouses) ? data.spouses : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/spouses/duplicates",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/spouses/duplicates",
							},
						]}
						searchName="spouseSearch"
					/>
					<TableComponentDuplicataDependants
						headers={headers}
						title="Enfants"
						data={Array.isArray(data?.childs) ? data.childs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/childs/duplicates",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/childs/duplicates",
							},
						]}
						searchName="childsSearch"
					/>
					<TableComponentDuplicataDependants
						headers={headers}
						title="Autres Dépendants"
						data={
							Array.isArray(data?.otherDependants) ? data.otherDependants : []
						}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-dependants/duplicates",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/other-dependants/duplicates",
							},
						]}
						searchName="otherDependantsSearch"
					/>
					<TableComponentDuplicataDependants
						headers={headers}
						title="Personnels de services, domestiques et familles"
						data={Array.isArray(data?.domestics) ? data.domestics : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/domestics-and-relatives/duplicates",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/domestics-and-relatives/duplicates",
							},
						]}
						searchName="domesticsSearch"
					/>
					<TableComponentDuplicataDependants
						headers={headers}
						title="Autres personnels"
						data={Array.isArray(data?.otherStaffs) ? data.otherStaffs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-staff/duplicates",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/other-staff/duplicates",
							},
						]}
						searchName="otherStaffSearch"
					/>
				</>
			) : (
				<TableSkeleton />
			)}
		</div>
	);
}
