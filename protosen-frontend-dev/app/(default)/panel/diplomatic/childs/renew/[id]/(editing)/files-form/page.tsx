import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteChildDCFiles,
	fetchChildCardById,
	fetchRenewChildCardById,
	updateChildDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/childs";
import { childFilesFormMeta } from "./formMeta";

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
		fetchRenewChildCardById(id),
		fetchChildCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	return (
		<FilesFormRenew
			deleteFiles={deleteChildDCFiles}
			person={res[1].data}
			renewData={res[0].data}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/childs/renew"}
			updatePersonDiplomaticCardFiles={updateChildDiplomaticCardFiles}
			personFilesFormMeta={childFilesFormMeta}
			personDiplomaticCardIdInputName={"childDCId"}
			personDiplomaticCardFilesPropName={"childDCFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
