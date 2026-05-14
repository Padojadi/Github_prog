import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/other-staff"
			fetchDataById={fetchRenewOtherStaffCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
