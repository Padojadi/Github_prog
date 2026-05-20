import { fetchSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchSpouseCardById(id);
  const spouse = res.data;

  return (
    <>
      <TabLayout spouse={spouse} />
    </>
  );
}
