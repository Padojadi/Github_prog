import LayoutSubmitProcess from "@/components/layout/layoutSubmitProcess";

export default function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <LayoutSubmitProcess
      params={params}
      mainLink="/panel/diplomatic/other-dependants"
    >
      {children}
    </LayoutSubmitProcess>
  );
}
