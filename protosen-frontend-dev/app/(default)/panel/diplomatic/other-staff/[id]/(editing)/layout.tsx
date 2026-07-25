import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";
import { fetchOtherStaffCardById } from "@/lib/actions/diplomaticCards/otherStaffs";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
      isEdit={true}
      params={params}
      mainLink="/panel/diplomatic/other-staff"
      fetchDataById={fetchOtherStaffCardById}
    >
      {children}
    </LayoutSubmitProcess>
  );
}
