import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateChildCardById } from "@/lib/actions/diplomaticCards/childs";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"childDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/childs"
			fetchDataById={fetchDuplicateChildCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}
