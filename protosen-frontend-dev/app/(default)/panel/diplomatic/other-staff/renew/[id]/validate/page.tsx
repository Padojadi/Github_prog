import ValidateFormRenewOtherStaff from "@/features/diplomatic-cards/renew/components/other-staff/validate-form-renew";
import {
	fetchOtherStaffCardById,
	fetchRenewOtherStaffCardById,
	validateRenewOtherStaffDC,
} from "@/lib/actions/diplomaticCards/otherStaffs";

export default async function Page({
	params,
	searchParams,
}: {
	params: any;
	searchParams: { previousCard: string };
}) {
	const { id } = params;
	const { previousCard: previousCardId } = searchParams;
	const res = await Promise.all([
		fetchRenewOtherStaffCardById(id),
		fetchOtherStaffCardById(previousCardId),
	]);
	const otherStaff = res[1].data;
	const renewData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${otherStaff?.firstName} ${otherStaff?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewOtherStaff
					backLink="/panel/diplomatic/other-staff"
					person={otherStaff}
					validateData={validateRenewOtherStaffDC}
					renewData={renewData}
				/>
			</div>
		</div>
	);
}
