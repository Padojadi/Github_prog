import React from "react";
import {
  fetchSpouseCardById,
  submitDuplicateSpouseDC,
  submitRenewSpouseDC,
  submitSpouseDC,
  createSpouseDuplicateNewRequest,
} from "@/lib/actions/diplomaticCards/spouses";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchSpouseCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.spouseDCFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/spouses");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"spouseDCId"}
      personDiplomaticCardFilesPropName={"spouseDCFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitSpouseDC}
      onRenewAction={submitRenewSpouseDC}
      onDuplicateAction={submitDuplicateSpouseDC}
      onCreateDuplicateAction={createSpouseDuplicateNewRequest}
      backLink={"/panel/diplomatic/spouses"}
    />
  );
}
