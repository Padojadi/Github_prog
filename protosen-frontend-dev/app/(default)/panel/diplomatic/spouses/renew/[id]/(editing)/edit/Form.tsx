"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateSpouseNewRequest } from "@/lib/actions/diplomaticCards/spouses";
import type { IHolder } from "@/lib/types";
import { formSections, schemaSpouseNewRequest } from "../../../../formMeta";

export default function Form({
	initialValues,
	holders,
}: {
	initialValues: any;
	holders: IHolder[] | undefined;
}) {
	return (
		<DataFormRenew
			backLink="/panel/diplomatic/spouses/renew"
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
