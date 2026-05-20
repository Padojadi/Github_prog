"use client";

import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import SubmitButton from "@/components/submitButton";
import BadgeStatusComponent from "@/components/ui/badgeStatusComponent";
import { Button } from "@/components/ui/button";
import ModalBasic from "@/components/ui/modal-basic";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { isEmpty } from "@/components/utils/utilsClient";
import type {
	IPerson,
	IPersonCardInfosRenew,
	ISubmitAction,
} from "@/lib/types";

const ValidateFormDuplicataOtherDependant = ({
	person,
	validateData,
	backLink,
	duplicataData,
}: {
	person: IPerson;
	validateData: ISubmitAction;
	backLink: string;
	duplicataData: IPersonCardInfosRenew;
}) => {
	const router = useRouter();
	const [reasonSelected, setReasonSelected] = React.useState("");
	const [reasonToSubmit, setReasonToSubmit] = React.useState("");
	const [basicModalOpen, setBasicModalOpen] = React.useState<boolean>(false);

	const pageKey = "/duplicates";

	const onChange = (value: string) => {
		setReasonSelected(value);
		if (value !== "other") {
			setReasonToSubmit(value);
		} else {
			setReasonToSubmit("");
		}
	};

	async function formAction(formData: FormData) {
		const { message, errors, status } = await validateData(formData);

		if (message) {
			if (status === "success") {
				toast.success(message);
				router.push(backLink + pageKey);
			} else if (status === "error") {
				toast.error(message);
			} else {
				toast(message);
			}
		}
		if (errors && !isEmpty(errors)) {
			// toast.error(JSON.stringify(errors.message));
			// console.log(errors.message);
		}
	}
	return (
		<div className="grid grid-cols-1">
			<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
				{person?.otherDependantDCFiles ? (
					<>
						<div className="flex justify-between">
							<h2 className="text-xl font-semibold mb-4">
								Documents en attente de validation
							</h2>
							<div className="flex items-center">
								<div className="flex flex-col items-end">
									<div>
										<span className="text-gray-500 mr-2">
											Statut de la carte :
										</span>
										<BadgeStatusComponent status={person.documentStage} />
									</div>

									<div>
										<span className="text-gray-500 mr-2">
											Statut du duplicata :
										</span>
										<BadgeStatusComponent
											status={duplicataData?.documentStage}
										/>
									</div>
								</div>
							</div>
						</div>

						<ul className="space-y-4">
							{person?.otherDependantDCFiles?.passportKey && (
								<li className="flex items-center gap-2">
									<div className="flex items-center">
										<CheckCircleIcon className="text-green-500 mr-2" />
										<span className="flex-1">Passeport</span>
									</div>
									<Button variant={"link"}>
										<a href={person.passportLink} target="_blank">
											Voir document
										</a>
									</Button>
								</li>
							)}
							{person?.otherDependantDCFiles?.adKey && (
								<li className="flex items-center gap-2">
									<div className="flex items-center">
										<CheckCircleIcon className="text-green-500 mr-2" />
										<span className="flex-1">Acte de mariage</span>
									</div>
									<Button variant={"link"}>
										<a href={person.adLink} target="_blank">
											Voir document
										</a>
									</Button>
								</li>
							)}
							{person?.otherDependantDCFiles?.othersKey && (
								<li className="flex flex-col">
									<div className="flex items-center">
										<CheckCircleIcon className="text-green-500 mr-2" />
										<span className="flex-1">
											{person?.otherDependantDCFiles?.othersKey?.length}{" "}
											Autre(s) Fichier(s)
										</span>
									</div>
									<div className="space-y-2">
										{person.presignUrlOthersLink.map(
											(link: string, index: number) => (
												<Button variant={"link"} key={link}>
													<a href={link} target="_blank">
														Voir document {index + 1}
													</a>
												</Button>
											),
										)}
									</div>
								</li>
							)}
						</ul>
						<div className="mt-6 flex justify-end">
							<form action={formAction}>
								<input type="hidden" name="id" value={duplicataData.id} />
								<input type="hidden" name="documentStage" value={"confirmed"} />
								<Button
									className="bg-red-500 hover:bg-red-600 text-white mr-2"
									variant="destructive"
									onClick={(e) => {
										e.preventDefault();
										setBasicModalOpen(true);
									}}
								>
									Rejeter
								</Button>
								<SubmitButton label="Valider" />
							</form>
						</div>
					</>
				) : (
					<h2 className="text-xl font-semibold mb-4">
						Aucun documents en attente de validation
					</h2>
				)}
			</div>

			<ModalBasic
				isOpen={basicModalOpen}
				setIsOpen={setBasicModalOpen}
				title="Motif de rejet"
			>
				{/* Modal content */}
				<form action={formAction}>
					<div className="px-5 pt-4 pb-1">
						<div className="text-sm">
							<Select onValueChange={onChange} required>
								<SelectTrigger>
									<SelectValue placeholder="Sélectionner un motif" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="Dossier incomplet">
										Dossier incomplet
									</SelectItem>
									<SelectItem value="Informations invalides">
										Informations invalides
									</SelectItem>
									<SelectItem value="other">Autre</SelectItem>
								</SelectContent>
							</Select>
							<input type="hidden" name="id" value={duplicataData.id} />
							<input type="hidden" name="rejectReason" value={reasonToSubmit} />
							<input type="hidden" name="documentStage" value={"rejected"} />
							{reasonSelected === "other" && (
								<textarea
									className="w-full border border-gray-300 rounded-lg p-2 mt-4"
									placeholder="Raison de rejet"
									value={reasonToSubmit}
									onChange={(e) => setReasonToSubmit(e.target.value)}
									required
								></textarea>
							)}
						</div>
					</div>
					{/* Modal footer */}
					<div className="px-5 py-4">
						<div className="flex flex-wrap justify-end space-x-2">
							<button
								type="button"
								className="btn bg-red-500 hover:bg-red-600 text-white"
								onClick={(e) => {
									e.preventDefault();
									setReasonSelected("");
									setBasicModalOpen(false);
								}}
							>
								Annuler
							</button>
							<SubmitButton label="Oui Rejeter" />
						</div>
					</div>
				</form>
			</ModalBasic>
		</div>
	);
};

export default ValidateFormDuplicataOtherDependant;

