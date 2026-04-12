import { fetchDomesticAndRelativeCardById, fetchRenewDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: { params: any, searchParams: { previousCard:string } }) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewDomesticAndRelativeCardById(id), fetchDomesticAndRelativeCardById(previousCardId)]);
	const domesticAndRelative = res[1].data;
	const domesticAndRelativeRenew = res[0].data;

	return <TabLayout domesticAndRelative={domesticAndRelative} domesticAndRelativeRenew={domesticAndRelativeRenew} />;
}
