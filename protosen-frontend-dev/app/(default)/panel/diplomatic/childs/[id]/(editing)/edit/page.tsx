import { fetchChildCardById } from "@/lib/actions/diplomaticCards/childs";
import Form from "./Form";
import { fetchHoldersCardsAll } from "@/lib/actions/diplomaticCards/holders";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchChildCardById(id);
  const resHolders = await fetchHoldersCardsAll();
  const holders = resHolders?.data?.rows;

  return <Form initialValues={res.data || {}} holders={holders} />;
}
