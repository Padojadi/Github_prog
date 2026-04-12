import React from "react";
import {
  deleteOtherStaffDCFiles,
  fetchOtherStaffCardById,
  submitOtherStaffDiplomaticCardFiles,
  updateOtherStaffDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/otherStaffs";
import FilesForm from "@/components/filesForm";
import { otherStaffFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherStaffCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      deleteFiles={deleteOtherStaffDCFiles}
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/other-staff"}
      submitPersonDiplomaticCardFiles={submitOtherStaffDiplomaticCardFiles}
      updatePersonDiplomaticCardFiles={updateOtherStaffDiplomaticCardFiles}
      personFilesFormMeta={otherStaffFilesFormMeta}
      personDiplomaticCardIdInputName={"otherStaffDCId"}
      personDiplomaticCardFilesPropName={"otherStaffDCFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
