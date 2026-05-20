import {
	fetchDuplicateDomesticAndRelativeCardById,
	fetchDomesticAndRelativeCardById,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchDuplicateDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);
	const domesticAndRelative = res[1].data;
	const domesticAndRelativeDuplicata = res[0].data;

	return <TabLayout domesticAndRelative={domesticAndRelative} domesticAndRelativeDuplicata={domesticAndRelativeDuplicata} />;
}

