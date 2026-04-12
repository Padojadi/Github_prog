"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import BreadcrumbLink from "./breadcrumbLink";

export default function LayoutSubmitProcessDuplicata({
	children,
	params,
	mainLink,
	isEdit = false,
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

	if (isEdit && canEdit === false) {
		router.push(`${mainLink}/duplicates`);
	}

	useEffect(() => {
		if (isEdit && fetchDataById) {
			const fetchData = async () => {
				const res = await fetchDataById(id);

				const canEdit = !res.data?.expired;

				setPerson(res.data);

				if (canEdit) {
					setCanEdit(true);
				} else {
					setCanEdit(false);
				}
			};
			fetchData();
		}
	}, [id, isEdit, fetchDataById]);

	const pageKey = "/duplicates";

	return (
		<>
			{/* Breadcrumb for edit page, file forms page and submit page */}
			<div className="flex justify-between mb-4 bg-white dark:bg-slate-800 py-2">
				<div className="flex gap-2">
					<BreadcrumbLink href={mainLink + pageKey}>
						<BsChevronDoubleLeft className="mr-2" size={16} /> Retour à la liste
					</BreadcrumbLink>
					<BreadcrumbLink
						href={`${mainLink}/duplicates/${id}/submit?previousCard=${person?.previousCard?.id}`}
					>
						Soumission <BsChevronDoubleRight className="ml-2" size={16} />
					</BreadcrumbLink>
				</div>
				<div className="mr-4 flex items-center">
					{person && (
						<>
							<span>Nom & Prénom : </span>
							<span className="font-bold ">
								{`${person?.previousCard?.lastName} ${person?.previousCard?.firstName}`}
							</span>
						</>
					)}
				</div>
			</div>
			{children}
		</>
	);
}
