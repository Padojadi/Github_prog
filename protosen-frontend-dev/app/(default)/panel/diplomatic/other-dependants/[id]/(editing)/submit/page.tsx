import React from "react";
import {
  fetchOtherDependantCardById,
  submitDuplicateOtherDependantDC,
  submitOtherDependantDC,
  submitRenewOtherDependantDC,
  createOtherDependantDuplicateNewRequest
} from "@/lib/actions/diplomaticCards/otherDependants";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherDependantCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.otherDependantDCFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/other-dependants");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"otherDependantDCId"}
      personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitOtherDependantDC}
      onRenewAction={submitRenewOtherDependantDC}
      onDuplicateAction={submitDuplicateOtherDependantDC}
      onCreateDuplicateAction={createOtherDependantDuplicateNewRequest}
      backLink={"/panel/diplomatic/other-dependants"}
    />
  );
}
