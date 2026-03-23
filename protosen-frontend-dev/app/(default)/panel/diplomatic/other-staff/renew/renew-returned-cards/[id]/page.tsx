import { fetchOtherStaffCardById, fetchRenewOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
	const res = await Promise.all([fetchRenewOtherStaffCardById(id), fetchOtherStaffCardById(previousCardId)]);
	const otherStaffRenew = res[0].data;
	const otherStaff = res[1].data;
	return <TabLayout otherStaff={otherStaff} otherStaffRenew={otherStaffRenew} />;
}

