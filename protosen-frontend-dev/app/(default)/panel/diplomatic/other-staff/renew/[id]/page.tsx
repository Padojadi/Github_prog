import { fetchOtherStaffCardById, fetchRenewOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: { params: any, searchParams: { previousCard:string } }) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewOtherStaffCardById(id), fetchOtherStaffCardById(previousCardId)]);

	const otherStaff = res[1].data
	const otherStaffRenew = res[0].data

	return <TabLayout otherStaff={otherStaff} otherStaffRenew={otherStaffRenew} />;
}
