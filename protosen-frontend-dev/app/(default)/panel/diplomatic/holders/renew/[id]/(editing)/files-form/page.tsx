import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteHolderDCFiles,
	fetchHolderCardById,
	fetchRenewHolderCardById,
	updateHolderDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/holders";
import { holderFilesFormMeta } from "./formMeta";

export default async function Page({
	params,
	searchParams,
}: {
	params: any;
	searchParams: { previousCard: string };
}) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchRenewHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}
	const person = res[1].data;
	const renewData = res[0].data;

	return (
		<FilesFormRenew
			deleteFiles={deleteHolderDCFiles}
			person={person}
			renewData={renewData}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/holders/renew"}
			updatePersonDiplomaticCardFiles={updateHolderDiplomaticCardFiles}
			personFilesFormMeta={holderFilesFormMeta}
			personDiplomaticCardIdInputName={"ownerDiplomaticCardId"}
			personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
