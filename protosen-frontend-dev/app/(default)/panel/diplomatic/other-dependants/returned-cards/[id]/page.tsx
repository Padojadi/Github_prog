import { fetchOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
	const { id } = params;
	const res = await fetchOtherDependantCardById(id);
	const otherDependant = res.data;
	return <TabLayout otherDependant={otherDependant} />;
}

