import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Row } from "@tanstack/react-table";
import { useCallback, useState } from "react";
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
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConferenceRegistration } from "../../types";
import Link from "next/link";
import { deleteConference } from "../../lib/apis";
import { hasPermission } from "@/lib/utils";
import { Check, Eye, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  conferenceRejectionDefaultValues,
  conferenceRejectionSchema,
  TConferenceRejectionSchema,
} from "../../types/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormShad,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  acceptRegistration,
  rejectRegistration,
} from "../../lib/participants-apis";
import { toast } from "sonner";

type ActionColumnProps = {
  currentItem: Row<ConferenceRegistration>["original"];
};

export function ActionColumn({ currentItem }: ActionColumnProps) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);

  const canView = hasPermission(currentUser?.accessGroup?.permissions || [], [
    "MANAGE_CONFERENCES",
  ]);

  const canValidate =
    hasPermission(currentUser?.accessGroup?.permissions || [], [
      "MANAGE_CONFERENCES",
    ]) && currentItem?.subscriptionStatus === "PROCESSING";

  const canReject =
    hasPermission(currentUser?.accessGroup?.permissions || [], [
      "MANAGE_CONFERENCES",
    ]) && currentItem?.subscriptionStatus === "PROCESSING";

  const form = useForm({
    resolver: zodResolver(conferenceRejectionSchema),
    defaultValues: conferenceRejectionDefaultValues,
  });

  // validation
  const validateMutation = useMutation({
    mutationFn: async () => {
      let response = await acceptRegistration(
        currentItem.id,
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
        queryKey: ["conference-registration", currentItem.id],
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

  // rejection
  const rejectMutation = useMutation({
    mutationFn: async (data: TConferenceRejectionSchema) => {
      let response = await rejectRegistration(
        currentItem.id,
        { rejectionReason: data.reason },
        "Erreur de rejet de l'inscription",
        "Inscription rejetée avec succès"
      );
      if ("code" in response) {
        console.error(response.code, response.message);
        throw new Error(response.message || "Échec de rejet de l'inscription");
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["conference-registrations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["conference-registration", currentItem.id],
      });
      toast.success(message || "Inscription rejetée avec succès");
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onReject = useCallback(async (data: TConferenceRejectionSchema) => {
    rejectMutation.mutate(data);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <Link
          href={`/panel/conferences/${currentItem.conferenceId}/registrations/${currentItem.id}`}
        >
          <Button
            className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/30 text-blue-700"
            size="icon"
            title="Voir les détails"
          >
            <Eye className="size-4" />
          </Button>
        </Link>

        {canValidate && (
          <Button
            className="bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-700"
            size="icon"
            disabled={!canValidate}
            onClick={() => {
              setIsValidateDialogOpen(true);
            }}
          >
            <Check className="size-4" />
          </Button>
        )}
        {canReject && (
          <Button
            className="bg-red-500/10 border-red-500/30 hover:bg-red-500/30 text-red-700"
            size="icon"
            disabled={!canReject}
            onClick={() => {
              setIsDeleteDialogOpen(true);
            }}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <AlertDialog
        open={isValidateDialogOpen}
        onOpenChange={setIsValidateDialogOpen}
      >
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <FormShad {...form}>
            <form
              onSubmit={form.handleSubmit(onReject)}
              className="flex flex-col justify-between gap-5 h-full"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Êtes-vous sûr de vouloir rejeter cette inscription?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  L'inscription sera rejetée, veuillez ajouter une raison.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Raison du rejet
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Entrer une raison..."
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
                <AlertDialogAction
                  disabled={rejectMutation.isPending}
                  type="submit"
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </FormShad>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
