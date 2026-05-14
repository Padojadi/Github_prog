import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewChildCardById } from "@/lib/actions/diplomaticCards/childs";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"childDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/childs"
			fetchDataById={fetchRenewChildCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
