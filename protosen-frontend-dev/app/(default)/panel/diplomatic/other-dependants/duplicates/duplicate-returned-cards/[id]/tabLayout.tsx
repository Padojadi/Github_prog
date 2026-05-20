"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import { RelatedFiles } from "@/components/relatedFiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdCardSectionDuplicateReturned from "@/features/diplomatic-cards/returned/components/id-card-section-duplicate-returned";
import useCurrentUser from "@/hooks/useCurrentUser";
import { formSections } from "../../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	otherDependant,
	otherDependantDuplicate,
}: {
	otherDependant: any;
	otherDependantDuplicate: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		otherDependantDuplicate?.documentStage === "RETURNED" &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		otherDependantDuplicate?.documentStage === "RETURNED";

	return (
		<>
			<button
				type="button"
				onClick={() => router.back()}
				className="btn mr-3 mb-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</button>
			<Tabs defaultValue="requestFormfile">
				<TabsList>
					<TabsTrigger value="requestFormfile">Document</TabsTrigger>
					<TabsTrigger value="idcard" disabled={!canPreviewCard}>
						Carte
					</TabsTrigger>
					<TabsTrigger
						value="relatedFiles"
						disabled={!otherDependant?.otherDependantDCFiles}
					>
						Fichiers liés
					</TabsTrigger>
				</TabsList>
				<TabsContent value="requestFormfile">
					<div className="grid grid-cols-2 gap-4">
						<FormDocumentOne
							person={otherDependant}
							formSections={formSections.slice(0, 3)}
						/>
						<FormDocumentTwo
							person={otherDependant}
							formSections={formSections.slice(3)}
						/>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionDuplicateReturned
						person={otherDependant}
						personDuplicate={otherDependantDuplicate}
					/>
				</TabsContent>
				<TabsContent value="relatedFiles">
					<RelatedFiles
						person={otherDependant}
						personDiplomaticCardIdInputName="otherDependantDiplomaticCardId"
						personDiplomaticCardFilesPropName="otherDependantDCFiles"
						prefixFileKey="cartesDiplomatique"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
