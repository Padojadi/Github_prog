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
import { toast } from "react-toastify";
import { useCallback } from "react";
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
import { X } from "lucide-react";
import { rejectRegistration } from "../../lib/participants-apis";

interface RejectConferenceDialogProps {
  id: string;
  disabled?: boolean;
}

export function RejectRegistrationDialog({
  id,
  disabled,
}: RejectConferenceDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(conferenceRejectionSchema),
    defaultValues: conferenceRejectionDefaultValues,
  });
  const rejectMutation = useMutation({
    mutationFn: async (data: TConferenceRejectionSchema) => {
      let response = await rejectRegistration(
        id,
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
        queryKey: ["conference-registration", id],
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="bg-red-500/10 border-red-500/30 hover:bg-red-500/30 text-red-700"
          disabled={disabled || rejectMutation.isPending}
        >
          Rejeter
          <X className="ml-2 h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
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
  );
}
