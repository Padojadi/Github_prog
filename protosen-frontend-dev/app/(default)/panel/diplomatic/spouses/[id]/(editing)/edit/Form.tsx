"use client";

import DataForm from "@/components/dataForm";
import { updateSpouseNewRequest } from "@/lib/actions/diplomaticCards/spouses";
import { IHolder } from "@/lib/types";
import { formSections, schemaSpouseNewRequest } from "../../../formMeta";

export default function Form({
  initialValues,
  holders,
}: {
  initialValues: any;
  holders: IHolder[] | undefined;
}) {
  return (
    <DataForm
      backLink="/panel/diplomatic/spouses"
      title="Formulaire de mise à jour de carte pour époux/épouse(s)"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaSpouseNewRequest}
      onSubmitAction={updateSpouseNewRequest}
      holders={holders}
      isEdit
    />
  );
}
