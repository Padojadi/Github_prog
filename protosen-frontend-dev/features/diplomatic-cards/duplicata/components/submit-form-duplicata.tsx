"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SubmitButton2 from "@/components/submitButton2";
import { isEmpty } from "@/components/utils/utilsClient";
import type { ISubmitAction } from "@/lib/types";

const SubmitFormDuplicata = ({
	id,
	renewAction,
	backLink,
}: {
	id: string;
	renewAction: ISubmitAction;
	backLink: string;
}) => {
	const router = useRouter();
	async function formAction(formData: FormData) {
		const { message, errors, status } = await renewAction(formData);

		if (message) {
			if (status === "success") {
				toast.success(message);
				router.push(`${backLink}/duplicates`);
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
			// console.log(errors);
		}
	}
	return (
		<form action={formAction}>
			<input type="hidden" name={"id"} value={id} />
			<div className="flex justify-end">
				<SubmitButton2 label="Soumettre" />
			</div>
		</form>
	);
};

export default SubmitFormDuplicata;
