import ValidateFormRenewHolder from "@/features/diplomatic-cards/renew/components/holder/validate-form-renew";
import {
	fetchHolderCardById,
	fetchRenewHolderCardById,
	validateRenewHolderDC,
} from "@/lib/actions/diplomaticCards/holders";

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

	const holder = res[1].data;
	const renewData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${holder?.firstName} ${holder?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewHolder
					backLink="/panel/diplomatic/holders"
					person={holder}
					renewData={renewData}
					validateData={validateRenewHolderDC}
				/>
			</div>
		</div>
	);
}
