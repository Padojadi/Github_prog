import LayoutSubmitProcessRenew from "@/components/layout/layout-submit-process-renew";
import { fetchRenewDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";

export default function DefaultLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<LayoutSubmitProcessRenew
			personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
			isEdit={true}
			params={params}
			mainLink="/panel/diplomatic/domestics-and-relatives"
			fetchDataById={fetchRenewDomesticAndRelativeCardById}
		>
			{children}
		</LayoutSubmitProcessRenew>
	);
}
