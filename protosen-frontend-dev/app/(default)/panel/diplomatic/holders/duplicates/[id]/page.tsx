import {
	fetchDuplicateHolderCardById,
	fetchHolderCardById,
} from "@/lib/actions/diplomaticCards/holders";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchDuplicateHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);
	const holder = res[1].data;
	const holderDuplicata = res[0].data;

	return <TabLayout holder={holder} holderDuplicata={holderDuplicata} />;
}
