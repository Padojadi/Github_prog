import React from "react";
import {
  deleteOtherDependantDCFiles,
  fetchOtherDependantCardById,
  submitOtherDependantDiplomaticCardFiles,
  updateOtherDependantDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/otherDependants";
import FilesForm from "@/components/filesForm";
import { otherDependantFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherDependantCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      deleteFiles={deleteOtherDependantDCFiles}
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/other-dependants"}
      submitPersonDiplomaticCardFiles={submitOtherDependantDiplomaticCardFiles}
      updatePersonDiplomaticCardFiles={updateOtherDependantDiplomaticCardFiles}
      personFilesFormMeta={otherDependantFilesFormMeta}
      personDiplomaticCardIdInputName={"otherDependantDCId"}
      personDiplomaticCardFilesPropName={"otherDependantDCFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
