"use client";

import DataForm from "@/components/dataForm";
import { IHolder } from "@/lib/types";
import { formSections, schemaChildNewRequest } from "../../../formMeta";
import { updateChildNewRequest } from "@/lib/actions/diplomaticCards/childs";

export default function Form({
  initialValues,
  holders,
}: {
  initialValues: any;
  holders: IHolder[] | undefined;
}) {
  return (
    <DataForm
      backLink="/panel/diplomatic/childs"
      title="Formulaire de mise à jour de carte pour enfant(s)"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaChildNewRequest}
      onSubmitAction={updateChildNewRequest}
      holders={holders}
      isEdit
    />
  );
}
