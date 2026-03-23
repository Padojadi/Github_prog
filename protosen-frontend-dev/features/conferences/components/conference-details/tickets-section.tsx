import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateFnsTicket } from "@/lib/utils";
import { useGetConferenceTickets } from "../../hooks/use-get-tickets";
import type { Conference } from "../../types";
import PassCard from "../conference-registration/pass-card";
import { DeleteTicketDialog } from "../tickets/delete-ticket-button";
import { TicketCreationModal } from "../tickets/ticket-creation-modal";
import { TicketEditionModal } from "../tickets/ticket-edition-modal";
import { TicketTemplate1 } from "../tickets/ticket-template-1";
import { TicketTemplate2 } from "../tickets/ticket-template-2";

type TicketsSectionProps = {
	conference: Conference;
	canCreate: boolean;
};

export function TicketsSection({ conference, canCreate }: TicketsSectionProps) {
	const { data: ticketsData, isLoading: ticketsLoading } =
		useGetConferenceTickets(conference.id);
	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Tickets</h2>
				{/* <p className="text-muted-foreground">
          Select the pass that best fits your needs for the Global Tech Summit
        </p> */}
			</div>

			{canCreate && (
				<div className="flex justify-end mt-4">
					<TicketCreationModal
						conferenceId={conference.id}
						date={`${formatDateFnsTicket(
							conference.startDate,
						)} - ${formatDateFnsTicket(conference.endDate)}`}
					/>
				</div>
			)}
			<div className="flex flex-col gap-4 items-center">
				<div className="space-y-4">
					{ticketsData?.data?.map((pass) => (
						<>
							{pass.colorTheme === "type-1" ? (
								<div className="flex flex-col gap-3">
									<TicketTemplate1
										key={pass.id}
										id={pass.id}
										name={pass.name}
										date={`${formatDateFnsTicket(
											conference.startDate,
										)} - ${formatDateFnsTicket(conference.endDate)}`}
										conferenceId={conference.id}
										description={pass.description}
										price={Number(pass.price.toFixed(2))}
										username="John Doe"
										zoom={false}
									/>
									{canCreate && (
										<div className="flex gap-2 items-center flex-wrap">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button>Voir le rendu pour les utilisateurs</Button>
													</TooltipTrigger>
													<TooltipContent className="p-6 border-border">
														<h5 className="font-semibold text-lg mb-3">
															Rendu du ticket pour les utilisateurs
														</h5>
														<PassCard
															name={pass.name}
															features={pass.description.split(",")}
															price={pass.price}
														/>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
											<TicketEditionModal
												initialData={pass}
												conferenceId={conference.id}
												date={`${formatDateFnsTicket(
													conference.startDate,
												)} - ${formatDateFnsTicket(conference.endDate)}`}
											/>
											<DeleteTicketDialog id={pass.id} />
										</div>
									)}
								</div>
							) : (
								<div className="flex flex-col gap-3">
									<TicketTemplate2
										key={pass.id}
										id={pass.id}
										name={pass.name}
										date={`${formatDateFnsTicket(
											conference.startDate,
										)} - ${formatDateFnsTicket(conference.endDate)}`}
										conferenceId={conference.id}
										description={pass.description}
										price={Number(pass.price.toFixed(2))}
										username="John Doe"
										zoom={false}
									/>
									{canCreate && (
										<div className="flex gap-2 items-center flex-wrap">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button>Voir le rendu pour les utilisateurs</Button>
													</TooltipTrigger>
													<TooltipContent className="p-6 border-border">
														<h5 className="font-semibold text-lg mb-3">
															Rendu du ticket pour les utilisateurs
														</h5>
														<PassCard
															name={pass.name}
															features={pass.description.split(",")}
															price={pass.price}
														/>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
											<TicketEditionModal
												initialData={pass}
												conferenceId={conference.id}
												date={`${formatDateFnsTicket(
													conference.startDate,
												)} - ${formatDateFnsTicket(conference.endDate)}`}
											/>
											<DeleteTicketDialog id={pass.id} />
										</div>
									)}
								</div>
							)}
						</>
					))}
				</div>
			</div>
		</div>
	);
}
