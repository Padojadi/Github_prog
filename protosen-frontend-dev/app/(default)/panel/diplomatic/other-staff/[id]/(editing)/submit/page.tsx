import React from "react";
import {
  fetchOtherStaffCardById,
  submitDuplicateOtherStaffDC,
  submitOtherStaffDC,
  submitRenewOtherStaffDC,
  createOtherStaffDuplicateNewRequest,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import ReviewData from "@/components/reviewData/reviewData";
import { formSections } from "../../../formMeta";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherStaffCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  // Check if the user can submit the form
  const canSubmit = res.data.otherStaffDCFiles;

  if (!canSubmit) {
    redirect("/panel/diplomatic/other-staff");
  }

  return (
    <ReviewData
      formSections={formSections}
      person={res.data}
      personDiplomaticCardIdInputName={"otherStaffDCId"}
      personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
      prefixFileKey="cartesDiplomatique"
      onSubmitAction={submitOtherStaffDC}
      onRenewAction={submitRenewOtherStaffDC}
      onDuplicateAction={submitDuplicateOtherStaffDC}
      onCreateDuplicateAction={createOtherStaffDuplicateNewRequest}
      backLink={"/panel/diplomatic/other-staff"}
    />
  );
}
