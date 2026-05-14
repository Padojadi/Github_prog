"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import { RelatedFiles } from "@/components/relatedFiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdCardSectionRenewReturned from "@/features/diplomatic-cards/returned/components/id-card-section-renew-returned";
import useCurrentUser from "@/hooks/useCurrentUser";
import { formSections } from "../../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	child,
	childRenew,
}: {
	child: any;
	childRenew: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		childRenew?.documentStage === "RETURNED" && currentUser?.role !== "user";
	const canPreviewDocument = childRenew?.documentStage === "RETURNED";

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
					<TabsTrigger value="relatedFiles" disabled={!child?.childDCFiles}>
						Fichiers liés
					</TabsTrigger>
				</TabsList>
				<TabsContent value="requestFormfile">
					<div className="grid grid-cols-2 gap-4">
						<FormDocumentOne
							person={child}
							formSections={formSections.slice(0, 3)}
						/>
						<FormDocumentTwo
							person={child}
							formSections={formSections.slice(3)}
						/>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionRenewReturned person={child} personRenew={childRenew} />
				</TabsContent>
				<TabsContent value="relatedFiles">
					<RelatedFiles
						person={child}
						personDiplomaticCardIdInputName="childDiplomaticCardId"
						personDiplomaticCardFilesPropName="childDCFiles"
						prefixFileKey="cartesDiplomatique"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
