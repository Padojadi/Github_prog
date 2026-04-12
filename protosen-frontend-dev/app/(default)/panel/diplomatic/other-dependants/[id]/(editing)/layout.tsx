import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";
import { fetchOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
      isEdit={true}
      params={params}
      mainLink="/panel/diplomatic/other-dependants"
      fetchDataById={fetchOtherDependantCardById}
    >
      {children}
    </LayoutSubmitProcess>
  );
}
