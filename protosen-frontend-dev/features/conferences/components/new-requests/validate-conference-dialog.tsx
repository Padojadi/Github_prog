import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormShad,
} from "@/components/ui/form";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn, hasPermission } from "@/lib/utils";
import { confirmConference, validateConference } from "../../lib/apis";

interface ValidateConferenceDialogProps {
	id: string;
	disabled?: boolean;
}

const validateSchema = z.object({
	sendToPrimature: z.boolean().optional(),
});

type FormValues = z.infer<typeof validateSchema>;

export function ValidateConferenceDialog({
	id,
	disabled,
}: ValidateConferenceDialogProps) {
	const queryClient = useQueryClient();
	const currentUser = useCurrentUser();

	const canConfirm = hasPermission(
		currentUser?.accessGroup?.permissions || [],
		["CONFIRM_CONFERENCE_REQUEST"],
	);
	const form = useForm<FormValues>({
		resolver: zodResolver(validateSchema),
		defaultValues: {
			sendToPrimature: false,
		},
	});
	const validateMutation = useMutation({
		mutationFn: async (data: FormValues) => {
			const response = data.sendToPrimature
				? await validateConference(
						id,
						"Échec de validation de la conférence",
						"Conférence validée avec succès",
					)
				: await confirmConference(
						id,
						"Échec de confirmation de la conférence",
						"Conférence confirmée avec succès",
					);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de validation de la conférence",
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
			toast.success(message || "Conférence validée avec succès");
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onValidate = async (data: FormValues) => {
		validateMutation.mutate(data);
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className={cn(
						"text-white bg-emerald-500 hover:bg-emerald-500/90 hover:text-white",
					)}
					disabled={disabled || validateMutation.isPending}
				>
					Valider
					<CheckCheck className="ml-2 h-4 w-4" />
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
								Êtes-vous sûr de vouloir valider cette conférence?
							</AlertDialogTitle>
							<AlertDialogDescription>
								La conférence sera validée.
							</AlertDialogDescription>
						</AlertDialogHeader>
						{canConfirm && (
							<FormField
								control={form.control}
								name="sendToPrimature"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-start gap-x-2 border border-border p-4 rounded-lg">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="-mt-1">
												<FormLabel>
													Envoyer la conférence à la primature
												</FormLabel>
												<FormDescription>
													Si cette case est cochée la conférence sera envoyée à
													la primature
												</FormDescription>
												<FormMessage />
											</div>
										</div>
									</FormItem>
								)}
							/>
						)}

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
