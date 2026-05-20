import FilesFormRenew from "@/features/diplomatic-cards/renew/components/files-form-renew";
import {
	deleteOtherStaffDCFiles,
	fetchOtherStaffCardById,
	fetchRenewOtherStaffCardById,
	updateOtherStaffDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import { otherStaffFilesFormMeta } from "./formMeta";

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
		fetchRenewOtherStaffCardById(id),
		fetchOtherStaffCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const otherStaff = res[1].data;
	const otherStaffRenew = res[0].data;

	return (
		<FilesFormRenew
			deleteFiles={deleteOtherStaffDCFiles}
			person={otherStaff}
			renewData={otherStaffRenew}
			title="Formulaire d'association de fichiers à une demande"
			backLink={"/panel/diplomatic/other-staff/renew"}
			updatePersonDiplomaticCardFiles={updateOtherStaffDiplomaticCardFiles}
			personFilesFormMeta={otherStaffFilesFormMeta}
			personDiplomaticCardIdInputName={"otherStaffDCId"}
			personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
			prefixFileKey="cartesDiplomatique"
		/>
	);
}
