import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchRenewSpouseCardById,
	fetchSpouseCardById,
	submitRenewSpouseDC,
} from "@/lib/actions/diplomaticCards/spouses";
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
		fetchRenewSpouseCardById(id),
		fetchSpouseCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const spouse = res[1].data;
	const spouseRenew = res[0].data;

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={spouse}
			personRenew={spouseRenew}
			personDiplomaticCardIdInputName={"spouseDCId"}
			personDiplomaticCardFilesPropName={"spouseDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewSpouseDC}
			backLink={"/panel/diplomatic/spouses"}
		/>
	);
}
