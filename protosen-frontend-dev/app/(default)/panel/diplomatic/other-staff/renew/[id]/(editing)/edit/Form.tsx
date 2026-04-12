"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateOtherStaffNewRequest } from "@/lib/actions/diplomaticCards/otherStaffs";
import type { IHolder } from "@/lib/types";
import { formSections, schemaOtherStaffNewRequest } from "../../../../formMeta";

export default function Form({
	initialValues,
	holders,
}: {
	initialValues: any;
	holders: IHolder[] | undefined;
}) {
	return (
		<DataFormRenew
			backLink="/panel/diplomatic/other-staff/renew"
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
