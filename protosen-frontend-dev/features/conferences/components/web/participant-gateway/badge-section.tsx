"use client";
import { useMutation } from "@tanstack/react-query";
import { toJpeg } from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/features/conferences/types";
import { ParticipantBadge } from "./participant-badge";

type BadgeSectionParticipantGatewayProps = {
	registration: Participant;
};

export function BadgeSectionParticipantGateway({
	registration,
}: BadgeSectionParticipantGatewayProps) {
	const ticketContainerRef = useRef<HTMLDivElement>(null);

	const downloadMutation = useMutation({
		mutationFn: async () => {
			if (ticketContainerRef.current === null) {
				throw new Error("Badge non disponible");
			}
			const response = await toJpeg(ticketContainerRef.current, {
				width: 297,
				height: 420,
			});

			return response;
		},
		onSuccess: (data) => {
			const link = document.createElement("a");
			link.download = `badge-${registration.lastName}-${registration.firstName}.jpeg`;
			link.href = data;
			link.click();
			toast.success("Badge téléchargé avec succès!");
		},
		onError: (err) => {
			console.error(err.message);
			toast.error("Erreur lors du téléchargement du badge");
		},
	});

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Badge</h2>
			</div>

			<div className="flex flex-col gap-4 items-center">
				{registration.subscriptionStatus === "PAID" && (
					<Button
						className="self-end ml-auto"
						onClick={() => downloadMutation.mutate()}
						disabled={downloadMutation.isPending}
					>
						Télécharger votre badge{" "}
						{downloadMutation.isPending ? (
							<Loader2 className="size-4 ml-2 animate-spin" />
						) : (
							<Download className="size-4 ml-2" />
						)}
					</Button>
				)}
				<div ref={ticketContainerRef} className="grid place-items-center">
					{registration.ticket && registration.subscriptionStatus === "PAID" ? (
						<ParticipantBadge
							avatarUrl={registration.avatarUrl ?? ""}
							code={registration.code ?? ""}
							firstname={registration.firstName}
							lastname={registration.lastName}
							gender={registration.gender}
							jobTitle={
								registration.functionModel
									? registration.functionModel.name
									: registration.customFunction
										? registration.customFunction
										: ""
							}
							organisation={registration.organisation}
							participantId={registration.id}
						/>
					) : (
						<div className="text-center">
							Veuillez proccéder au paiment avant de pouvoir visualiser votre
							badge
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
