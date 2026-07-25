import { fetchHoldersCardsAll } from "@/lib/actions/diplomaticCards/holders";
import Form from "./Form";

export default async function Page() {
  const resHolders = await fetchHoldersCardsAll();
  const holders = resHolders?.data?.rows;

  return <Form holders={holders} />;
}
