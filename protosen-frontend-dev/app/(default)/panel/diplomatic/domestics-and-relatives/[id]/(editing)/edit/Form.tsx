"use client";

import DataForm from "@/components/dataForm";
import { updateDomesticAndRelativeNewRequest } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { IHolder } from "@/lib/types";
import {
  formSections,
  schemaDomesticAndRelativeNewRequest,
} from "../../../formMeta";

export default function Form({
  initialValues,
  holders,
}: {
  initialValues: any;
  holders: IHolder[] | undefined;
}) {
  return (
    <DataForm
      backLink="/panel/diplomatic/domestics-and-relatives"
      title="Formulaire de mise à jour de carte pour personnels de services, domestiques et familles"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaDomesticAndRelativeNewRequest}
      onSubmitAction={updateDomesticAndRelativeNewRequest}
      holders={holders}
      isEdit
    />
  );
}
