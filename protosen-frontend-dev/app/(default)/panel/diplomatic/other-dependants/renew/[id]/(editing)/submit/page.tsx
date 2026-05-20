import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchOtherDependantCardById,
	fetchRenewOtherDependantCardById,
	submitRenewOtherDependantDC,
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
		fetchRenewOtherDependantCardById(id),
		fetchOtherDependantCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const otherDependant = res[1].data;
	const otherDependantRenew = res[0].data;

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={otherDependant}
			personRenew={otherDependantRenew}
			personDiplomaticCardIdInputName={"otherDependantDCId"}
			personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewOtherDependantDC}
			backLink={"/panel/diplomatic/other-dependants"}
		/>
	);
}
