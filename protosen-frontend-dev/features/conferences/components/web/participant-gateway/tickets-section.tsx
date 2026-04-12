"use client";
import { useMutation } from "@tanstack/react-query";
import { toJpeg } from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ticketsTypes } from "@/features/conferences/lib/data";
import type { Participant } from "@/features/conferences/types";
import { formatDateFnsTicket } from "@/lib/utils";
import { TicketTemplate1 } from "../../tickets/ticket-template-1";
import { TicketTemplate2 } from "../../tickets/ticket-template-2";

type TicketsSectionParticipantGatewayProps = {
	registration: Participant;
};

export function TicketsSectionParticipantGateway({
	registration,
}: TicketsSectionParticipantGatewayProps) {
	const ticketContainerRef = useRef<HTMLDivElement>(null);

	const downloadMutation = useMutation({
		mutationFn: async () => {
			if (ticketContainerRef.current === null) {
				throw new Error("Ticket non disponible");
			}
			const response = await toJpeg(ticketContainerRef.current, {
				width: 800,
				height: 300,
			});

			return response;
		},
		onSuccess: (data) => {
			const link = document.createElement("a");
			link.download = `ticket-${registration.lastName}-${registration.firstName}.jpeg`;
			link.href = data;
			link.click();
			toast.success("Ticket téléchargé avec succès!");
		},
		onError: (err) => {
			console.error(err.message);
			toast.error("Erreur lors du téléchargement du ticket");
		},
	});

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Ticket</h2>
			</div>

			<div className="flex flex-col gap-4 items-center">
				{registration.subscriptionStatus === "PAID" && (
					<Button
						className="self-end ml-auto"
						onClick={() => downloadMutation.mutate()}
						disabled={downloadMutation.isPending}
					>
						Télécharger votre ticket{" "}
						{downloadMutation.isPending ? (
							<Loader2 className="size-4 ml-2 animate-spin" />
						) : (
							<Download className="size-4 ml-2" />
						)}
					</Button>
				)}
				<div ref={ticketContainerRef} className="grid place-items-center">
					{registration.ticket && registration.subscriptionStatus === "PAID" ? (
						registration.ticket.colorTheme === ticketsTypes[0].value ? (
							<TicketTemplate1
								conferenceId={registration.conferenceId}
								date={`${formatDateFnsTicket(
									registration.conference.startDate,
								)} - ${formatDateFnsTicket(registration.conference.endDate)}`}
								description={registration.ticket.description}
								id={registration.ticket.id}
								name={registration.ticket.name}
								price={registration.ticket.price}
								username={`${registration.lastName} ${registration.firstName}`}
								userImage={registration.avatarUrl || undefined}
								code={registration.code || undefined}
								zoom={false}
								participantId={registration.id}
							/>
						) : (
							<TicketTemplate2
								conferenceId={registration.conferenceId}
								date={`${formatDateFnsTicket(
									registration.conference.startDate,
								)} - ${formatDateFnsTicket(registration.conference.endDate)}`}
								description={registration.ticket.description}
								id={registration.ticket.id}
								name={registration.ticket.name}
								price={registration.ticket.price}
								username={`${registration.lastName} ${registration.firstName}`}
								userImage={registration.avatarUrl || undefined}
								code={registration.code || undefined}
								zoom={false}
								participantId={registration.id}
							/>
						)
					) : (
						<div className="text-center">
							Veuillez proccéder au paiment avant de pouvoir visualiser votre
							ticket
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
