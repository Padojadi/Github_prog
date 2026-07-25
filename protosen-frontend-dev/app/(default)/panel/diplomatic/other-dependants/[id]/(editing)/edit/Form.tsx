"use client";

import DataForm from "@/components/dataForm";
import { updateOtherDependantNewRequest } from "@/lib/actions/diplomaticCards/otherDependants";
import { IHolder } from "@/lib/types";
import {
  formSections,
  schemaOtherDependantNewRequest,
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
      backLink="/panel/diplomatic/other-dependants"
      title="Formulaire de mise à jour de carte pour autres dépendants"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaOtherDependantNewRequest}
      onSubmitAction={updateOtherDependantNewRequest}
      holders={holders}
      isEdit
    />
  );
}
