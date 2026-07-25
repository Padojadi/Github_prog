import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Row } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { PlateDetails } from "./plate-details";
import { TPlate } from "../types";
import { PlateForm } from "./plate-form";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlates } from "../lib/apis";
import { toast } from "react-toastify";
import useCurrentUser from "@/hooks/useCurrentUser";

type ActionColumnProps = {
  currentItem: Row<TPlate>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const queryQlient = useQueryClient();
  const currentUser = useCurrentUser();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteResponsiveModalOpen, setIsDeleteResponsiveModalOpen] =
    useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let response = await deletePlates(
        currentItem.id,
        "Erreur lors de la suppression de la plaque",
        "Plaque supprimée avec succès"
      );
      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryQlient.invalidateQueries({
        queryKey: ["plates"],
      });
      toast.success(message || "Plaque supprimée avec succès");
      setIsDeleteResponsiveModalOpen(false);
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onDelete = useCallback(async () => {
    deleteMutation.mutate();
  }, [currentItem]);
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="icon"
          onClick={() => {
            setIsViewModalOpen(true);
          }}
        >
          <BsEye size={20} />
        </Button>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
          size="icon"
          onClick={() => {
            setIsEditModalOpen(true);
          }}
          disabled={!currentUser?.isSuperAdmin}
        >
          <BsPencil size={20} />
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          size="icon"
          onClick={() => {
            setIsDeleteResponsiveModalOpen(true);
          }}
          disabled={!currentUser?.isSuperAdmin}
        >
          <BsTrash size={20} />
        </Button>
      </div>
      <ResponsiveModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Détails du plaque</ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && <PlateDetails plate={currentItem} />}
        </ResponsiveModalContent>
      </ResponsiveModal>
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Modifier plaque</ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && (
            <PlateForm
              initialData={currentItem}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </ResponsiveModalContent>
      </ResponsiveModal>

      <AlertDialog
        open={isDeleteResponsiveModalOpen}
        onOpenChange={setIsDeleteResponsiveModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Êtes-vous sûr de vouloir supprimer cette plaque?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La plaque sera supprimée
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
