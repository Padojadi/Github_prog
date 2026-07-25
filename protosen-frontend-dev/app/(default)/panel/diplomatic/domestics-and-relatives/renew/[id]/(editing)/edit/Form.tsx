"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateDomesticAndRelativeNewRequest } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import type { IHolder } from "@/lib/types";
import {
	formSections,
	schemaDomesticAndRelativeNewRequest,
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
			backLink="/panel/diplomatic/domestics-and-relatives/renew"
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
