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
import { CardTypeDetails } from "./type-of-card-details";
import { CardType } from "../types";
import { CardTypeForm } from "./type-of-card-form";
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
import { deleteCardTypes } from "../lib/apis";
import { toast } from "react-toastify";
import useCurrentUser from "@/hooks/useCurrentUser";

type ActionColumnProps = {
  currentItem: Row<CardType>["original"];
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
      let response = await deleteCardTypes(
        currentItem.id,
        "Erreur lors de la suppression du type de carte",
        "Type de carte supprimé avec succès"
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
        queryKey: ["card-types"],
      });
      toast.success(message || "Type de carte supprimé avec succès");
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
            <ResponsiveModalTitle>
              Détails du type de carte
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && <CardTypeDetails cardType={currentItem} />}
        </ResponsiveModalContent>
      </ResponsiveModal>
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Modifier type de carte</ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && (
            <CardTypeForm
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
              Êtes-vous sûr de vouloir supprimer ce type de carte?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le type de carte sera supprimé
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
