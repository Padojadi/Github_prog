import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/domestics-and-relatives"
			fetchDataById={fetchDuplicateDomesticAndRelativeCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}

