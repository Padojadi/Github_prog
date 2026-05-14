"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import { RelatedFiles } from "@/components/relatedFiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdCardSectionReturned from "@/features/diplomatic-cards/returned/components/id-card-section-returned";
import useCurrentUser from "@/hooks/useCurrentUser";
import { formSections } from "../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	domesticAndRelative,
}: {
	domesticAndRelative: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		domesticAndRelative?.documentStage === "RETURNED" &&
		currentUser?.role !== "user";
	const canPreviewDocument = domesticAndRelative?.documentStage === "RETURNED";

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
						disabled={!domesticAndRelative?.domesticAndRelativeDCFiles}
					>
						Fichiers liés
					</TabsTrigger>
				</TabsList>
				<TabsContent value="requestFormfile">
					<div className="grid grid-cols-2 gap-4">
						<FormDocumentOne
							person={domesticAndRelative}
							formSections={formSections.slice(0, 3)}
						/>
						<FormDocumentTwo
							person={domesticAndRelative}
							formSections={formSections.slice(3)}
						/>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionReturned person={domesticAndRelative} />
				</TabsContent>
				<TabsContent value="relatedFiles">
					<RelatedFiles
						person={domesticAndRelative}
						personDiplomaticCardIdInputName="domesticAndRelativeDiplomaticCardId"
						personDiplomaticCardFilesPropName="domesticAndRelativeDCFiles"
						prefixFileKey="cartesDiplomatique"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
