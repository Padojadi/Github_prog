import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission, verifyConferenceStatus } from "@/lib/utils";
import { deleteConference } from "../../lib/apis";
import type { Conference } from "../../types";

type ActionColumnProps = {
	currentItem: Row<Conference>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
	const queryClient = useQueryClient();
	const currentUser = useCurrentUser();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const canEdit =
		hasPermission(currentUser?.accessGroup?.permissions || [], [
			"REQUEST_CONFERENCE",
		]) &&
		currentUser?.id === currentItem?.creatorId &&
		verifyConferenceStatus(currentItem?.statusHistories?.[0]?.status, [
			"PENDING",
			"REJECTED",
		]);
	const canDelete =
		hasPermission(currentUser?.accessGroup?.permissions || [], [
			"REQUEST_CONFERENCE",
		]) &&
		currentUser?.id === currentItem?.creatorId &&
		verifyConferenceStatus(currentItem?.statusHistories?.[0]?.status, [
			"PENDING",
			"REJECTED",
		]);

	const deleteMutation = useMutation({
		mutationFn: async () => {
			const response = await deleteConference(currentItem.id, "", "");
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de suppression de la demande conférence",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["conferences"],
			});
			toast.success(message || "Conférence supprimée avec succès");
			setIsDeleteDialogOpen(false);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onDelete = async () => {
		deleteMutation.mutate();
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<Link href={`/panel/conferences/${currentItem.id}`}>
					<Button
						className="bg-blue-500 hover:bg-blue-600 text-white"
						size="icon"
					>
						<BsEye size={20} />
					</Button>
				</Link>
				<Link
					href={canEdit ? `/panel/conferences/${currentItem.id}/edit` : "#"}
				>
					<Button
						className="bg-yellow-500 hover:bg-yellow-600 text-white"
						size="icon"
						disabled={!canEdit}
					>
						<BsPencil size={20} />
					</Button>
				</Link>
				<Button
					className="bg-red-500 hover:bg-red-600 text-white"
					size="icon"
					disabled={!canDelete}
					onClick={() => {
						setIsDeleteDialogOpen(true);
					}}
				>
					<BsTrash size={20} />
				</Button>
			</div>
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-foreground">
							Êtes-vous sûr de vouloir supprimer cette conférence?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action est irréversible. La conférence sera supprimée
							définitivement.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 hover:bg-red-600 text-white"
							disabled={deleteMutation.isPending}
							onClick={onDelete}
						>
							Supprimer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
