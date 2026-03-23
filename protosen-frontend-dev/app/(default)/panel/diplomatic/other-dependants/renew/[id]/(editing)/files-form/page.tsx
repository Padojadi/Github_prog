import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteOtherDependantDCFiles,
	fetchOtherDependantCardById,
	fetchRenewOtherDependantCardById,
	updateOtherDependantDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/otherDependants";
import { otherDependantFilesFormMeta } from "./formMeta";

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
		fetchRenewOtherDependantCardById(id),
		fetchOtherDependantCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const otherDependant = res[1].data;
	const otherDependantRenew = res[0].data;

	return (
		<FilesFormRenew
			deleteFiles={deleteOtherDependantDCFiles}
			person={otherDependant}
			renewData={otherDependantRenew}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/other-dependants/renew"}
			updatePersonDiplomaticCardFiles={updateOtherDependantDiplomaticCardFiles}
			personFilesFormMeta={otherDependantFilesFormMeta}
			personDiplomaticCardIdInputName={"otherDependantDCId"}
			personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
