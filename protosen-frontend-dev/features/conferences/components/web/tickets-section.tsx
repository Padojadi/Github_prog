import type { ConferencePublic } from "../../types";
import PassCard from "../conference-registration/pass-card";

type TicketsSectionProps = {
	conference: ConferencePublic;
};

export function TicketsSectionWeb({ conference }: TicketsSectionProps) {
	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Tickets</h2>
			</div>

			<div className="flex flex-col gap-4 items-center">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
					{conference.tickets.length > 0 ? (
						conference.tickets.map((pass) => (
							<PassCard
								key={pass.id}
								name={pass.name}
								features={pass.description.split(",")}
								price={Number(pass.price.toFixed(2))}
							/>
						))
					) : (
						<div className="text-center">Aucun ticket pour le moment</div>
					)}
				</div>
			</div>
		</div>
	);
}
