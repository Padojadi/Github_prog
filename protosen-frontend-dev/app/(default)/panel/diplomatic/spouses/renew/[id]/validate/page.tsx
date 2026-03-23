import ValidateFormRenewSpouse from "@/features/diplomatic-cards/renew/components/spouse/validate-form-renew";
import {
	fetchRenewSpouseCardById,
	fetchSpouseCardById,
	validateRenewSpouseDC,
} from "@/lib/actions/diplomaticCards/spouses";

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

	const spouse = res[1].data;
	const spouseRenew = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${spouse?.previousCard?.firstName} ${spouse?.previousCard?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewSpouse
					backLink="/panel/diplomatic/spouses"
					person={spouse}
					renewData={spouseRenew}
					validateData={validateRenewSpouseDC}
				/>
			</div>
		</div>
	);
}
