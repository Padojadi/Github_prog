import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { acceptConference, confirmConference } from "../../lib/apis";

interface AcceptConferenceDialogProps {
	id: string;
	confirm?: boolean;
	disabled?: boolean;
}

export function AcceptConferenceDialog({
	id,
	confirm,
	disabled,
}: AcceptConferenceDialogProps) {
	const queryClient = useQueryClient();
	const validateMutation = useMutation({
		mutationFn: async () => {
			const response = confirm
				? await confirmConference(id, "", "")
				: await acceptConference(id, "", "");
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

	const onValidate = async () => {
		validateMutation.mutate();
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className={cn(
						"text-white",
						confirm
							? "bg-green-500 hover:bg-green-500/90 hover:text-white"
							: "bg-blue-500 hover:bg-blue-500/90 hover:text-white",
					)}
					disabled={disabled || validateMutation.isPending}
				>
					{confirm ? "Confirmer" : "Accepter"}
					{confirm ? (
						<CheckCheck className="ml-2 h-4 w-4" />
					) : (
						<Check className="ml-2 h-4 w-4" />
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-foreground">
						Êtes-vous sûr de vouloir {confirm ? "confirmer" : "accepter"} cette
						conférence?
					</AlertDialogTitle>
					<AlertDialogDescription>
						{confirm
							? "Cette action est irréversible. La conférence sera confirmée et ne pourras plus être rejetée."
							: "La conférence sera acceptée."}
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
