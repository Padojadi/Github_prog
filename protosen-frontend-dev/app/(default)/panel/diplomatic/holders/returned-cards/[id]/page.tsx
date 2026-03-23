import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
	const { id } = params;
	const res = await fetchHolderCardById(id);
	const holder = res.data;
	return <TabLayout holder={holder} />;
}
