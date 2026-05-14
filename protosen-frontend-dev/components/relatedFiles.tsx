"use client";

import { useFormStatus } from "react-dom";
import { BsFileEarmark, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import LoadingIcon from "./ui/icons/loadingIcon";
import { extractPathFromUrl } from "./utils/utilsClient";

function FileIconContainer({
	filesCount,
	link,
}: {
	filesCount: number;
	link: string;
}) {
	return (
		<a href={link} target="_blank">
			<div className="relative flex h-12 w-12 rounded-md overflow-hidden justify-center items-center bg-gray-100">
				<div className="absolute top-2/3 right-2/3 bg-blue-500 text-white w-[15px] h-[15px] text-[10px] font-bold flex justify-center items-center rounded-full">
					{filesCount || 0}
				</div>
				<BsFileEarmark size={32} />
			</div>
		</a>
	);
}

function DeleteButton({ label }: { label: string }) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			className="btn bg-red-500 hover:bg-red-600 text-white"
			aria-disabled={pending}
		>
			{pending ? <LoadingIcon /> : <BsTrash size={20} />}
			<span className="ml-2">{label}</span>
		</button>
	);
}

export const RelatedFiles = ({
	person,
	addDeleteFeature,
	deleteFiles,
	personDiplomaticCardIdInputName,
	personDiplomaticCardFilesPropName,
	prefixFileKey,
}: {
	person: any;
	addDeleteFeature?: boolean;
	deleteFiles?: (formData: FormData) => Promise<{
		message: string;
		status: string;
	}>;
	personDiplomaticCardIdInputName: string;
	personDiplomaticCardFilesPropName: string;
	prefixFileKey: string;
}) => {
	async function formAction(formData: FormData) {
		const { message = "", status = "" } = (await deleteFiles?.(formData)) || {};
		if (message) {
			if (status === "success") {
				toast.success(message);
			} else if (status === "error") {
				toast.error(message);
			} else {
				toast(message);
			}
		}
	}

	return (
		<>
			{person[personDiplomaticCardFilesPropName] && (
				<div className="px-5">
					<h2 className="text-xl text-slate-800 dark:text-slate-100 font-bold mb-6">
						Cette personne a déjà des fichiers associés
					</h2>
					<div className="grid grid-cols-5">
						{Object.getOwnPropertyNames(
							person[personDiplomaticCardFilesPropName],
						)
							.filter(
								(prop: any) => prop.includes("Key") && prop !== "othersKey",
							)
							.map((key: any) => (
								<div key={key} className="mb-2">
									<FileIconContainer
										link={person[`${key.split("Key")[0]}Link`]}
										filesCount={1}
									/>
									1 {key.split("Key")[0]}
								</div>
							))}
						{person?.presignUrlOthersLink?.map((fileLink: any, index: any) => (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									if (confirm("Êtes-vous sure?")) {
										formAction(new FormData(e.target as HTMLFormElement));
									}
								}}
								key={fileLink}
							>
								<div className="mb-2">
									<div className="mb-2">
										<FileIconContainer link={fileLink} filesCount={1} />1 Autre
										fichier
									</div>
								</div>
								<input
									type="hidden"
									name={personDiplomaticCardIdInputName}
									value={person.id}
								/>
								<input
									type="hidden"
									name="fileKeys[]"
									value={extractPathFromUrl(fileLink, prefixFileKey) || ""}
								/>
								{addDeleteFeature && <DeleteButton label="Supprimer" />}
							</form>
						))}
					</div>
				</div>
			)}
		</>
	);
};
