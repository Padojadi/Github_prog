import ValidateFormRenewChild from "@/features/diplomatic-cards/renew/components/child/validate-form-renew";
import {
	fetchChildCardById,
	fetchRenewChildCardById,
	validateRenewChildDC,
} from "@/lib/actions/diplomaticCards/childs";

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
		fetchRenewChildCardById(id),
		fetchChildCardById(previousCardId),
	]);
	const child = res[1].data;
	const childRenew = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${child?.previousCard?.firstName} ${child?.previousCard?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormRenewChild
					backLink="/panel/diplomatic/childs"
					person={child}
					renewData={childRenew}
					validateData={validateRenewChildDC}
				/>
			</div>
		</div>
	);
}
