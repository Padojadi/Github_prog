import { fetchOtherDependantCardById } from "@/lib/actions/diplomaticCards/otherDependants";
import React from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const MyPDFPreview = dynamic(() => import("./myPDFPreview"), { ssr: false });

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchOtherDependantCardById(id);
  const holder = res.data;
  // Check if the user can edit the form
  const canPrint =
    holder?.documentStage &&
    (holder?.documentStage === "confirmed" ||
      holder?.documentStage === "printed");

  if (canPrint === false) {
    redirect("/panel/diplomatic/other-dependants");
  }
  return <MyPDFPreview holder={holder} />;
}
