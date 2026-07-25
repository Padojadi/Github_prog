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
import { AccommodationDetails } from "./accommodation-details";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConferenceHotel } from "../../types";
import { deleteAccommodation } from "../../lib/accomodations-apis";
import { AccommodationForm } from "./accommodation-form";
import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";

type ActionColumnProps = {
  currentItem: Row<ConferenceHotel>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const queryQlient = useQueryClient();
  const currentUser = useCurrentUser();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let response = await deleteAccommodation(
        currentItem.id,
        "Erreur lors de la suppression de l'hébergement",
        "Hébergement supprimé avec succès"
      );
      if ("code" in response) {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryQlient.invalidateQueries({
        queryKey: ["accommodations"],
      });
      toast.success(message || "Hébergement supprimé avec succès");
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
          disabled={
            !hasPermission(currentUser.accessGroup?.permissions || [], [
              "MANAGE_CONFERENCES",
            ])
          }
          onClick={() => {
            setIsEditModalOpen(true);
          }}
        >
          <BsPencil size={20} />
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          size="icon"
          disabled={
            !hasPermission(currentUser.accessGroup?.permissions || [], [
              "MANAGE_CONFERENCES",
            ])
          }
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
              Détails de l&apos;hébergement
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && <AccommodationDetails accommodation={currentItem} />}
        </ResponsiveModalContent>
      </ResponsiveModal>
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Modifier l&apos;hébergement
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && (
            <AccommodationForm
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
              Êtes-vous sûr de vouloir supprimer ce hébergement?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;hébegement sera supprimée
              définitivement.{" "}
              <span className="font-semibold text-accent-foreground">
                La suppression sera annulée si une ou plusieures conférence(s)
                sont liés à ce hébergement.
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
