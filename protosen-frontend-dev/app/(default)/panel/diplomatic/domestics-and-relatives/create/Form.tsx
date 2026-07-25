"use client";

import DataForm from "@/components/dataForm";
import { createDomesticAndRelativeNewRequest } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { formSections, schemaDomesticAndRelativeNewRequest } from "../formMeta";
import { IHolder } from "@/lib/types";

export default function Form({ holders }: { holders: IHolder[] | undefined }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/domestics-and-relatives"
      title="Formulaire de demande de carte pour personnels de services, domestiques et familles"
      formSections={formSections}
      schemaForm={schemaDomesticAndRelativeNewRequest}
      onSubmitAction={createDomesticAndRelativeNewRequest}
      holders={holders}
    />
  );
}
