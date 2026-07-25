import ValidateFormDuplicataSpouse from "@/features/diplomatic-cards/duplicata/spouse/validate-form-duplicata";
import {
	fetchDuplicateSpouseCardById,
	fetchSpouseCardById,
	validateDuplicateSpouseDC,
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
		fetchDuplicateSpouseCardById(id),
		fetchSpouseCardById(previousCardId),
	]);

	const spouse = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${spouse?.firstName} ${spouse?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataSpouse
					backLink="/panel/diplomatic/spouses"
					person={spouse}
					duplicataData={duplicateData}
					validateData={validateDuplicateSpouseDC}
				/>
			</div>
		</div>
	);
}

