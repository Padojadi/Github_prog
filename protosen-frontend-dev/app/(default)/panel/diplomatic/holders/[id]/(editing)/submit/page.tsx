import React from "react";
import {
  fetchHolderCardById,
  submitDuplicateHolderDC,
  submitHolderDC,
  submitRenewHolderDC,
  createHolderDuplicateNewRequest,
} from "@/lib/actions/diplomaticCards/holders";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchHolderCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.ownerDiplomaticCardFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/holders");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"ownerDiplomaticCardId"}
      personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitHolderDC}
      onRenewAction={submitRenewHolderDC}
      onDuplicateAction={submitDuplicateHolderDC}
      onCreateDuplicateAction={createHolderDuplicateNewRequest}
      backLink={"/panel/diplomatic/holders"}
    />
  );
}
