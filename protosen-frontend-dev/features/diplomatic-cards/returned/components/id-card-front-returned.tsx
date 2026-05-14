"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import type { IPersonCardInfos } from "@/lib/types";
import { formatName } from "@/lib/utils";
import FlagSenegal from "@/public/images/flag-of-senegal.png";
import { convertDate } from "@/components/utils/utils";
import { SystemSettings } from "@/features/settings/system-settings/types";

const IdCardFontReturned = ({ person, settings }: { person: IPersonCardInfos, settings: SystemSettings }) => {
	const [newPerson, setNewPerson] = useState<any>();

	const fetchHolderCard = useCallback(async () => {
		try {
			const response = await fetchHolderCardById(person.ownerDiplomaticCardId);
			const holder = response.data;
			setNewPerson({
				...person,
				holderTitle: holder?.title,
				holderFileNumber: holder?.id,
				holderFirstName: holder?.firstName,
				holderLastName: holder?.lastName,
				holderCitizenship: holder?.citizenship,
				holderJobFunction: holder?.jobFunction,
			});
			// console.log(holder);
		} catch (error) {
			// console.log(error);
		}
	}, [person]);

	useEffect(() => {
		if (person.ownerDiplomaticCardId) {
			fetchHolderCard();
		}
	}, [fetchHolderCard, person]);
	return (
		<div className="mt-5 flex justify-center">
			<div
				style={{ backgroundColor: person?.color || "#AEFCAC" }}
				id="idCardFont"
				className={`p-4 text-black min-w-[487.5626px] min-h-[306.144px] max-w-[488px] max-h-[307px]`}
			>
				<div className="flex justify-between">
					<div className="flex space-x-2 w-1/2">
						<Image src={FlagSenegal} width={60} alt="Senegal" />
						<div className="text-[11px] uppercase">
							{person?.type_card}
						</div>
					</div>
					<div className="text-xs text-right w-1/2 max-w-[27ch]">
						{settings?.ministryName || "Ministère de l’Intégration africaine et des Affaires étrangères"}
					</div>
				</div>
				<div className="flex justify-between mt-4">
					<div className="space-y-1">
						<div className="text-xs">Nom</div>
						<div className="font-bold text-[10px]">{person?.lastName}</div>
						<div className="text-xs">Prénom(s)</div>
						<div className="font-bold text-[10px]">{person?.firstName}</div>
						<div className="flex justify-start flex-row">
							<div>
								<div className="text-xs">Date de naissance</div>
								<div className="font-bold text-[10px]">
									{convertDate(person?.dateOfBirth, "fr")}
								</div>
							</div>
							<div className="mx-4">/</div>
							<div>
								<div className="text-xs">Sexe</div>
								<div className="font-bold text-[10px]">{person.gender}</div>
							</div>
						</div>
						<div>
							<div className="text-xs">Mission</div>
							<div className="font-bold text-[10px]">
								{person.organism?.libelle || ""}
							</div>
						</div>
						<div className="text-xs">Qualité/Fonction</div>
						<div className="font-bold text-[10px]">
							{person?.jobFunction || (
								<b className="font-bold">
									{newPerson?.childDCFiles
										? `Enfant de ${newPerson?.holderLastName ?? ""} ${
												formatName(newPerson?.holderFirstName) ?? ""
											}, ${newPerson?.holderJobFunction ?? ""}`
										: newPerson?.spouseDCFiles
											? `Époux(se) de ${newPerson?.holderLastName ?? ""} ${
													formatName(newPerson?.holderFirstName) ?? ""
												}, ${newPerson?.holderJobFunction ?? ""}`
											: "N/A"}
								</b>
							)}
						</div>
					</div>
					<div className="flex flex-col items-end">
						<div className="flex justify-center items-center max-w-[131px] h-[151px] bg-gray-100">
							<img
								id="photoLink"
								src={person.photoLink}
								alt="photoLink"
								style={{ height: "100%", width: "100%" }}
							/>
							{/* {photo ? (
                <img
                  src={photo}
                  alt="photo img"
                  style={{ height: "100%", width: "100%" }}
                />
              ) : person.photoLink ? (
                <LoadingIcon />
              ) : (
                <span>Pas d'image</span>
              )} */}
						</div>
						<div className="flex gap-1 mt-2">
							<div className="text-[10px]">N°</div>
							<div className="font-bold text-[10px]">
								{person.organism?.institutionType === "AMBASSADE" ||
								person.organism?.institutionType === "CONSULAT"
									? `${person?.plaque ? person?.plaque + "-" : ""}`
									: ""}
								{person?.cardNumber}
							</div>
						</div>
					</div>
				</div>
				{person?.observation && (
					<p className="uppercase text-black font-bold text-center text-xs">
						{person?.observation}
					</p>
				)}
			</div>
		</div>
	);
};

export default IdCardFontReturned;
