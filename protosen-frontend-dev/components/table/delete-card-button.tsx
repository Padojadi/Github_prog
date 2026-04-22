"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
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
import { BsLock, BsTrash } from "react-icons/bs";

type DeleteCardButtonProps = {
  action: (id: string) => Promise<any>;
  item: { [key: string]: unknown };
  label: string;
};

export default function DeleteCardButton({
  item,
  action,
  label,
}: DeleteCardButtonProps) {
  const currentUser = useCurrentUser();
  const [isDeleteResponsiveModalOpen, setIsDeleteResponsiveModalOpen] =
    useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let response = await action(typeof item.id === "string" ? item.id : "");
      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      toast.success(message || "Carte supprimée avec succès");
      setIsDeleteResponsiveModalOpen(false);
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onDelete = useCallback(async () => {
    deleteMutation.mutate();
  }, [item]);
  return (
    <>
      <Button
        type="button"
        className="bg-transparent text-accent-foreground hover:bg-accent"
        onClick={() => {
          setIsDeleteResponsiveModalOpen(true);
        }}
        disabled={
          !currentUser.isSuperAdmin ||
          item.documentStage === "confirmed" ||
          item.documentStage === "printed"
        }
      >
        <BsTrash size={20} className="mr-2" />
        {label}
      </Button>
      <AlertDialog
        open={isDeleteResponsiveModalOpen}
        onOpenChange={setIsDeleteResponsiveModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Êtes-vous sûr de vouloir supprimer cette carte?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteMutation.isPending}
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
