import { fetchRenewSpouseCardById, fetchSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: { params: any, searchParams: { previousCard:string } }) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewSpouseCardById(id), fetchSpouseCardById(previousCardId)]);

	const spouse = res[1].data
	const spouseRenew = res[0].data

	return <TabLayout spouse={spouse} spouseRenew={spouseRenew} />;
}
