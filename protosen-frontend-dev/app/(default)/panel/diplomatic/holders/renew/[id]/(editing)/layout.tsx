import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewHolderCardById } from "@/lib/actions/diplomaticCards/holders";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/holders"
			fetchDataById={fetchRenewHolderCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
