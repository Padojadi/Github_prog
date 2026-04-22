import { fetchChildCardById } from "@/lib/actions/diplomaticCards/childs";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchChildCardById(id);
  const child = res.data;

  return (
    <>
      <TabLayout child={child} />
    </>
  );
}
