import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";
import { fetchSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      personDiplomaticCardFilesPropName={"spouseDCFiles"}
      isEdit={true}
      params={params}
      mainLink="/panel/diplomatic/spouses"
      fetchDataById={fetchSpouseCardById}
    >
      {children}
    </LayoutSubmitProcess>
  );
}
