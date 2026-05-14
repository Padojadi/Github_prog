"use client";

import DataForm from "@/components/dataForm";
import { createChildNewRequest } from "@/lib/actions/diplomaticCards/childs";
import { formSections, schemaChildNewRequest } from "../formMeta";
import { IHolder } from "@/lib/types";

export default function Form({ holders }: { holders: IHolder[] | undefined }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/childs"
      title="Formulaire de demande de carte pour enfant(s)"
      formSections={formSections}
      schemaForm={schemaChildNewRequest}
      onSubmitAction={createChildNewRequest}
      holders={holders}
    />
  );
}
