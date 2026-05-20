"use client";
import { formatDateFnsLocale, formatDateFnsTicket } from "@/lib/utils";
import { ConferenceRegistration } from "../../types";
import { ticketsTypes } from "../../lib/data";
import { TicketTemplate1 } from "../tickets/ticket-template-1";
import { TicketTemplate2 } from "../tickets/ticket-template-2";
import HotelCard from "../conference-details/accommodation-card";

type ParticipationInfosSectionProps = {
  registration: ConferenceRegistration;
};
export function ParticipationInfosSection({
  registration,
}: ParticipationInfosSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Titre de la conférence
          </h3>
          <p className="mt-1">{registration.conference.title}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Date d'inscription
          </h3>
          <p className="mt-1">{formatDateFnsLocale(registration.createdAt)}</p>
        </div>
      </div>
      <div className="col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">Ticket</h3>
        <div className="mt-1">
          {registration.ticket.colorTheme === ticketsTypes[0].value ? (
            <TicketTemplate1
              name={registration.ticket.name}
              price={registration.ticket.price}
              conferenceId={registration.ticket.conferenceId}
              date={`${formatDateFnsTicket(
                registration.conference.startDate
              )} - ${formatDateFnsTicket(registration.conference.endDate)}`}
              description={registration.ticket.description}
              id={registration.ticket.id}
              username={`${registration.lastName} ${registration.firstName}`}
              zoom={false}
              userImage={registration.avatarUrl || undefined}
              participantId={registration.id}
            />
          ) : (
            <TicketTemplate2
              name={registration.ticket.name}
              price={registration.ticket.price}
              conferenceId={registration.ticket.conferenceId}
              date={`${formatDateFnsTicket(
                registration.conference.startDate
              )} - ${formatDateFnsTicket(registration.conference.endDate)}`}
              description={registration.ticket.description}
              id={registration.ticket.id}
              username={`${registration.lastName} ${registration.firstName}`}
              zoom={false}
              userImage={registration.avatarUrl || undefined}
              participantId={registration.id}
            />
          )}
        </div>
      </div>
      <div className="space-y-4">
        {/* <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Selected Sessions
          </h3>
          <ul className="mt-1 space-y-1">
            {registration.sessions.map((session, index) => (
              <li key={index} className="text-sm">
                • {session}
              </li>
            ))}
          </ul>
        </div> */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Hébergement
          </h3>
          <div className="mt-1">
            {registration.conferenceAccommodation ? (
              <HotelCard
                accommodation={
                  registration.conferenceAccommodation?.accommodation
                }
                canSelectAccommodation={false}
              />
            ) : registration.customAccommodation ? (
              <p>{registration.customAccommodation}</p>
            ) : (
              <p>Aucun hébergement choisi</p>
            )}
          </div>
        </div>
        {/* <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Transportation Needed
          </h3>
          <p className="mt-1">
            {registration.transportationNeeded === "oui" ? "Yes" : "No"}
          </p>
        </div> */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Besoin de visa
          </h3>
          <p className="mt-1">{registration.visaNeeded ? "Oui" : "Non"}</p>
        </div>
      </div>
    </div>
  );
}
