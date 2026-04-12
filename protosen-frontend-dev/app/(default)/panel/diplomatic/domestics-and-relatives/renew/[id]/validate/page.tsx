import ValidateFormRenewDomesticAndRelative from "@/features/diplomatic-cards/renew/components/domestic-and-relative/validate-form-renew";
import {
	fetchDomesticAndRelativeCardById,
	fetchRenewDomesticAndRelativeCardById,
	validateRenewDomesticAndRelativeDC,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";

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
	const domesticAndRelative = res[1].data;
	const domesticAndRelativeRenew = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${domesticAndRelative?.previousCard?.firstName} ${domesticAndRelative?.previousCard?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewDomesticAndRelative
					backLink="/panel/diplomatic/domestics-and-relatives"
					person={domesticAndRelative}
					renewData={domesticAndRelativeRenew}
					validateData={validateRenewDomesticAndRelativeDC}
				/>
			</div>
		</div>
	);
}
