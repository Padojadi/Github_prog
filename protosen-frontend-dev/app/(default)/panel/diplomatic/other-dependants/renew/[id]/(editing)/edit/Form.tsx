"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateOtherDependantNewRequest } from "@/lib/actions/diplomaticCards/otherDependants";
import type { IHolder } from "@/lib/types";
import {
	formSections,
	schemaOtherDependantNewRequest,
} from "../../../../formMeta";

export default function Form({
	initialValues,
	holders,
}: {
	initialValues: any;
	holders: IHolder[] | undefined;
}) {
	return (
		<DataFormRenew
			backLink="/panel/diplomatic/other-dependants/renew"
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
