import {
	fetchChildCardById,
	fetchRenewChildCardById,
} from "@/lib/actions/diplomaticCards/childs";
import TabLayout from "./tabLayout";

export default async function Page({
	params,
	searchParams,
}: {
	params: any;
	searchParams: { previousCard: string };
}) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchRenewChildCardById(id),
		fetchChildCardById(previousCardId),
	]);
	const child = res[1].data;
	const childRenew = res[0].data;

	return <TabLayout child={child} childRenew={childRenew} />;
}
