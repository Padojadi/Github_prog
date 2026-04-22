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
import { Organism } from "../types";
import { OrganismDetails } from "./organism-details";
import { OrganismForm } from "./organism-form";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrganism } from "../lib/apis";
import { toast } from "react-toastify";

type ActionColumnProps = {
  currentItem: Row<Organism>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const queryQlient = useQueryClient();
  const currentUser = useCurrentUser();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let response = await deleteOrganism(
        currentItem.id,
        "Erreur lors de la suppression de l'institution",
        "Institution supprimée avec succès"
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
        queryKey: ["organisms"],
      });
      toast.success(message || "Institution supprimée avec succès");
      setIsDeleteDialogOpen(false);
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
          disabled={!currentUser.isSuperAdmin}
          onClick={() => {
            setIsEditModalOpen(true);
          }}
        >
          <BsPencil size={20} />
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          size="icon"
          disabled={!currentUser.isSuperAdmin}
          onClick={() => {
            setIsDeleteDialogOpen(true);
          }}
        >
          <BsTrash size={20} />
        </Button>
      </div>
      <ResponsiveModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Détails de l&apos;institution
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && <OrganismDetails organism={currentItem} />}
        </ResponsiveModalContent>
      </ResponsiveModal>
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Modifier l&apos;institution
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && (
            <OrganismForm
              initialData={currentItem}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </ResponsiveModalContent>
      </ResponsiveModal>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Êtes-vous sûr de vouloir supprimer cette institution?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;institution sera supprimée
              définitivement.{" "}
              <span className="font-semibold text-accent-foreground">
                La suppression sera annulée si un ou plusieurs
                utilisateur(s)/carte(s) sont liés à cette institution.
              </span>
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
