import React from "react";
import {
  createChildDuplicateNewRequest,
  fetchChildCardById,
  submitChildDC,
  submitDuplicateChildDC,
  submitRenewChildDC,
} from "@/lib/actions/diplomaticCards/childs";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchChildCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.childDCFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/childs");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"childDCId"}
      personDiplomaticCardFilesPropName={"childDCFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitChildDC}
      onRenewAction={submitRenewChildDC}
      onDuplicateAction={submitDuplicateChildDC}
      onCreateDuplicateAction={createChildDuplicateNewRequest}
      backLink={"/panel/diplomatic/childs"}
    />
  );
}
