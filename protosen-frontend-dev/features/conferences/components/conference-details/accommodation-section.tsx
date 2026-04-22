import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { transformZodErrorsGeneric } from "@/lib/errors";
import {
	useGetAccommodations,
	useGetConferenceAccommodations,
} from "../../hooks/use-get-accommodations";
import {
	attachAccommodationToConference,
	removeAccommodationFromConference,
} from "../../lib/accomodations-apis";
import { updateCreatedConference } from "../../lib/apis";
import { AccommodationCreationModal } from "../accomodations/accommodation-creation-modal";
import HotelCard from "./accommodation-card";

type ConferenceDetailsAccommodationSectionProps = {
	conferenceId: string;
	canCreate: boolean;
	canEditCreated: boolean;
};

const addAccommodationsSchema = z.object({
	conferenceId: z.string().min(1, "L'id de la conférence est requis"),
	accommodationIds: z
		.array(z.string())
		.min(1, "Veuillez sélectioner un hébergement"),
});

type FormValues = z.infer<typeof addAccommodationsSchema>;

export function ConferenceDetailsAccommodationSection({
	conferenceId,
	canCreate,
	canEditCreated,
}: ConferenceDetailsAccommodationSectionProps) {
	const queryClient = useQueryClient();
	const { data: accommodationsData, isLoading: accommodationsLoading } =
		useGetAccommodations();

	const {
		data: conferenceAccommodationsData,
		isLoading: conferenceAccommodationsLoading,
	} = useGetConferenceAccommodations(conferenceId);

	const [selectedAccommodations, setSelectedAccommodations] = useState<
		string[]
	>([]);

	const editCreatedMutation = useMutation({
		mutationFn: async (
			data: FormValues & {
				actionType: "add" | "remove";
			},
		) => {
			const response = await attachAccommodationToConference(
				{
					...data,
				},
				"Échec de l'ajout des hébergements",
				"Hébergements ajoutés avec succès",
			);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de l'ajout des hébergements",
				);
			}
			response.message =
				data.actionType === "add"
					? "Hébergement ajouté avec succès"
					: "Hébergement retiré avec succès";
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["accommodations", conferenceId],
			});
			toast.success(message);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onEditCreated = async (
		newAccommodations: string[],
		actionType: "add" | "remove",
	) => {
		const data = {
			conferenceId,
			accommodationIds: newAccommodations,
		};
		console.log(data);

		const validationResult = addAccommodationsSchema.safeParse(data);

		if (!validationResult.success) {
			toast.error(
				<ul className="list-disc pl-4">
					{transformZodErrorsGeneric(
						validationResult.error.flatten().fieldErrors,
					).map((item) => (
						<li key={item.label}>
							<span className="font-semibold">{item.label}:</span>
							{item.message}
						</li>
					))}
				</ul>,
				{
					duration: 5000,
				},
			);
			return;
		}
		editCreatedMutation.mutate({
			...data,
			actionType,
		});
	};

	// remove accommodation
	const removeAccommodationMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await removeAccommodationFromConference(
				id,
				conferenceId,
				"Échec du retrait de l'hébergement",
				"Hébergement retiré avec succès",
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
				queryKey: ["accommodations", conferenceId],
			});
			toast.success(message);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onRemoveAccommodation = async (id: string) => {
		removeAccommodationMutation.mutate(id);
	};

	useEffect(() => {
		if (conferenceAccommodationsData?.data) {
			setSelectedAccommodations(
				conferenceAccommodationsData.data.map((item) => item.accommodationId),
			);
		}
	}, [conferenceAccommodationsData]);

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-3xl mx-auto text-center mb-12">
				<h2 className="text-2xl font-bold mb-3">Options d'hébergement</h2>
				<p className="text-muted-foreground">
					Nous nous sommes associés à ces hôtels pour proposer des hébergements
					spéciaux pour les participants à la conférence
				</p>
			</div>
			{(canCreate || canEditCreated) && (
				<div className="flex justify-end mt-4 gap-2">
					<AccommodationCreationModal conferenceId={conferenceId} />
				</div>
			)}

			{accommodationsLoading ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from([0, 1, 2]).map((v, index) => (
						<div
							key={v}
							className="rounded-xl relative border border-border space-y-4 overflow-hidden bg-white dark:bg-slate-950 transition-all duration-200 p-6"
						>
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
						</div>
					))}
				</div>
			) : accommodationsData ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{accommodationsData?.data.map((accommodation) => (
						<HotelCard
							key={accommodation.id}
							accommodation={accommodation}
							canSelectAccommodation={canCreate || canEditCreated}
							isSelected={selectedAccommodations.includes(accommodation.id)}
							onSelect={async (id) => {
								const newAccommodations = [...selectedAccommodations, id];
								await onEditCreated(newAccommodations, "add");
							}}
							disabled={editCreatedMutation.isPending}
							onRemove={async (id) => {
								await onRemoveAccommodation(id);
							}}
						/>
					))}
				</div>
			) : (
				<div className="text-center">Aucun hébergement pour le moment</div>
			)}
		</div>
	);
}
