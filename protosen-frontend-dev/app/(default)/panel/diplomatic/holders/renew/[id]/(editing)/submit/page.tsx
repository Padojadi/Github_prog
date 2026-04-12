import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchHolderCardById,
	fetchRenewHolderCardById,
	submitRenewHolderDC,
} from "@/lib/actions/diplomaticCards/holders";
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
		fetchRenewHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}
	const person = res[1].data;
	const renewData = res[0].data;

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={person}
			personRenew={renewData}
			personDiplomaticCardIdInputName={"ownerDiplomaticCardId"}
			personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewHolderDC}
			backLink={"/panel/diplomatic/holders"}
		/>
	);
}
