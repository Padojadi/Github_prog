"use client";
import { Calendar, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Suspense, useEffect, useState } from "react";
import LoadingComponent from "@/components/loadingComponent";
import { Button } from "@/components/ui/button";
import { TabsListNew, TabsNew, TabsTriggerNew } from "@/components/ui/tabs-new";
import { formatDateFnsLocale } from "@/lib/utils";
import type { TGetConferenceByIdPublicResponse } from "../../types/responses-types";
import { ConferenceDetailsAccommodationSectionWeb } from "./accommodation-section";
import { OverviewSectionWeb } from "./overview-section";
import { TicketsSectionWeb } from "./tickets-section";

export function ConferenceDetailsWeb({
	id,
	initialData,
}: {
	id: string;
	initialData: TGetConferenceByIdPublicResponse;
}) {
	// const { data, isLoading, error, refetch } = useGetConferencePublic(
	//   id,
	//   initialData
	// );

	const [isScrolled, setIsScrolled] = useState(false);
	const [activeTab, setActiveTab] = useQueryState("activeTab", {
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
		<Suspense fallback={<LoadingComponent />}>
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
							href="/conferences"
							className="inline-flex items-center text-foreground/80 hover:text-foreground transition-colors mb-6"
						>
							<ChevronLeft className="w-4 h-4 mr-1" /> Retour aux conférences
						</Link>

						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
									{initialData.data.title}
								</h1>
							</div>

							<div className="flex flex-wrap gap-2">
								<Link href={`/conferences/${id}/register`}>
									<Button className="bg-green-500 hover:bg-green-500/90 text-white font-medium">
										S'inscrire maintenant
									</Button>
								</Link>

								{/* <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button> */}
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-6 mt-8">
						<div className="flex items-center text-foreground/90">
							<Calendar className="h-5 w-5 mr-2" />
							<span>
								{formatDateFnsLocale(initialData.data.startDate)} -{" "}
								{formatDateFnsLocale(initialData.data.endDate)}
							</span>
						</div>

						<div className="flex items-center text-foreground/90">
							<MapPin className="h-5 w-5 mr-2" />
							<span>{initialData.data.location}</span>
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
							{initialData.data.title}
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
								value="passes"
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
						</TabsListNew>
					</TabsNew>
				</div>
			</div>

			<div className="flex-1 py-8">
				<div className="container-custom">
					{activeTab === "overview" && (
						<OverviewSectionWeb conference={initialData.data} />
					)}
					{activeTab === "passes" && (
						<TicketsSectionWeb conference={initialData.data} />
					)}
					{activeTab === "hotels" && (
						<ConferenceDetailsAccommodationSectionWeb
							conference={initialData.data}
						/>
					)}
				</div>
			</div>
		</Suspense>
	);
}
