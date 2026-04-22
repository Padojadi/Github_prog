"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import IdCardSectionRenew from "@/components/idCard/idCardSectionRenew";
import { RelatedFiles } from "@/components/relatedFiles";
import { LinkButton } from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { markCardAsPrintedRenew } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { formSections } from "../../formMeta";
import FormDocumentOne from "./_components/formDocumentOne";
import FormDocumentTwo from "./_components/formDocumentTwo";

export default function TabLayout({
	domesticAndRelative,
	domesticAndRelativeRenew,
}: {
	domesticAndRelative: any;
	domesticAndRelativeRenew: any;
}) {
	const currentUser = useCurrentUser();
	const router = useRouter();

	const canPreviewCard =
		(domesticAndRelativeRenew?.documentStage === "accepted" ||
			domesticAndRelativeRenew?.documentStage === "confirmed" ||
			domesticAndRelativeRenew?.documentStage === "printed") &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		domesticAndRelativeRenew?.documentStage === "confirmed" ||
		domesticAndRelativeRenew?.documentStage === "printed";

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
					<div className="flex justify-end p-5">
						<LinkButton
							disabled={!canPreviewDocument}
							href={`/panel/diplomatic/domestics-and-relatives/renew/${domesticAndRelativeRenew?.id}/pdf/request-form-file?previousCard=${domesticAndRelative.id}`}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionRenew
						person={domesticAndRelative}
						personRenew={domesticAndRelativeRenew}
						updateFn={markCardAsPrintedRenew}
					/>
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
