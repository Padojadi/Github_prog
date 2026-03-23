import { fetchChildCardById, fetchRenewChildCardById } from "@/lib/actions/diplomaticCards/childs";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewChildCardById(id), fetchChildCardById(previousCardId)]);
	const childRenew = res[0].data;
	const child = res[1].data;
	return <TabLayout child={child} childRenew={childRenew} />;
}

