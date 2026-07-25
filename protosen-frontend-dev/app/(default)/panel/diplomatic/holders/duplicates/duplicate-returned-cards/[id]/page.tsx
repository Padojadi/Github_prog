import { fetchHolderCardById, fetchDuplicateHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
		const res = await Promise.all([fetchDuplicateHolderCardById(id), fetchHolderCardById(previousCardId)]);
	const holderDuplicate = res[0].data;
	const holder = res[1].data;
	return <TabLayout holder={holder} holderDuplicate={holderDuplicate} />;
}
