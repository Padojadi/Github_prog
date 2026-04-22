import { fetchOtherDependantCardById, fetchRenewOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: { params: any, searchParams: { previousCard:string } }) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewOtherDependantCardById(id), fetchOtherDependantCardById(previousCardId)]);
	const otherDependant = res[1].data;
	const otherDependantRenew = res[0].data;

	return <TabLayout otherDependant={otherDependant} otherDependantRenew={otherDependantRenew} />;
}
