import { fetchDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import TabLayout from "./tabLayout";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchDomesticAndRelativeCardById(id);
  const domesticAndRelative = res.data;

  return (
    <>
      <TabLayout domesticAndRelative={domesticAndRelative} />
    </>
  );
}
