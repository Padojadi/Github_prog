import React from "react";
import {
  deleteSpouseDCFiles,
  fetchSpouseCardById,
  submitSpouseDiplomaticCardFiles,
  updateSpouseDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/spouses";
import FilesForm from "@/components/filesForm";
import { spouseFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchSpouseCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      deleteFiles={deleteSpouseDCFiles}
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/spouses"}
      submitPersonDiplomaticCardFiles={submitSpouseDiplomaticCardFiles}
      updatePersonDiplomaticCardFiles={updateSpouseDiplomaticCardFiles}
      personFilesFormMeta={spouseFilesFormMeta}
      personDiplomaticCardIdInputName={"spouseDCId"}
      personDiplomaticCardFilesPropName={"spouseDCFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
