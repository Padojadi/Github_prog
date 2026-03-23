import {
	fetchChildCardById,
	fetchDuplicateChildCardById,
} from "@/lib/actions/diplomaticCards/childs";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchDuplicateChildCardById(id),
		fetchChildCardById(previousCardId),
	]);
	const child = res[1].data;
	const childDuplicata = res[0].data;

	return <TabLayout child={child} childDuplicata={childDuplicata} />;
}
