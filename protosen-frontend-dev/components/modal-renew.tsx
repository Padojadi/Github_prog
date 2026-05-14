"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { BsChevronDoubleRight, BsPlusLg } from "react-icons/bs";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/linkButton";
import ModalBasic from "@/components/ui/modal-basic";
import type {
	createHolderRenewCard,
	getHoldersCardsForRenew,
} from "@/lib/actions/diplomaticCards/holders";
import { IFetchAction, type IPerson } from "@/lib/types";
import PersonCardSelect from "./personSelect";

export const ModalRenew = ({
	fetchFn,
	createFn,
	key,
}: {
	fetchFn: typeof getHoldersCardsForRenew;
	createFn: typeof createHolderRenewCard;
	key: string;
}) => {
	const [card, setCard] = React.useState<{
		value: string;
		label: string;
	} | null>(null);
	const [basicModalOpen, setBasicModalOpen] = React.useState<boolean>(false);

	const { data, isLoading } = useQuery({
		queryKey: ["renewables-cards", key],
		queryFn: async () => {
			const response = await fetchFn();

			if (!response.data) {
				toast.error(response.message);
				return [];
			}

			return response.data;
		},
	});

	const personsOptions = useMemo(() => {
		return data
			? data.map((item: IPerson) => ({
					value: item.id,
					label: `${item.firstName} ${item.lastName}`,
				}))
			: [];
	}, [data]);

	const onChange = (value: null) => {
		setCard(value);
	};

	const createNewRenewMutation = useMutation({
		mutationFn: async () => {
			if (!card) {
				throw new Error("Veuillez sélectionner une carte");
			}

			const response = await createFn(card.value);

			if (response.error) {
				// console.error(response);
				throw new Error(response.message);
			}

			return response.message;
		},
		onSuccess: (message) => {
			toast.success(message);
			setBasicModalOpen(false);
		},
		onError: ({ message }) => {
			toast.error(message);
		},
	});

	return (
		<div>
			<Button
				onClick={() => {
					setBasicModalOpen(true);
				}}
				className="mb-4"
				type="button"
			>
				Créer un renouvellement <BsPlusLg size={18} className="ml-2" />
			</Button>
			<ModalBasic
				isOpen={basicModalOpen}
				setIsOpen={setBasicModalOpen}
				title="Liste des cartes renouvellables"
			>
				{/* Modal content */}
				<div className="px-5 pt-5 pb-10 h-fit">
					<div className="text-sm">
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="card-to-renew"
						>
							Selectionner une carte
							<span className="text-rose-500">*</span>
						</label>
						<Select
							placeholder="Selectionner une carte ..."
							onChange={onChange}
							isLoading={isLoading}
							noOptionsMessage={() => "Aucune option"}
							name="cards"
							id="card-to-renew"
							instanceId={React.useId()}
							className="w-full"
							required
							options={personsOptions}
						/>
					</div>
				</div>
				{/* Modal footer */}
				<div className="px-5 py-4">
					<div className="flex flex-wrap justify-end space-x-2">
						<button
							className="btn bg-red-500 hover:bg-red-600 text-white"
							onClick={(e) => {
								e.preventDefault();
								setCard(null);
								setBasicModalOpen(false);
							}}
						>
							Annuler
						</button>
						<Button
							disabled={!card || createNewRenewMutation.isPending}
							onClick={() => createNewRenewMutation.mutate()}
						>
							Créer{" "}
							{createNewRenewMutation.isPending ? (
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
