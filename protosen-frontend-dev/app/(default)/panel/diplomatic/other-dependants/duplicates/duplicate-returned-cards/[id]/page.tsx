import { fetchOtherDependantCardById, fetchDuplicateOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
		const res = await Promise.all([fetchDuplicateOtherDependantCardById(id), fetchOtherDependantCardById(previousCardId)]);
	const otherDependantDuplicate = res[0].data;
	const otherDependant = res[1].data;
	return <TabLayout otherDependant={otherDependant} otherDependantDuplicate={otherDependantDuplicate} />;
}

