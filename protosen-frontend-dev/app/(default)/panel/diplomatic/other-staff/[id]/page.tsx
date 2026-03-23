import { fetchOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchOtherStaffCardById(id);
  const otherStaff = res.data;

  return (
    <>
      <TabLayout otherStaff={otherStaff} />
    </>
  );
}
