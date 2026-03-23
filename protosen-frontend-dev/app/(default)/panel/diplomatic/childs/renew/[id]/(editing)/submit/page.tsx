import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchChildCardById,
	fetchRenewChildCardById,
	submitRenewChildDC,
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
		fetchRenewChildCardById(id),
		fetchChildCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={res[1].data}
			personRenew={res[0].data}
			personDiplomaticCardIdInputName={"childDCId"}
			personDiplomaticCardFilesPropName={"childDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewChildDC}
			backLink={"/panel/diplomatic/childs"}
		/>
	);
}
