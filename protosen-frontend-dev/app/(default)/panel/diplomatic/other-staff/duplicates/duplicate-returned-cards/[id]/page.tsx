import { fetchOtherStaffCardById, fetchDuplicateOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";
import TabLayout from "./tabLayout";

export default async function Page({ params, searchParams }: any) {
	const { id } = params;
	const previousCardId = searchParams.previousCard
		const res = await Promise.all([fetchDuplicateOtherStaffCardById(id), fetchOtherStaffCardById(previousCardId)]);
	const otherStaffDuplicate = res[0].data;
	const otherStaff = res[1].data;
	return <TabLayout otherStaff={otherStaff} otherStaffDuplicate={otherStaffDuplicate} />;
}

