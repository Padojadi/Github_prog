import DiplomaticReportView from "../_components/diplomatic-report-view";
import { getDiplomaticReportData } from "@/features/diplomatic-cards/lib/reporting";

export default async function DiplomaticDuplicatesReportPage() {
	const records = await getDiplomaticReportData("duplicates");

	return (
		<DiplomaticReportView
			title="Rapport - Duplicatas"
			description="Détail des demandes de duplicata des cartes diplomatiques."
			fileName="rapport-cartes-diplomatiques-duplicatas"
			sectionTitle="Duplicatas"
			records={records}
		/>
	);
}
