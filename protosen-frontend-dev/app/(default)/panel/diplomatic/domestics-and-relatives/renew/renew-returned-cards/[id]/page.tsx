import { fetchDomesticAndRelativeCardById, fetchRenewDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewDomesticAndRelativeCardById(id), fetchDomesticAndRelativeCardById(previousCardId)]);
	const domesticAndRelativeRenew = res[0].data;
	const domesticAndRelative = res[1].data;
	return <TabLayout domesticAndRelative={domesticAndRelative} domesticAndRelativeRenew={domesticAndRelativeRenew} />;
}

