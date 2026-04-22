"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import IdCardSectionRenew from "@/components/idCard/idCardSectionRenew";
import { RelatedFiles } from "@/components/relatedFiles";
import { LinkButton } from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DependantsSectionRenew } from "@/features/diplomatic-cards/renew/components/holder/dependants-section-renew";
import useCurrentUser from "@/hooks/useCurrentUser";
import { markCardAsPrintedRenew } from "@/lib/actions/diplomaticCards/holders";
import { formSections } from "../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	holder,
	holderRenew,
}: {
	holder: any;
	holderRenew: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		(holderRenew?.documentStage === "accepted" ||
			holderRenew?.documentStage === "confirmed" ||
			holderRenew?.documentStage === "printed") &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		holderRenew?.documentStage === "confirmed" ||
		holderRenew?.documentStage === "printed";

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
					<TabsTrigger value="dependants">Dépendants</TabsTrigger>
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
					<div className="flex justify-end p-5">
						<LinkButton
							disabled={!canPreviewDocument}
							href={`/panel/diplomatic/holders/renew/${holderRenew?.id}/pdf/request-form-file?previousCard=${holder.id}`}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionRenew
						person={holder}
						personRenew={holderRenew}
						updateFn={markCardAsPrintedRenew}
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
				<TabsContent value="dependants">
					<DependantsSectionRenew holder={holder} />
				</TabsContent>
			</Tabs>
		</>
	);
}
