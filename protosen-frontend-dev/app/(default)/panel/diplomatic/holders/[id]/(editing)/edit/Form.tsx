"use client";

import DataForm from "@/components/dataForm";
import { updateHolderNewRequest } from "@/lib/actions/diplomaticCards/holders";
import { formSections, schemaHolderNewRequest } from "../../../formMeta";

export default function Form({ initialValues }: { initialValues: any }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/holders"
      title="Formulaire de mise à jour de carte pour Titulaire"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaHolderNewRequest}
      onSubmitAction={updateHolderNewRequest}
      isEdit
    />
  );
}
