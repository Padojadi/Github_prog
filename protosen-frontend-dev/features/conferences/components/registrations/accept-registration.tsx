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
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { acceptRegistration } from "../../lib/participants-apis";

interface AcceptRegistrationDialogProps {
  id: string;
  disabled?: boolean;
}

export function AcceptRegistrationDialog({
  id,
  disabled,
}: AcceptRegistrationDialogProps) {
  const queryClient = useQueryClient();
  const validateMutation = useMutation({
    mutationFn: async () => {
      let response = await acceptRegistration(
        id,
        "Échec d'acceptation de l'inscription",
        "Inscription acceptée avec succès"
      );
      if ("code" in response) {
        console.error(response.code, response.message);
        throw new Error(
          response.message || "Échec d'acceptation de l'inscription"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["conference-registrations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["conference-registration", id],
      });
      toast.success(message || "Inscription acceptée avec succès");
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onValidate = useCallback(async () => {
    validateMutation.mutate();
  }, []);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(
            "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-700"
          )}
          disabled={disabled || validateMutation.isPending}
        >
          Accepter
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Êtes-vous sûr de vouloir accepter cette inscription?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. L'inscription sera acceptée et ne
            pourras plus être rejetée."
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={validateMutation.isPending}
            onClick={onValidate}
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
