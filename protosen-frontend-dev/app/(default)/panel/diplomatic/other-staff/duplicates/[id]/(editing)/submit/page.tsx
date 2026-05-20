import ReviewDataDuplicata from "@/features/diplomatic-cards/duplicata/components/review-data-duplicata";
import {
	fetchDuplicateOtherStaffCardById,
	fetchOtherStaffCardById,
	submitDuplicateOtherStaffDC,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import { formSections } from "../../../../formMeta";

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
		fetchOtherStaffCardById(previousCardId),
		fetchDuplicateOtherStaffCardById(id),
	]);

	// if (res[0].status === "error") {
	// 	throw new Error(res[0].message);
	// }
	const person = res[0].data;
	const personDuplicate = res[1].data;

	return (
		<ReviewDataDuplicata
			formSections={formSections}
			person={person}
			personDuplicate={personDuplicate}
			personDiplomaticCardIdInputName={"otherStaffDCId"}
			personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onDuplicateAction={submitDuplicateOtherStaffDC}
			backLink={"/panel/diplomatic/other-staff"}
		/>
	);
}

