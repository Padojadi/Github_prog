import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchDomesticAndRelativeCardById,
	fetchRenewDomesticAndRelativeCardById,
	submitRenewDomesticAndRelativeDC,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
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
		fetchRenewDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={res[1].data}
			personRenew={res[0].data}
			personDiplomaticCardIdInputName={"domesticAndRelativeDCId"}
			personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewDomesticAndRelativeDC}
			backLink={"/panel/diplomatic/domestics-and-relatives"}
		/>
	);
}
