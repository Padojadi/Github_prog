"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { attachAccommodationToParticipant } from "@/features/conferences/lib/participants-apis-client";
import type {
	Participant,
	ParticipantTokenData,
} from "@/features/conferences/types";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { PARTICIPANT_TOKEN_KEY } from "@/lib/constants";
import HotelCard from "../../conference-details/accommodation-card";

type AccommodationSectionParticipantGatewayProps = {
	registration: Participant;
};

export function AccommodationSectionParticipantGateway({
	registration,
}: AccommodationSectionParticipantGatewayProps) {
	const queryClient = useQueryClient();
	const [token] = useSessionStorage<ParticipantTokenData>(
		PARTICIPANT_TOKEN_KEY,
	);

	const attachAccommodationMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await attachAccommodationToParticipant(
				id,
				token?.token || "",
				"Échec du changement de l'hébergement",
				"Hébergement changé avec succès",
			);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec du retrait de l'hébergement",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["current-participant"],
			});
			toast.success(message);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onAttachAccommodation = async (id: string) => {
		attachAccommodationMutation.mutate(id);
	};
	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Options d'hébergement</h2>
				<p className="text-muted-foreground">
					Vous pouvez changer d'hébergement si celui que vous avez sélectionné
					auparavant ne vous convient plus.
				</p>
			</div>

			{registration.conferenceAccommodation &&
			registration.conference.conferenceAccommodations.length > 0 ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{registration.conference.conferenceAccommodations.map(
						(accommodation) => (
							<HotelCard
								key={accommodation.id}
								accommodation={accommodation.accommodation}
								canSelectAccommodation={true}
								onChangeAccommodation={(id) =>
									onAttachAccommodation(accommodation.id)
								}
								disabled={attachAccommodationMutation.isPending}
								isSelected={
									accommodation.accommodation.id ===
									registration.conferenceAccommodation?.accommodation.id
								}
							/>
						),
					)}
				</div>
			) : registration.customAccommodation ? (
				<div className="text-center">{registration.customAccommodation}</div>
			) : (
				<div className="text-center">Aucun hébergement pour le moment</div>
			)}
		</div>
	);
}
