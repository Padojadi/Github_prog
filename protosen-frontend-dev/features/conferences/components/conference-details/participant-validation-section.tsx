"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { transformZodErrorsGeneric } from "@/lib/errors";
import { useGetConferenceParticipantTypes } from "../../hooks/use-get-conference-participant-types";
import { assignParticipantTypes } from "../../lib/apis";

type ParticipantValidationSectionProps = {
	conferenceId: string;
};

const participantValidationSchema = z.object({
	participantTypes: z
		.array(
			z.object({
				participantTypeId: z
					.string()
					.min(1, "Veuillez sélectionner une catégorie de participant"),
				requiresValidation: z
					.boolean({
						message: "Veuillez sélectionner une catégorie de participant",
					})
					.default(false),
			}),
		)
		.min(1, "Veuillez sélectionner au moins une catégorie de participant"),
});

type FormValues = z.infer<typeof participantValidationSchema>;

export function ParticipantValidationSection({
	conferenceId,
}: ParticipantValidationSectionProps) {
	const queryClient = useQueryClient();
	const { data, isError, isLoading, refetch } =
		useGetConferenceParticipantTypes(conferenceId);

	const availableParticipantTypes = useMemo(
		() => (data ? data.all.data : []),
		[data],
	);

	const assignedCategories = useMemo(
		() =>
			data
				? data.conferenceId.data.map((item) => ({
						id: item.participantTypeId,
						label: item.label,
						description: item.description,
						requiresValidation: item.requiresValidation,
					}))
				: [],
		[data],
	);

	const [participantTypes, setParticipantTypes] = useState(assignedCategories);
	const [validationStep, setValidationStep] = useState<"assign" | "configure">(
		"assign",
	);

	const categoriesRequiringValidationIds = useMemo(
		() =>
			participantTypes ? participantTypes.map((category) => category.id) : [],
		[participantTypes],
	);

	const unassignedCategories = useMemo(
		() =>
			data
				? data.all.data.filter(
						(cat) => !categoriesRequiringValidationIds.includes(cat.id),
					)
				: [],
		[data, categoriesRequiringValidationIds],
	);

	const assignMutation = useMutation({
		mutationFn: async (data: FormValues) => {
			const response = await assignParticipantTypes(
				{
					conferenceId,
					participantTypes: data.participantTypes,
				},
				"Échec de l'assignation des catégories de participant",
				"Catégories de participant assignées avec succès!",
			);

			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message ||
						"Échec de l'assignation des catégories de participant",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["participant-types-conference", conferenceId],
			});
			toast.success(message);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onAssign = async (data: FormValues) => {
		const validationResult = participantValidationSchema.safeParse(data);

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
		assignMutation.mutate(data);
	};

	const handleCategoryAssignment = (
		categoryId: string,
		isAssigned: boolean,
	) => {
		const participantType = availableParticipantTypes.find(
			(category) => category.id === categoryId,
		);
		if (participantTypes.length === 0) {
			if (participantType) {
				setParticipantTypes([
					{
						...participantType,
						requiresValidation: false,
					},
				]);
			}
		} else {
			if (isAssigned) {
				if (participantType) {
					setParticipantTypes((prev) => [
						...prev,
						{
							...participantType,
							requiresValidation: false,
						},
					]);
				}
			} else {
				setParticipantTypes((prev) =>
					prev.filter((category) => category.id !== categoryId),
				);
			}
		}

		const categoryName = data?.all.data.find((c) => c.id === categoryId)?.label;
		toast.success(
			isAssigned
				? `${categoryName} categorie assignée à la conférence`
				: `${categoryName} categorie retirée de la conférence`,
		);
	};

	const handleCategoryValidationChange = (
		categoryId: string,
		requiresValidation: boolean,
	) => {
		setParticipantTypes((prev) =>
			prev.map((category) =>
				category.id === categoryId
					? { ...category, requiresValidation }
					: category,
			),
		);
		toast.success(`Mise à jour des catégories à valider pour la conférence`);
	};

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold mb-3">
						Gestion des catégories de participants
					</h2>
					<p className="text-muted-foreground">
						Attribuez d'abord des catégories de participants à la conférence,
						puis configurez les conditions de validation.
					</p>
				</div>

				{/* Step Navigation */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center space-x-4">
						<Button
							variant={validationStep === "assign" ? "default" : "outline"}
							onClick={() => setValidationStep("assign")}
							className="flex items-center"
						>
							<span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mr-2">
								1
							</span>
							Assiger les catégories
						</Button>
						<div className="w-8 h-px bg-border"></div>
						<Button
							variant={validationStep === "configure" ? "default" : "outline"}
							onClick={() => setValidationStep("configure")}
							disabled={participantTypes.length === 0}
							className="flex items-center"
						>
							<span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mr-2">
								2
							</span>
							Configurer les catégories à valider
						</Button>
					</div>
				</div>

				{validationStep === "assign" && (
					<div className="bg-card rounded-xl border border-border p-6">
						<div className="flex items-center mb-6">
							<Plus className="w-5 h-5 mr-2 text-primary" />
							<h3 className="text-xl font-medium">
								Étape 1 : Assigner des catégories de participants
							</h3>
						</div>

						<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-600/15 rounded-lg">
							<p className="text-blue-800 text-sm">
								Sélectionnez les catégories de participants qui seront
								disponibles lors de l'inscription à la conférence. Seules les
								catégories assignées apparaîtront sur le formulaire
								d'inscription.
							</p>
						</div>

						{isLoading ? (
							<div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
								<div className="space-y-2">
									<Skeleton className="w-96 h-5" />
									<Skeleton className="w-full h-5" />
								</div>
							</div>
						) : isError ? (
							<div className="text-center space-y-4 flex items-center justify-center">
								<p className="text-red-500">Une erreur est survenue</p>
								<Button type="button" onClick={() => refetch()}>
									Rééssayer
								</Button>
							</div>
						) : data ? (
							<>
								{participantTypes.length > 0 && (
									<div className="mb-8">
										<h4 className="font-medium text-green-800 mb-4 flex items-center">
											<Check className="w-4 h-4 mr-2" />
											Catégories assignées ({participantTypes.length})
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{participantTypes.map((category) => (
												<div
													key={category.id}
													className="flex items-start space-x-3 p-4 border border-green-200 bg-green-50 dark:bg-green-600/15 dark:border-green-800/30 rounded-lg"
												>
													<Checkbox
														id={`assigned-${category.id}`}
														checked={true}
														onCheckedChange={(checked) =>
															handleCategoryAssignment(
																category.id,
																checked as boolean,
															)
														}
														className="mt-1"
													/>
													<div className="flex-1">
														<label
															htmlFor={`assigned-${category.id}`}
															className="font-medium text-sm cursor-pointer"
														>
															{category.label}
														</label>
														<p className="text-sm text-muted-foreground mt-1">
															{category.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{unassignedCategories.length > 0 && (
									<div>
										<h4 className="font-medium text-muted-foreground mb-4">
											Catégories disponibles ({unassignedCategories.length})
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{unassignedCategories.map((category) => (
												<div
													key={category.id}
													className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
												>
													<Checkbox
														id={`available-${category.id}`}
														checked={false}
														onCheckedChange={(checked) =>
															handleCategoryAssignment(
																category.id,
																checked as boolean,
															)
														}
														className="mt-1"
													/>
													<div className="flex-1">
														<label
															htmlFor={`available-${category.id}`}
															className="font-medium text-sm cursor-pointer"
														>
															{category.label}
														</label>
														<p className="text-sm text-muted-foreground mt-1">
															{category.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center max-w-lg mx-auto">
								Aucune catégorie de participant pour le moment veuillez les
								créer dans la section catégorie de participants
							</div>
						)}

						<div className="mt-6 flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								{participantTypes.length} catégories assignées à cette
								conférence
							</p>
							<Button
								onClick={() => setValidationStep("configure")}
								disabled={participantTypes.length === 0}
							>
								Suivant: Configurer la validation
							</Button>
						</div>
					</div>
				)}

				{validationStep === "configure" && (
					<div className="bg-card rounded-xl border border-border p-6">
						<div className="flex items-center mb-6">
							<Shield className="w-5 h-5 mr-2 text-primary" />
							<h3 className="text-xl font-medium">
								Étape 2: Configurer les catégories à valider
							</h3>
						</div>

						<div className="mb-6 p-4 bg-amber-50 dark:bg-amber-600/15 rounded-lg">
							<p className="text-amber-800 text-sm">
								Sélectionnez les catégories assignées qui nécessitent une
								validation manuelle avant l'approbation de l'inscription. Les
								participants qui choisissent ces catégories devront obtenir
								l'approbation de l'administrateur pour avant de compléter leur
								inscription .
							</p>
						</div>

						<div className="space-y-4">
							{participantTypes.map((category) => (
								<div
									key={category.id}
									className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
								>
									<Checkbox
										id={`validation-${category.id}`}
										checked={category.requiresValidation}
										onCheckedChange={(checked) =>
											handleCategoryValidationChange(
												category.id,
												checked as boolean,
											)
										}
										className="mt-1"
									/>
									<div className="flex-1">
										<label
											htmlFor={`validation-${category.id}`}
											className="font-medium text-sm cursor-pointer"
										>
											{category.label}
										</label>
										<p className="text-sm text-muted-foreground mt-1">
											{category.description}
										</p>
										{category.requiresValidation && (
											<div className="mt-2 flex items-center text-xs text-amber-600 bg-amber-50 dark:bg-amber-600/15 px-2 py-1 rounded">
												<Shield className="w-3 h-3 mr-1" />
												Validation requise
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-600/15 rounded-lg">
							<h4 className="font-medium text-blue-900 mb-2">
								Processus de validation
							</h4>
							<div className="text-sm text-blue-800 space-y-1">
								<p>
									• Les participants sélectionnant des catégories avec
									validation devront obtenir l'approbation de l'administrateur
								</p>
								<p>
									• Les demandes de validation apparaîtront dans la section de
									gestion des inscriptions
								</p>
								<p>
									• Les participants seront informés de la validation ou du
									rejet de leur inscription sur le site
								</p>
							</div>
						</div>

						<div className="mt-6 flex justify-between items-center">
							<Button
								variant="outline"
								onClick={() => setValidationStep("assign")}
							>
								Retour: Assigner les catégories
							</Button>
							<Button
								disabled={assignMutation.isPending}
								onClick={() =>
									onAssign({
										participantTypes: participantTypes.map((category) => ({
											participantTypeId: category.id,
											requiresValidation: category.requiresValidation,
										})),
									})
								}
							>
								Sauvegarder les paramètres de validation{" "}
								{assignMutation.isPending && (
									<Loader2 className="ml-2 size-4 animate-spin" />
								)}
							</Button>
						</div>
					</div>
				)}

				{/* <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-xl font-medium">Paramètres de validation</h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="w-96 h-5" />
                  <Skeleton className="w-full h-5" />
                </div>
              </div>
            ) : isError ? (
              <div className="text-center space-y-4 flex items-center justify-center">
                <p className="text-red-500">Une erreur est survenue</p>
                <Button type="button" onClick={() => refetch()}>
                  Rééssayer
                </Button>
              </div>
            ) : data && data?.all.data.length > 0 ? (
              data.all.data.map((category) => (
                <div
                  key={category.id}
                  className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={categoriesRequiringValidationIds.includes(
                      category.id
                    )}
                    onCheckedChange={(checked) =>
                      handleCategoryValidationChange(
                        category.id,
                        checked as boolean
                      )
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`category-${category.id}`}
                      className="font-medium text-sm cursor-pointer"
                    >
                      {category.label}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    {categoriesRequiringValidationIds.includes(category.id) && (
                      <div className="mt-2 flex items-center text-xs text-amber-600 bg-amber-50 dark:bg-amber-600/15 px-2 py-1 rounded">
                        <Shield className="w-3 h-3 mr-1" />
                        Validation requise
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center max-w-lg mx-auto">
                Aucune catégorie de participant pour le moment veuillez les
                créer dans la section catégorie de participants
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button>Sauvegarder les paramètres de validation</Button>
          </div>
        </div> */}
			</div>
		</div>
	);
}
