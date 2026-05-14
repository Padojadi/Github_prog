"use client";

import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/components/table-skeleton";
import {
	getHoldersDependantsChildsRenew,
	getHoldersDependantsDomesticAndRelativesRenew,
	getHoldersDependantsOtherDependantsRenew,
	getHoldersDependantsOtherStaffRenew,
	getHoldersDependantsSpousesRenew,
} from "@/lib/actions/diplomaticCards/holder.client";
import TableComponentRenewDependants from "../table-component-renew-dependants";

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

export function DependantsSectionRenew({ holder }: DependantsSectionProps) {
	const { data } = useQuery({
		queryKey: ["holderChildsRenew", holder.id],
		queryFn: async () => {
			const [
				spouseRes,
				childRes,
				otherDependantRes,
				otherStaffRes,
				domesticRes,
			] = await Promise.allSettled([
				getHoldersDependantsSpousesRenew(holder.id),
				getHoldersDependantsChildsRenew(holder.id),
				getHoldersDependantsOtherDependantsRenew(holder.id),
				getHoldersDependantsOtherStaffRenew(holder.id),
				getHoldersDependantsDomesticAndRelativesRenew(holder.id),
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
					<TableComponentRenewDependants
						headers={headers}
						title="Époux(se)"
						data={Array.isArray(data?.spouses) ? data.spouses : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/spouses/renew",
							},
							{ label: "edit", href: "/panel/diplomatic/spouses/renew" },
							{
								label: "validate",
								href: "/panel/diplomatic/spouses/renew",
							},
						]}
						searchName="spouseSearch"
					/>
					<TableComponentRenewDependants
						headers={headers}
						title="Enfants"
						data={Array.isArray(data?.childs) ? data.childs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/childs/renew",
							},
							{ label: "edit", href: "/panel/diplomatic/childs/renew" },
							{
								label: "validate",
								href: "/panel/diplomatic/childs/renew",
							},
						]}
						searchName="childsSearch"
					/>
					<TableComponentRenewDependants
						headers={headers}
						title="Autres Dépendants"
						data={
							Array.isArray(data?.otherDependants) ? data.otherDependants : []
						}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-dependants/renew",
							},
							{
								label: "edit",
								href: "/panel/diplomatic/other-dependants/renew",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/other-dependants/renew",
							},
						]}
						searchName="otherDependantsSearch"
					/>
					<TableComponentRenewDependants
						headers={headers}
						title="Personnels de services, domestiques et familles"
						data={Array.isArray(data?.domestics) ? data.domestics : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/domestics-and-relatives/renew",
							},
							{
								label: "edit",
								href: "/panel/diplomatic/domestics-and-relatives/renew",
							},
							{
								label: "validate",
								href: "/panel/diplomatic/domestics-and-relatives/renew",
							},
						]}
						searchName="domesticsSearch"
					/>
					<TableComponentRenewDependants
						headers={headers}
						title="Autres personnels"
						data={Array.isArray(data?.otherStaffs) ? data.otherStaffs : []}
						actions={[
							{
								label: "details",
								href: "/panel/diplomatic/other-staff/renew",
							},
							{ label: "edit", href: "/panel/diplomatic/other-staff/renew" },
							{
								label: "validate",
								href: "/panel/diplomatic/other-staff/renew",
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
