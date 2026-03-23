"use client";

import DataForm from "@/components/dataForm";
import { createSpouseNewRequest } from "@/lib/actions/diplomaticCards/spouses";
import { formSections, schemaSpouseNewRequest } from "../formMeta";
import { IHolder } from "@/lib/types";

export default function Form({ holders }: { holders: IHolder[] | undefined }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/spouses"
      title="Formulaire de demande de carte pour époux/épouse(s)"
      formSections={formSections}
      schemaForm={schemaSpouseNewRequest}
      onSubmitAction={createSpouseNewRequest}
      holders={holders}
    />
  );
}
