import React from "react";
import {
  deleteChildDCFiles,
  fetchChildCardById,
  submitChildDiplomaticCardFiles,
  updateChildDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/childs";
import FilesForm from "@/components/filesForm";
import { childFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchChildCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      deleteFiles={deleteChildDCFiles}
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/childs"}
      submitPersonDiplomaticCardFiles={submitChildDiplomaticCardFiles}
      updatePersonDiplomaticCardFiles={updateChildDiplomaticCardFiles}
      personFilesFormMeta={childFilesFormMeta}
      personDiplomaticCardIdInputName={"childDCId"}
      personDiplomaticCardFilesPropName={"childDCFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
