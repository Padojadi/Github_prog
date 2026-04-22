"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { ParticipantTypeForm } from "./participant-type-form";
import { ParticipantTypeDetails } from "./participant-type-details";
import { deleteParticipantTypes } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ParticipantType } from "../types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";

interface ActionColumnProps {
  currentItem: ParticipantType;
}

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const canManage = hasPermission(currentUser.accessGroup?.permissions || [], [
    "MANAGE_CONFERENCES",
  ]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await deleteParticipantTypes(
        currentItem.id,
        "Erreur de suppression de type de participant",
        "Type de participant supprimé avec succès"
      );
      if ("code" in response) {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["participant-types"],
      });
      toast.success(message || "Succès");
      setIsDeleteDialogOpen(false);
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/30 text-blue-700"
          size="icon"
          onClick={() => {
            setIsViewModalOpen(true);
          }}
        >
          <Eye className="size-4" />
        </Button>
        <Button
          className="bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-700"
          size="icon"
          disabled={!canManage}
          onClick={() => {
            setIsEditModalOpen(true);
          }}
        >
          <Edit className="size-4" />
        </Button>
        <Button
          className="bg-red-500/10 border-red-500/30 hover:bg-red-500/30 text-red-700"
          size="icon"
          disabled={!canManage || deleteMutation.isPending}
          onClick={() => {
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Edit Modal */}
      <ResponsiveModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Modifier le type de participant
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <ParticipantTypeForm
            initialData={currentItem}
            onClose={() => setIsEditModalOpen(false)}
          />
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* View Modal */}
      <ResponsiveModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Détails du type de participant
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <ParticipantTypeDetails participantType={currentItem} />
        </ResponsiveModalContent>
      </ResponsiveModal>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement le type de participant "{currentItem.label}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
