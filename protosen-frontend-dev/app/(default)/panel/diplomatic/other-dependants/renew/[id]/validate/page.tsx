import ValidateFormRenewOtherDependant from "@/features/diplomatic-cards/renew/components/other-dependant/validate-form-renew";
import {
	fetchOtherDependantCardById,
	fetchRenewOtherDependantCardById,
	validateRenewOtherDependantDC,
} from "@/lib/actions/diplomaticCards/otherDependants";

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
	const otherDependant = res[1].data;
	const otherDependantRenew = res[0].data;
	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${otherDependant?.previousCard?.firstName} ${otherDependant?.previousCard?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewOtherDependant
					backLink="/panel/diplomatic/other-dependants"
					person={otherDependant}
					renewData={otherDependantRenew}
					validateData={validateRenewOtherDependantDC}
				/>
			</div>
		</div>
	);
}
