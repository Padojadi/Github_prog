import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteSpouseDCFiles,
	fetchRenewSpouseCardById,
	fetchSpouseCardById,
	updateSpouseDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/spouses";
import { spouseFilesFormMeta } from "./formMeta";

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
		fetchRenewSpouseCardById(id),
		fetchSpouseCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const spouse = res[1].data;
	const spouseRenew = res[0].data;

	return (
		<FilesFormRenew
			deleteFiles={deleteSpouseDCFiles}
			person={spouse}
			renewData={spouseRenew}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/spouses/renew"}
			updatePersonDiplomaticCardFiles={updateSpouseDiplomaticCardFiles}
			personFilesFormMeta={spouseFilesFormMeta}
			personDiplomaticCardIdInputName={"spouseDCId"}
			personDiplomaticCardFilesPropName={"spouseDCFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
