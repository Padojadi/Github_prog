import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateHolderCardById } from "@/lib/actions/diplomaticCards/holders";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/holders"
			fetchDataById={fetchDuplicateHolderCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}
