"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import IdCardSectionDuplicate from "@/components/idCard/idCardSectionDuplicate";
import { RelatedFiles } from "@/components/relatedFiles";
import { LinkButton } from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { markCardAsPrintedDuplicate } from "@/lib/actions/diplomaticCards/otherDependants";
import { formSections } from "../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	otherDependant,
	otherDependantDuplicata,
}: {
	otherDependant: any;
	otherDependantDuplicata: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		(otherDependantDuplicata?.documentStage === "accepted" ||
			otherDependantDuplicata?.documentStage === "confirmed" ||
			otherDependantDuplicata?.documentStage === "printed") &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		otherDependantDuplicata?.documentStage === "confirmed" ||
		otherDependantDuplicata?.documentStage === "printed";

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
							formSections={formSections.slice(0, 2)}
						/>
						<FormDocumentTwo
							person={otherDependant}
							formSections={formSections.slice(2)}
						/>
					</div>
					<div className="flex justify-end p-5">
						<LinkButton
							disabled={!canPreviewDocument}
							href={`/panel/diplomatic/other-dependants/duplicates/${otherDependantDuplicata?.id}/pdf/request-form-file?previousCard=${otherDependant.id}`}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionDuplicate
						person={otherDependant}
						personDuplicate={otherDependantDuplicata}
						updateFn={markCardAsPrintedDuplicate}
					/>
				</TabsContent>
				<TabsContent value="relatedFiles">
					<RelatedFiles
						person={otherDependant}
						personDiplomaticCardIdInputName="otherDependantDCId"
						personDiplomaticCardFilesPropName="otherDependantDCFiles"
						prefixFileKey="cartesDiplomatique"
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}

