"use client";
import DataFormRenew from "@/features/diplomatic-cards/renew/components/data-form-renew";
import { updateHolderNewRequest } from "@/lib/actions/diplomaticCards/holders";
import { formSections, schemaHolderNewRequest } from "../../../../formMeta";

export default function Form({ initialValues }: { initialValues: any }) {
	return (
		<DataFormRenew
			backLink="/panel/diplomatic/holders/renew"
			title="Formulaire de mise à jour de carte pour Titulaire"
			initialValues={initialValues || {}}
			formSections={formSections}
			schemaForm={schemaHolderNewRequest}
			onSubmitAction={updateHolderNewRequest}
			isEdit
		/>
	);
}
