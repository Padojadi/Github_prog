"use client";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import PlateStatic from "@/components/editor/plate-static";
import { Button } from "@/components/ui/button";
import { getPaymentUrl } from "@/features/conferences/lib/participants-apis-client";
import type {
	Participant,
	ParticipantTokenData,
} from "@/features/conferences/types";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { PARTICIPANT_TOKEN_KEY } from "@/lib/constants";
import { cn, formatDateFnsLocale } from "@/lib/utils";
import StatusBadgeRegistration from "../../registration-details/status-badge-registration";

type OverviewSectionProps = {
	registration: Participant;
};

export function OverviewSectionParticipantGatewayWeb({
	registration,
}: OverviewSectionProps) {
	const { theme } = useTheme();
	const [token] = useSessionStorage<ParticipantTokenData>(
		PARTICIPANT_TOKEN_KEY,
	);

	const paymentMutation = useMutation({
		mutationFn: async () => {
			const response = await getPaymentUrl(
				token!.token,
				"Erreur lors du procès au paiement",
				"Lien du paiement récupéré avec succès",
			);

			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Erreur lors du procès au paiement",
				);
			}

			return response;
		},
		onSuccess: ({ message, data }) => {
			window.open(data.url, "_blank");
			// console.log(data);
		},
		onError: ({ message }) => {
			toast.error(message);
		},
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div className="lg:col-span-2 space-y-8">
				<div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in">
					<h3 className="text-xl font-medium mb-4">
						À propos de la conference
					</h3>
					<div
						className={cn(
							"w-full rounded-lg border-0",
							theme === "dark" && "dark",
						)}
						data-registry="plate"
					>
						{registration.conference.description && (
							<PlateStatic value={registration.conference.description} />
						)}
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "150ms" }}
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-medium">Inscription</h3>

						<StatusBadgeRegistration
							className=""
							status={registration.subscriptionStatus}
							reason={
								registration.subscriptionStatusHistory?.[0].rejectionReason ||
								undefined
							}
							size="md"
						/>
					</div>

					<div className="space-y-4">
						{registration.subscriptionStatus === "PENDING_PAYMENT" &&
						!registration.paydunyatoken ? (
							<Button
								className="w-full"
								disabled={paymentMutation.isPending}
								onClick={() => paymentMutation.mutate()}
							>
								Procéder au paiement
								{paymentMutation.isPending && (
									<Loader2 className="size-4 ml-2 animate-spin" />
								)}
							</Button>
						) : registration.subscriptionStatus === "PENDING_PAYMENT" &&
							registration.paydunyatoken ? (
							<Button className="w-full" disabled={true}>
								Paiement en cours de traitement
							</Button>
						) : registration.subscriptionStatus === "CANCELLED" ? (
							<Button
								className="w-full"
								disabled={paymentMutation.isPending}
								onClick={() => paymentMutation.mutate()}
							>
								Procéder au paiement
								{paymentMutation.isPending && (
									<Loader2 className="size-4 ml-2 animate-spin" />
								)}
							</Button>
						) : null}
					</div>
				</div>

				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "100ms" }}
				>
					<h3 className="text-xl font-medium mb-4">Informations sur le lieu</h3>
					<div className="flex items-center text-foreground/90 text-sm">
						<MapPin className="h-4 w-4 mr-2" />
						<span>{registration.conference.location}</span>
					</div>
				</div>

				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "300ms" }}
				>
					<h3 className="text-xl font-medium mb-4">
						Informations de la conférence
					</h3>

					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<p className="text-foreground">
								{formatDateFnsLocale(registration.conference.startDate)} -{" "}
								{formatDateFnsLocale(registration.conference.endDate)}
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<h4 className="font-medium">Demandeur</h4>
							<div className="flex items-center text-sm">
								<User className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">
									{registration.conference.firstName}{" "}
									{registration.conference.lastName},{" "}
									<span className="text-muted-foreground text-sm">
										{registration.conference.job}
									</span>
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-2 text-sm">
							<h4 className="font-medium text-base">Contact du Demandeur</h4>
							<div className="flex items-center">
								<Mail className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">
									{registration.conference.email}
								</p>
							</div>
							<div className="flex items-center">
								<Phone className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">
									{registration.conference.phone}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
