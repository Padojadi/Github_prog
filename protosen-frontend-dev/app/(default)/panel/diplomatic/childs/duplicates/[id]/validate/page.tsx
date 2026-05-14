import ValidateFormDuplicataChild from "@/features/diplomatic-cards/duplicata/child/validate-form-duplicata";
import {
	fetchChildCardById,
	fetchDuplicateChildCardById,
	validateDuplicateChildDC,
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
		fetchDuplicateChildCardById(id),
		fetchChildCardById(previousCardId),
	]);

	const child = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${child?.firstName} ${child?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataChild
					backLink="/panel/diplomatic/childs"
					person={child}
					duplicataData={duplicateData}
					validateData={validateDuplicateChildDC}
				/>
			</div>
		</div>
	);
}
