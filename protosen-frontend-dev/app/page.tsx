import { redirect } from "next/navigation";
import Footer from "@/components/layout/footer";
import WebNavbar from "@/components/layout/web-navbar";
import { getConferencesPublic } from "@/features/conferences/lib/apis-client";
import { isConferenceEnabled } from "@/features/conferences/lib/utils";
import type { ConferencePublicGetAll } from "@/features/conferences/types";
import ConferencesSectionHome from "@/features/home/components/conferences-section";
import HeroGov from "@/features/home/components/hero-gov";
import InstitutionSection from "@/features/home/components/institution-section";
import PartnersSection from "@/features/home/components/partners-section";
import ServicesSection from "@/features/home/components/services-section";
import StatsSection from "@/features/home/components/stats-section";

export default async function Home() {
	const conferencesEnabled = isConferenceEnabled();

	if (!conferencesEnabled) {
		redirect("/temp-home");
	}

	const data = await getConferencesPublic(1, 10, "");
	let conferences: ConferencePublicGetAll[];

	if ("code" in data) {
		conferences = [];
	} else {
		conferences = data.data.conferences;
	}

	return (
		<>
			<WebNavbar />
			<main className="bg-white dark:bg-slate-950">
				{/* Hero Section - Style gouvernemental avec recherche */}
				<HeroGov />

				{/* Section Actualités & Communiqués - À activer quand le backend sera prêt */}
				{/* <NewsSection /> */}

				{/* Section Services */}
				{conferencesEnabled && <ServicesSection />}

				{/* Section Conférences à venir */}
				{conferencesEnabled && (
					<ConferencesSectionHome conferences={conferences} />
				)}

				{/* Section Statistiques */}
				{conferencesEnabled && <StatsSection />}

				{/* Section Institution / À propos */}
				{conferencesEnabled && <InstitutionSection />}

				{/* Section Partenaires */}
				{conferencesEnabled && <PartnersSection />}
			</main>
			{conferencesEnabled && <Footer />}
		</>
	);
}
