"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import useCurrentUser from "@/hooks/useCurrentUser";
import BreadcrumbLink from "./breadcrumbLink";

export default function LayoutSubmitProcessRenew({
	children,
	params,
	mainLink,
	isEdit = false,
	personDiplomaticCardFilesPropName,
	fetchDataById,
}: {
	children: React.ReactNode;
	params: any;
	mainLink: string;
	isEdit?: boolean;
	personDiplomaticCardFilesPropName?: string;
	fetchDataById?: (id: any) => Promise<
		| {
				message: string;
				status: string;
				errors: any;
				data?: undefined;
		  }
		| {
				message: string;
				status: string;
				errors?: undefined;
				data?: undefined;
		  }
		| {
				data: any;
				message: string;
				status: string;
				errors?: undefined;
		  }
	>;
}) {
	const { id } = params;
	const [person, setPerson] = useState<any>();
	const [canEdit, setCanEdit] = useState<boolean | undefined>(undefined);
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentUser = useCurrentUser();

	// Check if the user can submit the form
	const canSubmit =
		personDiplomaticCardFilesPropName &&
		person?.previousCard?.[personDiplomaticCardFilesPropName];

	if (isEdit && canEdit === false) {
		router.push(`${mainLink}/renew`);
	}

	useEffect(() => {
		if (isEdit && fetchDataById) {
			const fetchData = async () => {
				const res = await fetchDataById(id);
				// Check if the user can edit the form
				// Todo : User can also edit if person?.documentStage === "accepted", searchParams.has("renew_id") and on related "renew line" status == "on hold / draft / rejected / accepted"

				const documentStage = await res.data?.documentStage;

				const canEdit =
					((documentStage !== "pending" &&
						documentStage !== "accepted" &&
						documentStage !== "confirmed" &&
						documentStage !== "printed") ||
						(currentUser?.isSuperAdmin && documentStage !== "printed")) &&
					!res.data?.expired;

				setPerson(res.data);

				if (canEdit) {
					setCanEdit(true);
				} else {
					setCanEdit(false);
				}
			};
			fetchData();
		}
	}, [id, isEdit, fetchDataById, currentUser.isSuperAdmin]);

	const pageKey = "/renew";

	return (
		<>
			{/* Breadcrumb for edit page, file forms page and submit page */}
			<div className="flex justify-between mb-4 bg-white dark:bg-slate-800 py-2">
				<div className="flex gap-2">
					<BreadcrumbLink href={mainLink + pageKey}>
						<BsChevronDoubleLeft className="mr-2" size={16} /> Retour à la liste
					</BreadcrumbLink>
					{!searchParams.has("isDuplicate") && (
						<>
							<BreadcrumbLink
								href={`${mainLink}/renew/${id}/edit?previousCard=${person?.previousCard?.id}`}
							>
								Formulaire d'édition{" "}
								<BsChevronDoubleRight className="ml-2" size={16} />
							</BreadcrumbLink>
							<BreadcrumbLink
								href={`${mainLink}/renew/${id}/files-form?previousCard=${person?.previousCard?.id}`}
							>
								Formulaire de fichiers{" "}
								<BsChevronDoubleRight className="ml-2" size={16} />
							</BreadcrumbLink>
						</>
					)}
					<BreadcrumbLink
						disabled={!canSubmit}
						href={`${mainLink}/renew/${id}/submit?previousCard=${person?.previousCard?.id}`}
					>
						Soumission <BsChevronDoubleRight className="ml-2" size={16} />
					</BreadcrumbLink>
				</div>
				<div className="mr-4 flex items-center">
					{person && (
						<>
							<span>Nom & Prénom : </span>
							<span className="font-bold ">
								{`${person.previousCard?.lastName} ${person.previousCard?.firstName}`}
							</span>
						</>
					)}
				</div>
			</div>
			{children}
		</>
	);
}
