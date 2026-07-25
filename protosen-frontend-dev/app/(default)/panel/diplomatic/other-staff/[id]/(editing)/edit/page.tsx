import { fetchOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";
import Form from "./Form";
import { fetchHoldersCardsAll } from "@/lib/actions/diplomaticCards/holders";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherStaffCardById(id);
  const resHolders = await fetchHoldersCardsAll();
  const holders = resHolders?.data?.rows;

  return <Form initialValues={res.data || {}} holders={holders} />;
}
