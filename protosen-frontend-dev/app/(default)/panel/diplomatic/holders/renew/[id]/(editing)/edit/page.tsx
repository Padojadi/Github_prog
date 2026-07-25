import { fetchRenewHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import Form from "./Form";

export default async function Page({ params }: { params: any }) {
	const { id } = params;
	const res = await fetchRenewHolderCardById(id);

	return <Form initialValues={res.data || {}} />;
}
