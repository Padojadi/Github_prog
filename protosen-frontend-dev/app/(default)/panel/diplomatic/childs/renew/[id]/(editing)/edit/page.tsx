import { fetchRenewChildCardById } from "@/lib/actions/diplomaticCards/childs";
import { fetchHoldersCardsAll } from "@/lib/actions/diplomaticCards/holders";
import Form from "./Form";

export default async function Page({ params }: { params: any }) {
	const { id } = params;
	const res = await fetchRenewChildCardById(id);
	const resHolders = await fetchHoldersCardsAll();
	const holders = resHolders?.data?.rows;

	return <Form initialValues={res.data || {}} holders={holders} />;
}
