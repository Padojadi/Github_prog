import DiplomaticReportView from "../_components/diplomatic-report-view";
import { getDiplomaticReportData } from "@/features/diplomatic-cards/lib/reporting";

export default async function DiplomaticTotalReportPage() {
	const records = await getDiplomaticReportData("total");

	return (
		<DiplomaticReportView
			title="Rapport - Cartes au total"
			description="Consolidation des nouvelles demandes, renouvellements et duplicatas."
			fileName="rapport-cartes-diplomatiques-total"
			sectionTitle="Cartes diplomatiques - Total"
			records={records}
		/>
	);
}
