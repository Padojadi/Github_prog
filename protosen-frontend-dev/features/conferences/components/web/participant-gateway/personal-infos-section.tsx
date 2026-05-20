"use client";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Participant } from "@/features/conferences/types";
import { formatDateFnsLocale } from "@/lib/utils";

type PersonalInfosSectionParticipantGatewayProps = {
	registration: Participant;
};
export function PersonalInfosSectionParticipantGateway({
	registration,
}: PersonalInfosSectionParticipantGatewayProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-white dark:bg-slate-950 rounded-xl max-w-3xl mx-auto border border-border p-6 animate-fade-in">
			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Nom complet
					</h3>
					<p className="mt-1">
						{registration.lastName} {registration.firstName}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">Email</h3>
					<p className="mt-1">{registration.email}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Numéro de téléphone
					</h3>
					<p className="mt-1">{registration.phone}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">Sexe</h3>
					<p className="mt-1">
						{registration.gender === "MALE" ? "Masculin" : "Féminin"}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Date de naissance
					</h3>
					<p className="mt-1">
						{formatDateFnsLocale(registration.dateOfBirth)}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Nationalité
					</h3>
					<p className="mt-1">{registration.nationality}</p>
				</div>
				{registration.conferenceParticipantType && (
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Catégorie de participant
						</h3>
						<p className="mt-1">
							{registration.conferenceParticipantType.label}
						</p>
					</div>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Entreprise/Organisation
					</h3>
					<p className="mt-1">{registration.organisation}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Fonction
					</h3>
					<div className="flex items-center gap-2 mt-1">
						<p>
							{registration.functionModel
								? registration.functionModel.name
								: "Autre"}
						</p>
						{registration.functionModel === null &&
							registration.customFunction && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Info className="size-4" />
										</TooltipTrigger>
										<TooltipContent>
											{registration.customFunction}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
					</div>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
					<p className="mt-1">{registration.address}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Ville & Code Postal
					</h3>
					<p className="mt-1">
						{registration.city}, {registration.postalCode}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">Pays</h3>
					<p className="mt-1">{registration.country}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Information de pièce d&apos;identité
					</h3>
					<p className="mt-1">
						{registration.identityType === "passport"
							? "Passport"
							: "Carte d'identité"}
						: {registration.identityNumber}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Date d'inscription
					</h3>
					<p className="mt-1">{formatDateFnsLocale(registration.createdAt)}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Besoin de visa
					</h3>
					<p className="mt-1">{registration.visaNeeded ? "Oui" : "Non"}</p>
				</div>
				{registration.supportOptions && registration.supportOptions.length > 0 && (
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Catégories de support demandées
						</h3>
						<p className="mt-1">
							{registration.supportOptions
								.map((s) => s.supportOption.label)
								.join(", ")}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
