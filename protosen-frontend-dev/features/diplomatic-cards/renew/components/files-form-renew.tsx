"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { BsChevronDoubleRight } from "react-icons/bs";
import { toast } from "react-toastify";
import FileInput from "@/components/fileInput";
import { RelatedFiles } from "@/components/relatedFiles";
import SubmitButton from "@/components/submitButton";
import { LinkButton } from "@/components/ui/linkButton";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function FilesFormRenew({
	title,
	backLink,
	person,
	renewData,
	updatePersonDiplomaticCardFiles,
	personFilesFormMeta,
	personDiplomaticCardIdInputName,
	personDiplomaticCardFilesPropName,
	prefixFileKey,
	deleteFiles,
}: {
	title?: string;
	backLink: string;
	person: any;
	renewData: any;
	updatePersonDiplomaticCardFiles: (formData: FormData) => Promise<
		| {
				message: string;
				status: string;
				data?: undefined;
		  }
		| {
				data: any;
				status: string;
				message: string;
		  }
	>;
	personFilesFormMeta: { label: string; name: string; [x: string]: any }[];
	personDiplomaticCardIdInputName: string;
	personDiplomaticCardFilesPropName: string;
	prefixFileKey: string;
	deleteFiles?: (formData: FormData) => Promise<{
		message: string;
		status: string;
	}>;
}) {
	const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: number }>(
		{},
	);
	const router = useRouter();
	const currentUser = useCurrentUser();

	const handleFileUpload = (
		inputName: string,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const fileInput = e.target;
		const files = fileInput.files;
		if (files) {
			setUploadedFiles({
				...uploadedFiles,
				[inputName]: files.length,
			});
		}
	};

	const canSubmit =
		(!renewData.documentStage ||
			(renewData.documentStage &&
				renewData.documentStage !== "confirmed" &&
				renewData.documentStage !== "pending" &&
				renewData.documentStage !== "accepted" &&
				renewData.documentStage !== "printed") ||
			(currentUser?.isSuperAdmin && renewData.documentStage !== "printed")) &&
		!renewData.expired;

	async function formAction(formData: FormData) {
		// Remove empty files from the form data
		for (var pair of Array.from(formData.entries())) {
			if (pair[1] instanceof File && pair[1].size === 0) {
				formData.delete(pair[0]);
			}
		}

		let totalSize: number = 0;

		for (const file of Array.from(formData.entries())) {
			if (file[1] instanceof File) {
				totalSize += file[1].size;
			}
		}

		// console.log(totalSize);

		if (totalSize > 10 * 1024 * 1024) {
			toast.error("La taille totale des fichiers ne doit pas dépasser 10Mb");
			return;
		}

		const { message, status } = await updatePersonDiplomaticCardFiles(formData);
		if (message) {
			if (status === "success") {
				toast.success(message);
				if (renewData?.documentStage === "onhold") {
					router.push(
						`${backLink}/${renewData.id}/submit?previousCard=${renewData.previousCardId}`,
					);
				} else {
					router.push(backLink);
				}
			} else if (status === "error") {
				toast.error(message);
			} else {
				toast(message);
			}
		}
	}
	return (
		<div className="relative bg-white dark:bg-slate-900 h-full">
			<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
				{/* Page header */}
				<div className="mb-8">
					<h1 className="text-2xl flex items-center md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
						{title || "Formulaire d'association de fichiers à une demande"}
					</h1>
				</div>

				<div className="border-t border-slate-200 dark:border-slate-700">
					{/* Components */}
					<p className="my-5">
						<span className="font-bold">Note:</span> Les champs marqués d'un
						astérisque (<span className="text-rose-500">*</span>) sont
						obligatoires.
					</p>
					<div className="space-y-8">
						<form action={formAction}>
							<div>
								<input
									type="hidden"
									name={personDiplomaticCardIdInputName}
									value={person.id}
								/>
								<div className="flex justify-between">
									{personFilesFormMeta.map((meta) => (
										<FileInput
											filesCount={uploadedFiles[meta.name]}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleFileUpload(meta.name, e)
											}
											name={meta.name}
											key={meta.name}
											required={
												(meta.required ||
													(!person[personDiplomaticCardFilesPropName] &&
														meta.name !== "others")) &&
												true
											}
											label={meta.label}
											multiple={meta.multiple && true}
											accept={meta.accept}
										/>
									))}
								</div>
							</div>
							<div className="flex justify-end mt-6">
								<SubmitButton label={"Update"} disabled={!canSubmit} />

								<LinkButton
									className="ml-3"
									href={`${backLink}/${renewData.id}/submit?previousCard=${renewData.previousCardId}`}
								>
									Suivant <BsChevronDoubleRight className="ml-2" size={16} />
								</LinkButton>
							</div>
						</form>

						<hr className="border-t-4 border-slate-200 dark:border-slate-700 my-5" />
						{person && (
							<div className="bg-gray-200 dark:bg-slate-800 rounded-md p-8">
								<RelatedFiles
									addDeleteFeature={true}
									person={person}
									deleteFiles={deleteFiles}
									personDiplomaticCardIdInputName={
										personDiplomaticCardIdInputName
									}
									personDiplomaticCardFilesPropName={
										personDiplomaticCardFilesPropName
									}
									prefixFileKey={prefixFileKey}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
