"use client";

import DataForm from "@/components/dataForm";
import { createHolderNewRequest } from "@/lib/actions/diplomaticCards/holders";
import { formSections, schemaHolderNewRequest } from "../formMeta";

export default function page() {
  return (
    <DataForm
      backLink="/panel/diplomatic/holders"
      title="Formulaire de demande de carte pour Titulaire"
      formSections={formSections}
      schemaForm={schemaHolderNewRequest}
      onSubmitAction={createHolderNewRequest}
    />
  );
}
