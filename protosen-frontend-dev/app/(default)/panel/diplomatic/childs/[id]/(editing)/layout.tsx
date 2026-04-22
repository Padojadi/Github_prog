import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";
import { fetchChildCardById } from "@/lib/actions/diplomaticCards/childs";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      personDiplomaticCardFilesPropName={"childDCFiles"}
      isEdit={true}
      params={params}
      mainLink="/panel/diplomatic/childs"
      fetchDataById={fetchChildCardById}
    >
      {children}
    </LayoutSubmitProcess>
  );
}
