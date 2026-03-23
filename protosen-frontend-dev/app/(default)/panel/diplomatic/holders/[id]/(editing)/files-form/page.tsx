import React from "react";
import {
  deleteHolderDCFiles,
  fetchHolderCardById,
  submitHolderDiplomaticCardFiles,
  updateHolderDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/holders";
import FilesForm from "@/components/filesForm";
import { holderFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchHolderCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/holders"}
      deleteFiles={deleteHolderDCFiles}
      submitPersonDiplomaticCardFiles={submitHolderDiplomaticCardFiles}
      updatePersonDiplomaticCardFiles={updateHolderDiplomaticCardFiles}
      personFilesFormMeta={holderFilesFormMeta}
      personDiplomaticCardIdInputName={"ownerDiplomaticCardId"}
      personDiplomaticCardFilesPropName={"ownerDiplomaticCardFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
