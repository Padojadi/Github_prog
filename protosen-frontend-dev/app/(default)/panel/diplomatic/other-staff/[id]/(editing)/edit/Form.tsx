"use client";

import DataForm from "@/components/dataForm";
import { updateOtherStaffNewRequest } from "@/lib/actions/diplomaticCards/otherStaffs";
import { IHolder } from "@/lib/types";
import { formSections, schemaOtherStaffNewRequest } from "../../../formMeta";

export default function Form({
  initialValues,
  holders,
}: {
  initialValues: any;
  holders: IHolder[] | undefined;
}) {
  return (
    <DataForm
      backLink="/panel/diplomatic/other-staff"
      title="Formulaire de mise à jour de carte pour autres personnels"
      initialValues={initialValues || {}}
      formSections={formSections}
      schemaForm={schemaOtherStaffNewRequest}
      onSubmitAction={updateOtherStaffNewRequest}
      holders={holders}
      isEdit
    />
  );
}
