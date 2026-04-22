"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { createHolderDuplicateNewRequest } from "@/lib/actions/diplomaticCards/holders";
import type { ISubmitAction } from "@/lib/types";
import SubmitButton2 from "../submitButton2";
import { isEmpty } from "../utils/utilsClient";

const SubmitForm = ({
	id,
	submitAction,
	renewAction,
	duplicateAction,
	createDuplicateAction,
	backLink,
}: {
	id: string;
	submitAction: ISubmitAction;
	renewAction?: ISubmitAction;
	duplicateAction?: ISubmitAction;
	createDuplicateAction?: any;
	backLink: string;
}) => {
	const searchParams = useSearchParams();
	const renewId = searchParams.has("renew_id")
		? searchParams.get("renew_id")
		: null;
	const theId = renewId && renewAction ? renewId : id;

	const pageKey = searchParams.has("renew_id")
		? "/renew"
		: searchParams.has("isDuplicate")
			? "/duplicates"
			: "";

	const router = useRouter();
	async function formAction(formData: FormData) {
		if (searchParams.has("isDuplicate") && duplicateAction) {
			const { data, errors, status, message } = await createDuplicateAction({
				previousCardId: formData.get("id"),
			});

			if (message) {
				if (status === "success") {
					formData.set("id", data.id);
					toast.success(message);
				} else if (status === "error") {
					toast.error(message);
				} else {
					toast(message);
				}
			}
			if (errors && !isEmpty(errors)) {
				// toast.error(JSON.stringify(errors.message));
				// console.log(JSON.stringify(errors))
			}
		}

		const { message, errors, status } =
			searchParams.has("renew_id") && renewAction
				? await renewAction(formData)
				: searchParams.has("isDuplicate") && duplicateAction
					? await duplicateAction(formData)
					: await submitAction(formData);

		if (message) {
			if (status === "success") {
				toast.success(message);
				router.push(backLink + pageKey);
				// console.log(message)
			} else if (status === "error") {
				toast.error(message);
				// console.log(message)
			} else {
				toast(message);
				// console.log(message)
			}
		}
		if (errors && !isEmpty(errors)) {
			// toast.error(JSON.stringify(errors.message));
			// console.log(errors)
		}
	}
	return (
		<form action={formAction}>
			<input type="hidden" name={"id"} value={theId} />
			<div className="flex justify-end">
				<SubmitButton2 label="Soumettre" />
			</div>
		</form>
	);
};

export default SubmitForm;
