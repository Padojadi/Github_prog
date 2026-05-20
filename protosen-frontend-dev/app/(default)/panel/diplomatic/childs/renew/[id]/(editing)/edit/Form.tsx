"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateChildNewRequest } from "@/lib/actions/diplomaticCards/childs";
import type { IHolder } from "@/lib/types";
import { formSections, schemaChildNewRequest } from "../../../../formMeta";

export default function Form({
	initialValues,
	holders,
}: {
	initialValues: any;
	holders: IHolder[] | undefined;
}) {
	return (
		<DataFormRenew
			backLink="/panel/diplomatic/childs/renew"
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
