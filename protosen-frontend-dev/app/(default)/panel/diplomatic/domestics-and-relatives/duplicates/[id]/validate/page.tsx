import ValidateFormDuplicataDomesticAndRelative from "@/features/diplomatic-cards/duplicata/domestic-and-relative/validate-form-duplicata";
import {
	fetchDuplicateDomesticAndRelativeCardById,
	fetchDomesticAndRelativeCardById,
	validateDuplicateDomesticAndRelativeDC,
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
		fetchDuplicateDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);

	const domesticAndRelative = res[1].data;
	const duplicateData = res[0].data;

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl pb-4 text-center">
				<span className="font-semibold">Nom : </span>
				{`${domesticAndRelative?.firstName} ${domesticAndRelative?.lastName}`}
			</h1>
			<hr className="pb-4" />
			<div className="max-w-4xl mx-auto">
				<ValidateFormDuplicataDomesticAndRelative
					backLink="/panel/diplomatic/domestics-and-relatives"
					person={domesticAndRelative}
					duplicataData={duplicateData}
					validateData={validateDuplicateDomesticAndRelativeDC}
				/>
			</div>
		</div>
	);
}

