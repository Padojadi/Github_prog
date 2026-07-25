import ReviewDataRenew from "@/features/diplomatic-cards/renew/components/review-data-renew";
import {
	fetchOtherStaffCardById,
	fetchRenewOtherStaffCardById,
	submitRenewOtherStaffDC,
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
		fetchRenewOtherStaffCardById(id),
		fetchOtherStaffCardById(previousCardId),
	]);

	if (res[0].status === "error") {
		throw new Error(res[0].message);
	}

	const otherStaff = res[1].data;
	const otherStaffRenew = res[0].data;

	return (
		<ReviewDataRenew
			formSections={formSections}
			person={otherStaff}
			personRenew={otherStaffRenew}
			personDiplomaticCardIdInputName={"otherStaffDCId"}
			personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
			prefixFileKey="cartesDiplomatique"
			onRenewAction={submitRenewOtherStaffDC}
			backLink={"/panel/diplomatic/other-staff"}
		/>
	);
}
