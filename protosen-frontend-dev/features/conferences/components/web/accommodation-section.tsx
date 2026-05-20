import type { ConferencePublic } from "../../types";
import HotelCard from "../conference-details/accommodation-card";

type ConferenceDetailsAccommodationSectionProps = {
	conference: ConferencePublic;
};

export function ConferenceDetailsAccommodationSectionWeb({
	conference,
}: ConferenceDetailsAccommodationSectionProps) {
	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Options d'hébergement</h2>
				<p className="text-muted-foreground">
					Nous nous sommes associés à ces hôtels pour proposer des hébergements
					spéciaux pour les participants à la conférence
				</p>
			</div>

			{conference.conferenceAccommodations.length > 0 ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{conference.conferenceAccommodations.map((accommodation) => (
						<HotelCard
							key={accommodation.id}
							accommodation={accommodation.accommodation}
							canSelectAccommodation={false}
							isSelected={false}
						/>
					))}
				</div>
			) : (
				<div className="text-center">Aucun hébergement pour le moment</div>
			)}
		</div>
	);
}
