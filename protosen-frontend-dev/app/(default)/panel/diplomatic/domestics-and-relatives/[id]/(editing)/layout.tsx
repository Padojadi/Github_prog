import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";
import { fetchDomesticAndRelativeCardById } from "@/lib/actions/diplomaticCards/domesticAndRelatives";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
      isEdit={true}
      params={params}
      mainLink="/panel/diplomatic/domestics-and-relatives"
      fetchDataById={fetchDomesticAndRelativeCardById}
    >
      {children}
    </LayoutSubmitProcess>
  );
}
