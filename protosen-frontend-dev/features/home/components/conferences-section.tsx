"use client";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonCustom } from "@/components/ui/button-custom";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import {
	Conference,
	type ConferencePublicGetAll,
} from "@/features/conferences/types";
import { ConferenceCardHome } from "./conference-card";

type ConferencesSectionHomeProps = {
	conferences: ConferencePublicGetAll[];
};

export default function ConferencesSectionHome({
	conferences,
}: ConferencesSectionHomeProps) {
	const [api, setApi] = useState<CarouselApi>();

	const onPrevButtonClick = useCallback(() => {
		if (!api) return;
		api.scrollPrev();
	}, [api]);

	const onNextButtonClick = useCallback(() => {
		if (!api) return;
		api.scrollNext();
	}, [api]);

	return (
		<section id="conferences" className="py-16 bg-slate-50 dark:bg-slate-900">
			<div className="container-custom">
				{/* En-tête de section */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<div className="w-1 h-6 bg-[#00853F] rounded-full" />
							<span className="text-sm font-medium text-[#00853F] uppercase tracking-wider">
								Événements
							</span>
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-foreground">
							Conférences à Venir
						</h2>
						<p className="text-muted-foreground mt-2">
							Découvrez les prochaines conférences gouvernementales et
							inscrivez-vous
						</p>
					</div>

					<div className="mt-4 md:mt-0 flex items-center gap-2">
						<ButtonCustom
							variant="outline"
							size="icon"
							className="rounded-full border-slate-300 dark:border-slate-700"
							onClick={() => onPrevButtonClick()}
						>
							<ChevronLeft className="h-5 w-5" />
						</ButtonCustom>

						<ButtonCustom
							variant="outline"
							size="icon"
							className="rounded-full border-slate-300 dark:border-slate-700"
							onClick={() => onNextButtonClick()}
						>
							<ChevronRight className="h-5 w-5" />
						</ButtonCustom>

						<Link href="/conferences" className="ml-2">
							<Button
								variant="default"
								className="bg-[#00853F] hover:bg-[#006B32]"
							>
								Voir tout
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>

				{/* Carousel de conférences */}
				{conferences.length > 0 ? (
					<Carousel setApi={setApi}>
						<CarouselContent className="-ml-6 py-4 px-2">
							{conferences.map((conference) => (
								<CarouselItem
									key={conference.id}
									className="md:basis-1/2 lg:basis-1/3 pl-6"
								>
									<ConferenceCardHome conference={conference} className="" />
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				) : (
					<div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
						<Calendar className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-foreground mb-2">
							Aucune conférence programmée
						</h3>
						<p className="text-muted-foreground mb-4">
							De nouvelles conférences seront bientôt disponibles
						</p>
						<Link href="/conferences">
							<ButtonCustom variant="outline">Consulter l'agenda</ButtonCustom>
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
