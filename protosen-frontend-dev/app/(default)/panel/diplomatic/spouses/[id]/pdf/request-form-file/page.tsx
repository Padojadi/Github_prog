import { fetchSpouseCardById } from "@/lib/actions/diplomaticCards/spouses";
import React from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";

const MyPDFPreview = dynamic(() => import("./myPDFPreview"), { ssr: false });

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchSpouseCardById(id);
  let holder = res.data;
  // Check if the user can edit the form
  const canPrint =
    holder?.documentStage &&
    (holder?.documentStage === "confirmed" ||
      holder?.documentStage === "printed");

  // if (holder?.ownerDiplomaticCardId) {
  //   const response = await fetchHolderCardById(holder?.ownerDiplomaticCardId);
  //   let person = response.data;
  //   holder = {
  //     ...holder,
  //     holderTitle: person?.title,
  //     holderFileNumber: person?.id,
  //     holderFirstName: person?.firstName,
  //     holderLastName: person?.lastName,
  //     holderCitizenship: person?.citizenship,
  //   };
  //   console.log(person)
  // }

  if (canPrint === false) {
    redirect("/panel/diplomatic/spouses");
  }
  return <MyPDFPreview holder={holder} />;
}
