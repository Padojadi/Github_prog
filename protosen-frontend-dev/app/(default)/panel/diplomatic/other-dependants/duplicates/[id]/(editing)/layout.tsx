import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/other-dependants"
			fetchDataById={fetchDuplicateOtherDependantCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}

