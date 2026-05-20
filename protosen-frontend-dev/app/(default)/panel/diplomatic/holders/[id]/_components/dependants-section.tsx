"use client";

import { useQuery } from "@tanstack/react-query";
import TableComponentHoldersDependants from "@/components/table/table-component-holders-dependants";
import TableSkeleton from "@/components/table-skeleton";
import { deleteCard as deleteCardChilds } from "@/lib/actions/diplomaticCards/childs";
import { deleteCard as deleteCardDomestics } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import {
	getHoldersDependantsChilds,
	getHoldersDependantsDomesticAndRelatives,
	getHoldersDependantsOtherDependants,
	getHoldersDependantsOtherStaff,
	getHoldersDependantsSpouses,
} from "@/lib/actions/diplomaticCards/holder.client";
import { deleteCard as deleteCardOtherDependants } from "@/lib/actions/diplomaticCards/otherDependants";
import { deleteCard } from "@/lib/actions/diplomaticCards/otherStaffs";
import { deleteCard as deleteCardSpouses } from "@/lib/actions/diplomaticCards/spouses";

interface DependantsSectionProps {
	holder: any;
}

const headers = [
	{ label: "Prénom", code: "firstName" },
	{ label: "Nom", code: "lastName" },
	{ label: "Sexe", code: "gender" },
	{ label: "Date de naissance", code: "dateOfBirth" },
	{ label: "Lieu de naissance", code: "placeOfBirth" },
	{ label: "Citoyenneté", code: "citizenship" },
	{ label: "Pays de naissance", code: "countryOfBirth" },
	{ label: "Statut", code: "documentStage" },
	{ label: "Organisation", code: "organism" },
	{ label: "Créé le", code: "createdAt" },
];

export function DependantsSection({ holder }: DependantsSectionProps) {
	const { data } = useQuery({
		queryKey: ["holderChilds", holder.id],
		queryFn: async () => {
			const [
				spouseRes,
				childRes,
				otherDependantRes,
				otherStaffRes,
				domesticRes,
			] = await Promise.allSettled([
				getHoldersDependantsSpouses(holder.id),
				getHoldersDependantsChilds(holder.id),
				getHoldersDependantsOtherDependants(holder.id),
				getHoldersDependantsOtherStaff(holder.id),
				getHoldersDependantsDomesticAndRelatives(holder.id),
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
					<TableComponentHoldersDependants
						headers={headers}
						title="Époux(se)"
						data={Array.isArray(data?.spouses) ? data.spouses : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/spouses/",
							},
							{ label: "edit", href: "/panel/diplomatic/spouses/" },
							{
								label: "validate",
								href: "/panel/diplomatic/spouses/",
							},
							{
								label: "delete-card",
								href: "/panel/diplomatic/spouses/",
								customAction: deleteCardSpouses,
							},
						]}
						searchName="spouseSearch"
					/>
					<TableComponentHoldersDependants
						headers={headers}
						title="Enfants"
						data={Array.isArray(data?.childs) ? data.childs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/childs/",
							},
							{ label: "edit", href: "/panel/diplomatic/childs/" },
							{
								label: "validate",
								href: "/panel/diplomatic/childs/",
							},
							{
								label: "delete-card",
								href: "/panel/diplomatic/childs/",
								customAction: deleteCardChilds,
							},
						]}
						searchName="childsSearch"
					/>
					<TableComponentHoldersDependants
						headers={headers}
						title="Autres Dépendants"
						data={
							Array.isArray(data?.otherDependants) ? data.otherDependants : []
						}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-dependants/",
							},
							{ label: "edit", href: "/panel/diplomatic/other-dependants/" },
							{
								label: "validate",
								href: "/panel/diplomatic/other-dependants/",
							},
							{
								label: "delete-card",
								href: "/panel/diplomatic/other-dependants/",
								customAction: deleteCardOtherDependants,
							},
						]}
						searchName="otherDependantsSearch"
					/>
					<TableComponentHoldersDependants
						headers={headers}
						title="Personnels de services, domestiques et familles"
						data={Array.isArray(data?.domestics) ? data.domestics : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/domestics-and-relatives/",
							},
							{
								label: "edit",
								href: "/panel/diplomatic/domestics-and-relatives/",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/domestics-and-relatives/",
							},
							{
								label: "delete-card",
								href: "/panel/diplomatic/domestics-and-relatives/",
								customAction: deleteCardDomestics,
							},
						]}
						searchName="domesticsSearch"
					/>
					<TableComponentHoldersDependants
						headers={headers}
						title="Autres personnels"
						data={Array.isArray(data?.otherStaffs) ? data.otherStaffs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-staff/",
							},
							{ label: "edit", href: "/panel/diplomatic/other-staff/" },
							{
								label: "validate",
								href: "/panel/diplomatic/other-staff/",
							},
							{
								label: "delete-card",
								href: "/panel/diplomatic/other-staff/",
								customAction: deleteCard,
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
