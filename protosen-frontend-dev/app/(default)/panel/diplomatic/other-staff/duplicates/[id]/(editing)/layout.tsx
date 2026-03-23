import LayoutSubmitProcessDuplicata from "@/components/layout/layout-submit-process-duplicata";
import { fetchDuplicateOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessDuplicata
			personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/other-staff"
			fetchDataById={fetchDuplicateOtherStaffCardById}
		>
			{children}
		</LayoutSubmitProcessDuplicata>
	);
}

