"use client";
import { Calendar, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import LoadingComponent from "@/components/loadingComponent";
import { TabsListNew, TabsNew, TabsTriggerNew } from "@/components/ui/tabs-new";
import { useGetCurrentParticipant } from "@/features/conferences/hooks/use-get-current-participant";
import type { ParticipantTokenData } from "@/features/conferences/types";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { PARTICIPANT_TOKEN_KEY } from "@/lib/constants";
import { formatDateFnsLocale } from "@/lib/utils";
import { AccommodationSectionParticipantGateway } from "./accommodation-section";
import { BadgeSectionParticipantGateway } from "./badge-section";
import { OverviewSectionParticipantGatewayWeb } from "./overview-section";
import { PersonalInfosSectionParticipantGateway } from "./personal-infos-section";
import { TicketsSectionParticipantGateway } from "./tickets-section";

export function ConferenceAndRegistrationDetailsWeb() {
	const [token] = useSessionStorage<ParticipantTokenData>(
		PARTICIPANT_TOKEN_KEY,
	);

	const { data, isLoading } = useGetCurrentParticipant(token?.token ?? "");

	const [isScrolled, setIsScrolled] = useState(false);
	const [activeTab, setActiveTab] = useQueryState("tab", {
		defaultValue: "overview",
	});

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 350);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{isLoading ? (
				<div className="py-32 flex justify-center">
					<LoadingComponent />
				</div>
			) : data ? (
				<>
					<section
						className="pt-24 pb-12 relative bg-cover bg-center bg-conference-details-hero dark:bg-conference-details-hero-dark"
						style={{
							height: "400px",
						}}
					>
						<div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/70 dark:from-black/40 dark:to-black/70" />
						<div className="container-custom relative z-10 h-full flex flex-col justify-between">
							<div>
								<Link
									href="/"
									className="inline-flex items-center text-foreground/80 hover:text-foreground transition-colors mb-6"
								>
									<ChevronLeft className="w-4 h-4 mr-1" /> Retour à
									l&apos;acceuil
								</Link>

								<div className="flex flex-wrap items-start justify-between gap-4">
									<div>
										<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
											{data.data.conference.title}
										</h1>
									</div>
								</div>
							</div>

							<div className="flex flex-wrap gap-6 mt-8">
								<div className="flex items-center text-foreground/90">
									<Calendar className="h-5 w-5 mr-2" />
									<span>
										{formatDateFnsLocale(data.data.conference.startDate)} -{" "}
										{formatDateFnsLocale(data.data.conference.endDate)}
									</span>
								</div>

								<div className="flex items-center text-foreground/90">
									<MapPin className="h-5 w-5 mr-2" />
									<span>{data.data.conference.location}</span>
								</div>

								{/* <div className="flex items-center text-white/90">
            <Users className="h-5 w-5 mr-2" />
            <span>
              {conference.attendees}/{conference.capacity} Attendees
            </span>
          </div> */}
							</div>
						</div>
					</section>

					<div
						className={`sticky top-20 z-40 w-full bg-white dark:bg-slate-950 transition-all duration-300 ${
							isScrolled ? "translate-y-0 shadow-sm" : "-translate-y-full"
						}`}
					>
						<div className="container-custom py-2">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-medium truncate">
									{data.data.conference.title}
								</h2>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-slate-950">
						<div className="container-custom">
							<TabsNew
								defaultValue="overview"
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsListNew className="w-full justify-start bg-transparent border-b-0 p-0 h-auto">
									<TabsTriggerNew
										value="overview"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										À propos
									</TabsTriggerNew>
									<TabsTriggerNew
										value="ticket"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Tickets
									</TabsTriggerNew>
									<TabsTriggerNew
										value="hotels"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Hébergements
									</TabsTriggerNew>
									<TabsTriggerNew
										value="register-infos"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Informations d'inscription
									</TabsTriggerNew>
									<TabsTriggerNew
										value="badge"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Badge
									</TabsTriggerNew>
								</TabsListNew>
							</TabsNew>
						</div>
					</div>

					<div className="flex-1 py-8">
						<div className="container-custom">
							{activeTab === "overview" && (
								<OverviewSectionParticipantGatewayWeb
									registration={data.data}
								/>
							)}
							{activeTab === "ticket" && (
								<TicketsSectionParticipantGateway registration={data.data} />
							)}
							{activeTab === "hotels" && (
								<AccommodationSectionParticipantGateway
									registration={data.data}
								/>
							)}
							{activeTab === "register-infos" && (
								<PersonalInfosSectionParticipantGateway
									registration={data.data}
								/>
							)}
							{activeTab === "badge" && (
								<BadgeSectionParticipantGateway registration={data.data} />
							)}
						</div>
					</div>
				</>
			) : (
				<div className="text-center flex flex-col justify-center items-center py-32">
					<p className="text-sm font-medium">Informations non trouvées</p>
				</div>
			)}
		</>
	);
}
