import ReviewDataDuplicata from "@/features/diplomatic-cards/duplicata/components/review-data-duplicata";
import {
	fetchDuplicateOtherDependantCardById,
	fetchOtherDependantCardById,
	submitDuplicateOtherDependantDC,
} from "@/lib/actions/diplomaticCards/otherDependants";
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
		fetchOtherDependantCardById(previousCardId),
		fetchDuplicateOtherDependantCardById(id),
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
			personDiplomaticCardIdInputName={"otherDependantDCId"}
			personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onDuplicateAction={submitDuplicateOtherDependantDC}
			backLink={"/panel/diplomatic/other-dependants"}
		/>
	);
}

