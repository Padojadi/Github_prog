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
	holder,
	holderDuplicate,
}: {
	holder: any;
	holderDuplicate: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		holderDuplicate?.documentStage === "RETURNED" &&
		currentUser?.role !== "user";
	const canPreviewDocument = holderDuplicate?.documentStage === "RETURNED";

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
						disabled={!holder?.ownerDiplomaticCardFiles}
					>
						Fichiers liés
					</TabsTrigger>
				</TabsList>
				<TabsContent value="requestFormfile">
					<div className="grid grid-cols-2 gap-4">
						<FormDocumentOne
							person={holder}
							formSections={formSections.slice(0, 3)}
						/>
						<FormDocumentTwo
							person={holder}
							formSections={formSections.slice(3)}
						/>
					</div>
					{/* <div className="flex justify-end p-5">
						<LinkButton
							disabled={!canPreviewDocument}
							href={`/panel/diplomatic/holders/renew/${holderRenew?.id}/pdf/request-form-file?previousCard=${holder.id}`}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div> */}
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionDuplicateReturned
						person={holder}
						personDuplicate={holderDuplicate}
					/>
				</TabsContent>
				<TabsContent value="relatedFiles">
					<RelatedFiles
						person={holder}
						personDiplomaticCardIdInputName="ownerDiplomaticCardId"
						personDiplomaticCardFilesPropName="ownerDiplomaticCardFiles"
						prefixFileKey="cartesDiplomatique"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
