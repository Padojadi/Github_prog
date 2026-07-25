"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { convertDateToLocalString } from "@/components/utils/utils";
import { useSystemSettingsClient } from "@/features/settings/system-settings/hooks/use-system-settings";
import type { SystemSettings } from "@/features/settings/system-settings/types";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import type { IFormSections } from "@/lib/types";
import FlagSenegal from "@/public/images/flag-of-senegal.png";

export default function FormDocumentOne({
	person,
	formSections,
}: {
	person: any;
	formSections: IFormSections[];
}) {
	// check if person has "ownerDiplomaticCardId" and fetch the holder card by id
	const id = person?.ownerDiplomaticCardId;
	const [newPerson, setNewPerson] = useState<any>();
	const { data: systemSettings } = useSystemSettingsClient();
	const settings = systemSettings?.data as SystemSettings;

	useEffect(() => {
		if (id) {
			const fetchHolderCard = async () => {
				try {
					const response = await fetchHolderCardById(id);
					const holder = response.data;
					setNewPerson({
						...person,
						holderTitle: holder?.title,
						holderFileNumber: holder?.id,
						holderFirstName: holder?.firstName,
						holderLastName: holder?.lastName,
						holderCitizenship: holder?.citizenship,
					});
					// console.log(person);
				} catch (error) {
					// console.log(error);
				}
			};
			fetchHolderCard();
		}
	}, [id, person]);

	return (
		<div className="bg-white p-6 mx-auto shadow-lg rounded w-full">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-lg font-bold uppercase">
						{settings?.ministryName ||
							"MINISTERE DE L’INTEGRATION AFRICAINE ET DES AFFAIRES ETRANGERES"}
					</h1>
					<p className="text-sm uppercase">
						{settings?.protocolDirectionName ||
							"DIRECTION DU PROTOCOLE, DES CONFERENCES ET DE LA TRADUCTION"}
					</p>
				</div>
				<Image
					src={FlagSenegal}
					width={100}
					height={66.7}
					alt="Senegal"
					className="mr-5"
				/>
			</div>
			{newPerson &&
				formSections.map((section) => (
					<div key={section.title} className="mb-4">
						<h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
							{section.title}
						</h2>
						<div className="grid gap-4">
							{section.data.map((item) => {
								if (item.name !== "ownerDiplomaticCardId") {
									return (
										<p key={item.label} className="text-md">
											{item.label}:{" "}
											{item.type === "date"
												? convertDateToLocalString(newPerson[item.name], true)
												: newPerson[item.name]}
										</p>
									);
								} else {
									return null;
								}
							})}
							{section.supportingText && (
								<p className="text-xs italic">{section.supportingText}</p>
							)}
						</div>
					</div>
				))}
		</div>
	);
}
