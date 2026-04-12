import { fetchSpouseCardById, fetchRenewSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewSpouseCardById(id), fetchSpouseCardById(previousCardId)]);
	const spouseRenew = res[0].data;
	const spouse = res[1].data;
	return <TabLayout spouse={spouse} spouseRenew={spouseRenew} />;
}

