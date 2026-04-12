import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { deleteTicket } from "../../lib/ticket-apis";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteTicketDialogProps {
  id: string;
  disabled?: boolean;
}

export function DeleteTicketDialog({ id, disabled }: DeleteTicketDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let response = await deleteTicket(
        id,
        "Echec de suppression du ticket",
        "Ticket supprimé avec succès"
      );
      if ("code" in response) {
        console.error(response.code, response.message);
        throw new Error(response.message || "Échec de suppression du ticket");
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      toast.success(message || "Ticket supprimé avec succès");
      setOpen(false);
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onDelete = useCallback(async () => {
    deleteMutation.mutate();
  }, []);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="border-red-500 hover:border-red-600 hover:bg-red-600/30 text-red-500 hover:text-red-700"
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={disabled || deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <Loader2 className="size-4 mr-2" />
          ) : (
            <Trash className="mr-2" size={16} />
          )}
          <span>Supprimer le ticket</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Êtes-vous sûr de vouloir supprimer ce ticket?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Le ticket sera supprimé définitivement.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
