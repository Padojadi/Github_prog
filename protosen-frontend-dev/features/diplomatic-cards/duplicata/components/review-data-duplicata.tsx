import { RelatedFiles } from "@/components/relatedFiles";
import { convertDateToLocalString } from "@/components/utils/utils";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import type { IFormSections, ISubmitAction } from "@/lib/types";
import SubmitFormDuplicata from "./submit-form-duplicata";

export default async function ReviewDataDuplicata({
	person,
	personDuplicate,
	formSections,
	personDiplomaticCardIdInputName,
	personDiplomaticCardFilesPropName,
	prefixFileKey,
	onDuplicateAction,
	backLink,
}: {
	person: any;
	personDuplicate: any;
	formSections: IFormSections[];
	personDiplomaticCardIdInputName: string;
	personDiplomaticCardFilesPropName: string;
	prefixFileKey: string;
	onDuplicateAction: ISubmitAction;
	backLink: string;
}) {
	// check if person has "ownerDiplomaticCardId" and fetch the holder card by id
	const id = person?.ownerDiplomaticCardId;

	let personLocal: any = person;
	if (id) {
		const res = await fetchHolderCardById(id);
		const holder = res.data;
		personLocal = {
			...person,
			holderTitle: holder?.title,
			holderFileNumber: holder?.id,
			holderFirstName: holder?.firstName,
			holderLastName: holder?.lastName,
			holderCitizenship: holder?.citizenship,
		};
	}
	// console.log(personLocal);
	return (
		<div className="bg-white p-6 mx-auto shadow-lg rounded w-full">
			<div className="mb-6">
				<div>
					<h1 className="text-lg font-bold">VERIFICATION DES INFORMATIONS</h1>
				</div>
			</div>
			{formSections.map((section) => (
				<div key={section.title} className="mb-4">
					<h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
						{section.title}
					</h2>
					<div className="space-y-2">
						<div className="grid grid-cols-4 gap-4">
							{section.data.map((item) => (
								<div key={item.label} className="space-y-1">
									<h3 className="font-semibold">{item.label}</h3>
									<p className="text-md">
										{item.type === "date"
											? convertDateToLocalString(personLocal[item.name], true)
											: personLocal[item.name]}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			))}
			<h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
				Fichiers associés
			</h2>
			<RelatedFiles
				addDeleteFeature={false}
				person={personLocal}
				personDiplomaticCardIdInputName={personDiplomaticCardIdInputName}
				personDiplomaticCardFilesPropName={personDiplomaticCardFilesPropName}
				prefixFileKey={prefixFileKey}
			/>
			<SubmitFormDuplicata
				id={personDuplicate.id}
				renewAction={onDuplicateAction}
				backLink={backLink}
			/>
		</div>
	);
}
