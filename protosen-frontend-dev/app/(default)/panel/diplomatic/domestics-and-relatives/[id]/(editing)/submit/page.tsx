import React from "react";
import {
  fetchDomesticAndRelativeCardById,
  submitDomesticAndRelativeDC,
  submitDuplicateDomesticAndRelativeDC,
  submitRenewDomesticAndRelativeDC,
  createDomesticsAndRelativesDuplicateNewRequest,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchDomesticAndRelativeCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.domesticAndRelativeDCFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/domestics-and-relatives");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"domesticAndRelativeDCId"}
      personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitDomesticAndRelativeDC}
      onRenewAction={submitRenewDomesticAndRelativeDC}
      onDuplicateAction={submitDuplicateDomesticAndRelativeDC}
      onCreateDuplicateAction={createDomesticsAndRelativesDuplicateNewRequest}
      backLink={"/panel/diplomatic/domestics-and-relatives"}
    />
  );
}
