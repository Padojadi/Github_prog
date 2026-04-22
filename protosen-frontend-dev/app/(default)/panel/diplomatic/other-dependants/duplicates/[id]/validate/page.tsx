import ValidateFormDuplicataOtherDependant from "@/features/diplomatic-cards/duplicata/other-dependant/validate-form-duplicata";
import {
	fetchDuplicateOtherDependantCardById,
	fetchOtherDependantCardById,
	validateDuplicateOtherDependantDC,
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
		fetchDuplicateOtherDependantCardById(id),
		fetchOtherDependantCardById(previousCardId),
	]);

	const otherDependant = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${otherDependant?.firstName} ${otherDependant?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataOtherDependant
					backLink="/panel/diplomatic/other-dependants"
					person={otherDependant}
					duplicataData={duplicateData}
					validateData={validateDuplicateOtherDependantDC}
				/>
			</div>
		</div>
	);
}

