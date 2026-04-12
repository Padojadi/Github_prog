import { fetchHoldersCardsAll } from "@/lib/actions/diplomaticCards/holders";
import { fetchRenewSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import Form from "./Form";

export default async function Page({ params }: { params: any }) {
	const { id } = params;
	const res = await fetchRenewSpouseCardById(id);
	const resHolders = await fetchHoldersCardsAll();
	const holders = resHolders?.data?.rows;

	return <Form initialValues={res.data || {}} holders={holders} />;
}
