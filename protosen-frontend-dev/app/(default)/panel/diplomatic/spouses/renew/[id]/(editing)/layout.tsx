import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"spouseDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/spouses"
			fetchDataById={fetchRenewSpouseCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
