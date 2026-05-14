import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import Form from "./Form";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const holder = await fetchHolderCardById(id);

  return <Form initialValues={holder.data || {}} />;
}
