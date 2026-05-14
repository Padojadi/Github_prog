import React from "react";
import {
  deleteDomesticAndRelativeDCFiles,
  fetchDomesticAndRelativeCardById,
  submitDomesticAndRelativeDiplomaticCardFiles,
  updateDomesticAndRelativeDiplomaticCardFiles,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import FilesForm from "@/components/filesForm";
import { domesticAndRelativeFilesFormMeta } from "./formMeta";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchDomesticAndRelativeCardById(id);

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return (
    <FilesForm
      deleteFiles={deleteDomesticAndRelativeDCFiles}
      person={res.data}
      title="Formulaire d'association de fichiers à une demande"
      backLink={"/panel/diplomatic/domestics-and-relatives"}
      submitPersonDiplomaticCardFiles={
        submitDomesticAndRelativeDiplomaticCardFiles
      }
      updatePersonDiplomaticCardFiles={
        updateDomesticAndRelativeDiplomaticCardFiles
      }
      personFilesFormMeta={domesticAndRelativeFilesFormMeta}
      personDiplomaticCardIdInputName={"domesticAndRelativeDCId"}
      personDiplomaticCardFilesPropName={"domesticAndRelativeDCFiles"}
      prefixFileKey="cartesDiplomatique"
    />
  );
}
