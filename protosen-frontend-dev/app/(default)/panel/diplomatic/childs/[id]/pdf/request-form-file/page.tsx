import { fetchChildCardById } from "@/lib/actions/diplomaticCards/childs";
import React from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const MyPDFPreview = dynamic(() => import("./myPDFPreview"), { ssr: false });

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchChildCardById(id);

  const holder = res.data;
  // Check if the user can edit the form
  const canPrint =
    holder?.documentStage &&
    (holder?.documentStage === "confirmed" ||
      holder?.documentStage === "printed");

  if (canPrint === false) {
    redirect("/panel/diplomatic/childs");
  }

  return <MyPDFPreview holder={holder} />;
}
