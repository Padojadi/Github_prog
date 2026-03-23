import { fetchHolderCardById, fetchRenewHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewHolderCardById(id), fetchHolderCardById(previousCardId)]);
	const holderRenew = res[0].data;
	const holder = res[1].data;
	return <TabLayout holder={holder} holderRenew={holderRenew} />;
}
