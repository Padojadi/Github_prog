import {
	fetchDuplicateOtherDependantCardById,
	fetchOtherDependantCardById,
} from "@/lib/actions/diplomaticCards/otherDependants";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchDuplicateOtherDependantCardById(id),
		fetchOtherDependantCardById(previousCardId),
	]);
	const otherDependant = res[1].data;
	const otherDependantDuplicata = res[0].data;

	return <TabLayout otherDependant={otherDependant} otherDependantDuplicata={otherDependantDuplicata} />;
}

