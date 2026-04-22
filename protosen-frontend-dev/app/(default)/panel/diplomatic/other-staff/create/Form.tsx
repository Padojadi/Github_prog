"use client";

import DataForm from "@/components/dataForm";
import { createOtherStaffNewRequest } from "@/lib/actions/diplomaticCards/otherStaffs";
import { formSections, schemaOtherStaffNewRequest } from "../formMeta";
import { IHolder } from "@/lib/types";

export default function Form({ holders }: { holders: IHolder[] | undefined }) {
  return (
    <DataForm
      backLink="/panel/diplomatic/other-staff"
      title="Formulaire de demande de carte pour autres personnels"
      formSections={formSections}
      schemaForm={schemaOtherStaffNewRequest}
      onSubmitAction={createOtherStaffNewRequest}
      holders={holders}
    />
  );
}
