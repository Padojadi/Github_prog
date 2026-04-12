import { fetchSpouseCardById, fetchDuplicateSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
		const res = await Promise.all([fetchDuplicateSpouseCardById(id), fetchSpouseCardById(previousCardId)]);
	const spouseDuplicate = res[0].data;
	const spouse = res[1].data;
	return <TabLayout spouse={spouse} spouseDuplicate={spouseDuplicate} />;
}

