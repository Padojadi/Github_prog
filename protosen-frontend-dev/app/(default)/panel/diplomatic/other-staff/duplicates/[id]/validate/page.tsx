import ValidateFormDuplicataOtherStaff from "@/features/diplomatic-cards/duplicata/other-staff/validate-form-duplicata";
import {
	fetchDuplicateOtherStaffCardById,
	fetchOtherStaffCardById,
	validateDuplicateOtherStaffDC,
} from "@/lib/actions/diplomaticCards/otherStaffs";

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
		fetchDuplicateOtherStaffCardById(id),
		fetchOtherStaffCardById(previousCardId),
	]);

	const otherStaff = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${otherStaff?.firstName} ${otherStaff?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataOtherStaff
					backLink="/panel/diplomatic/other-staff"
					person={otherStaff}
					duplicataData={duplicateData}
					validateData={validateDuplicateOtherStaffDC}
				/>
			</div>
		</div>
	);
}

