"use client";

import DataForm from "@/components/dataForm";
import { createOtherDependantNewRequest } from "@/lib/actions/diplomaticCards/otherDependants";
import { formSections, schemaOtherDependantNewRequest } from "../formMeta";
import { IHolder } from "@/lib/types";

export default function Form({ holders }: { holders: IHolder[] | undefined }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/other-dependants"
      title="Formulaire de demande de carte pour autres dépendants"
      formSections={formSections}
      schemaForm={schemaOtherDependantNewRequest}
      onSubmitAction={createOtherDependantNewRequest}
      holders={holders}
    />
  );
}
