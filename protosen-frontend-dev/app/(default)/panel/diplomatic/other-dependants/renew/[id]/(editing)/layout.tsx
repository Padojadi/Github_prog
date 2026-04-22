import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/other-dependants"
			fetchDataById={fetchRenewOtherDependantCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
