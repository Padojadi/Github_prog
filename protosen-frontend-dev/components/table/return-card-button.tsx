"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { LuArchive } from "react-icons/lu";
import { toast } from "react-toastify";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type ReturnCardButtonProps = {
	action: (id: string) => Promise<any>;
	item: { [key: string]: any };
	label: string;
};

export default function ReturnCardButton({
	item,
	action,
	label,
}: ReturnCardButtonProps) {
	const currentUser = useCurrentUser();
	const [isDeleteResponsiveModalOpen, setIsDeleteResponsiveModalOpen] =
		useState(false);

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const response = await action(typeof item.id === "string" ? item.id : "");
			if (response.status === "error") {
				throw new Error(
					response.message || "Une erreur inconnue s'est produite",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			toast.success(message || "Carte restituée avec succès");
			setIsDeleteResponsiveModalOpen(false);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onDelete = useCallback(async () => {
		mutate();
	}, [mutate]);
	return (
		<>
			<Button
				type="button"
				onClick={() => {
					setIsDeleteResponsiveModalOpen(true);
				}}
				disabled={!currentUser.isSuperAdmin || item.expired}
				className="bg-transparent text-accent-foreground hover:bg-accent flex w-full"
			>
				<LuArchive size={20} className="mr-2" />
				{label}
			</Button>
			<AlertDialog
				open={isDeleteResponsiveModalOpen}
				onOpenChange={setIsDeleteResponsiveModalOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-foreground">
							Êtes-vous sûr de vouloir restituer cette carte?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							className="bg-indigo-500 hover:bg-indigo-600 text-white"
							disabled={isPending}
							onClick={onDelete}
						>
							Confirmer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
