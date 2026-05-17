import DiplomaticReportView from "../_components/diplomatic-report-view";
import { getDiplomaticReportData } from "@/features/diplomatic-cards/lib/reporting";

export default async function DiplomaticNewRequestsReportPage() {
	const records = await getDiplomaticReportData("new-requests");

	return (
		<DiplomaticReportView
			title="Rapport - Nouvelles demandes"
			description="Détail des demandes initiales de cartes diplomatiques."
			fileName="rapport-cartes-diplomatiques-nouvelles-demandes"
			sectionTitle="Nouvelles demandes"
			records={records}
		/>
	);
}
