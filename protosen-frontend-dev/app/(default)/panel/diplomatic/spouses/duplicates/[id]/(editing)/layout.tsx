import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"spouseDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/spouses"
			fetchDataById={fetchDuplicateSpouseCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}

