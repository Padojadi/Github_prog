import ValidateFormDuplicataHolder from "@/features/diplomatic-cards/duplicata/holder/validate-form-duplicata";
import {
	fetchDuplicateHolderCardById,
	fetchHolderCardById,
	validateDuplicateHolderDC,
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
		fetchDuplicateHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);

	const holder = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${holder?.firstName} ${holder?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataHolder
					backLink="/panel/diplomatic/holders"
					person={holder}
					duplicataData={duplicateData}
					validateData={validateDuplicateHolderDC}
				/>
			</div>
		</div>
	);
}
