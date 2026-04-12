import ReviewDataDuplicata from "@/features/diplomatic-cards/duplicata/components/review-data-duplicata";
import {
	fetchDuplicateChildCardById,
	fetchChildCardById,
	submitDuplicateChildDC,
} from "@/lib/actions/diplomaticCards/childs";
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
		fetchChildCardById(previousCardId),
		fetchDuplicateChildCardById(id),
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
			personDiplomaticCardIdInputName={"childDiplomaticCardId"}
			personDiplomaticCardFilesPropName={"childDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onDuplicateAction={submitDuplicateChildDC}
			backLink={"/panel/diplomatic/childs"}
		/>
	);
}
