"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { BsChevronDoubleRight, BsPlusLg } from "react-icons/bs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import ModalBasic from "@/components/ui/modal-basic";
import type { createHolderDuplicateNewRequest } from "@/lib/actions/diplomaticCards/holders";
import type { IFetchAction } from "@/lib/types";
import PersonCardSelect from "./personSelect";

export const ModalDuplicate = ({
	link,
	fetchActivePersonsCards,
	createAction,
}: {
	link: string;
	fetchActivePersonsCards: IFetchAction;
	createAction: typeof createHolderDuplicateNewRequest;
}) => {
	const [person, setPerson] = React.useState<any>({ value: "", label: "" });
	const [basicModalOpen, setBasicModalOpen] = React.useState<boolean>(false);
	const router = useRouter();

	const onChange = (value: null) => {
		setPerson(value);
	};

	const createNewDuplicateMutation = useMutation({
		mutationFn: async () => {
			if (!person) {
				throw new Error("Veuillez sélectionner une carte");
			}

			const payload = person._sourceType === "renew"
				? { renewCardId: person.value }
				: { previousCardId: person.value };
			const response = await createAction(payload);

			if (!response.data) {
				// console.error(response);
				throw new Error(response.message);
			}

			return { data: response.data?.id, message: response.message };
		},
		onSuccess: ({ data, message }) => {
			toast.success(message);
			setBasicModalOpen(false);
			const cardParam = person._sourceType === "renew" ? "renewCard" : "previousCard";
			router.push(`${link}/${data}/submit?${cardParam}=${person.value}`);
		},
		onError: ({ message }) => {
			toast.error(message);
		},
	});
	return (
		<div>
			<Button
				onClick={(e) => {
					e.preventDefault();
					setBasicModalOpen(true);
				}}
				className="mb-4"
			>
				Duplicata <BsPlusLg size={18} className="ml-2" />
			</Button>
			<ModalBasic
				isOpen={basicModalOpen}
				setIsOpen={setBasicModalOpen}
				title="Liste des cartes doublables"
			>
				{/* Modal content */}
				<div className="px-5 pt-5 pb-10 h-fit">
					<div className="text-sm">
						<PersonCardSelect
							fetchActivePersonsCards={fetchActivePersonsCards}
							onChange={onChange}
							label="Selectionner une carte"
							name="person_card"
						/>
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
								setPerson("");
								setBasicModalOpen(false);
							}}
						>
							Annuler
						</button>
						<Button
							disabled={!person.value || createNewDuplicateMutation.isPending}
							onClick={() => createNewDuplicateMutation.mutate()}
						>
							Créer et suivant{" "}
							{createNewDuplicateMutation.isPending ? (
								<Loader2 className="w-4 h-4 ml-2 animate-spin" />
							) : (
								<BsChevronDoubleRight className="ml-2" size={16} />
							)}
						</Button>
					</div>
				</div>
			</ModalBasic>
		</div>
	);
};
