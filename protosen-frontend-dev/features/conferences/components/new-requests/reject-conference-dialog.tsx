import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormShad,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { rejectConference, rejectDefinitelyConference } from "../../lib/apis";
import {
	conferenceRejectionDefaultValues,
	conferenceRejectionSchema,
	type TConferenceRejectionSchema,
} from "../../types/schema";

interface RejectConferenceDialogProps {
	id: string;
	permanentRejection: boolean;
	disabled?: boolean;
}

export function RejectConferenceDialog({
	id,
	permanentRejection,
	disabled,
}: RejectConferenceDialogProps) {
	const queryClient = useQueryClient();
	const form = useForm({
		resolver: zodResolver(conferenceRejectionSchema),
		defaultValues: conferenceRejectionDefaultValues,
	});
	const validateMutation = useMutation({
		mutationFn: async (data: TConferenceRejectionSchema) => {
			const response = permanentRejection
				? await rejectDefinitelyConference(
						id,
						data.reason,
						"Erreur de rejet définitif de conférence",
						"Conférence rejetée définitivement avec succès",
					)
				: await rejectConference(
						id,
						data.reason,
						"Erreur de rejet de conférence",
						"Conférence rejetée avec succès",
					);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de rejet de la demande conférence",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["conferences"],
			});
			queryClient.invalidateQueries({
				queryKey: ["status-history"],
			});
			toast.success(message || "Conférence rejetée avec succès");
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onValidate = async (data: TConferenceRejectionSchema) => {
		validateMutation.mutate(data);
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant={permanentRejection ? "destructive" : "outline"}
					className={cn(
						permanentRejection
							? ""
							: "bg-red-500/10 text-foreground border-red-500/30 hover:bg-red-500/20 hover:text-foreground hover:border-red-500/30",
					)}
					disabled={disabled || validateMutation.isPending}
				>
					{permanentRejection ? "Rejeter définitivement" : "Rejeter"}
					{permanentRejection ? (
						<Ban className="ml-2 h-4 w-4" />
					) : (
						<X className="ml-2 h-4 w-4" />
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<FormShad {...form}>
					<form
						onSubmit={form.handleSubmit(onValidate)}
						className="flex flex-col justify-between gap-5 h-full"
					>
						<AlertDialogHeader>
							<AlertDialogTitle className="text-foreground">
								Êtes-vous sûr de vouloir rejeter{" "}
								{permanentRejection && "définitivement"} cette conférence?
							</AlertDialogTitle>
							<AlertDialogDescription>
								La conférence sera rejetée{" "}
								{permanentRejection && "définitivement"}, veuillez ajouter une
								raison.
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
								disabled={validateMutation.isPending}
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
