import DiplomaticReportView from "../_components/diplomatic-report-view";
import { getDiplomaticReportData } from "@/features/diplomatic-cards/lib/reporting";

export default async function DiplomaticRenewalsReportPage() {
	const records = await getDiplomaticReportData("renewals");

	return (
		<DiplomaticReportView
			title="Rapport - Renouvellements"
			description="Détail des renouvellements de cartes diplomatiques."
			fileName="rapport-cartes-diplomatiques-renouvellements"
			sectionTitle="Renouvellements"
			records={records}
		/>
	);
}
