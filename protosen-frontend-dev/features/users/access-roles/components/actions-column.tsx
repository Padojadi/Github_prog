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
import { AccessRole } from "../types";
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
import { deleteAccessRole } from "../lib/apis";
import useCurrentUser from "@/hooks/useCurrentUser";
import { AccessRoleForm } from "./access-role-form";
import { toast } from "sonner";

type ActionColumnProps = {
  currentItem: Row<AccessRole>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteResponsiveModalOpen, setIsDeleteResponsiveModalOpen] =
    useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await deleteAccessRole(currentItem.id, "", "");
      if (response.status === "error") {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["access-roles"],
      });
      toast.success(message || "Rôle d'accès supprimé avec succès");
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
        {/* <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="icon"
          onClick={() => {
            setIsViewModalOpen(true);
          }}
        >
          <BsEye size={20} />
        </Button> */}
        {currentItem.editable && (
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
        )}
        {currentItem.editable && (
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
        )}
      </div>
      {/* <ResponsiveModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Détails du rôle d&apos;accès
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && <AccessRoleDetails accessRole={currentItem} />}
        </ResponsiveModalContent>
      </ResponsiveModal> */}
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent className="lg:max-w-3xl">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Modifier le groupe d&apos;accès
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          {currentItem && (
            <AccessRoleForm
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
              Êtes-vous sûr de vouloir supprimer ce groupe d&apos;accès?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le groupe d&apos;accès sera
              supprimé définitivement.
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
