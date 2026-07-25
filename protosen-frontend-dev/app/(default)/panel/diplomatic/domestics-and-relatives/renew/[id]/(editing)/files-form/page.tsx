import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteDomesticAndRelativeDCFiles,
	fetchDomesticAndRelativeCardById,
	fetchRenewDomesticAndRelativeCardById,
	updateDomesticAndRelativeDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { domesticAndRelativeFilesFormMeta } from "./formMeta";

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
		fetchRenewDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	return (
		<FilesFormRenew
			deleteFiles={deleteDomesticAndRelativeDCFiles}
			person={res[1].data}
			renewData={res[0].data}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/domestics-and-relatives/renew"}
			updatePersonDiplomaticCardFiles={
				updateDomesticAndRelativeDiplomaticCardFiles
			}
			personFilesFormMeta={domesticAndRelativeFilesFormMeta}
			personDiplomaticCardIdInputName={"domesticAndRelativeDCId"}
			personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
