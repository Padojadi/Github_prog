"use client";

import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import IdCardSectionRenew from "@/components/idCard/idCardSectionRenew";
import { RelatedFiles } from "@/components/relatedFiles";
import { LinkButton } from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { markCardAsPrintedRenew } from "@/lib/actions/diplomaticCards/childs";
import { formSections } from "../../formMeta";
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
		(childRenew?.documentStage === "accepted" ||
			childRenew?.documentStage === "confirmed" ||
			childRenew?.documentStage === "printed") &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		childRenew?.documentStage === "confirmed" ||
		childRenew?.documentStage === "printed";

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
					<div className="flex justify-end p-5">
						<LinkButton
							disabled={!canPreviewDocument}
							href={`/panel/diplomatic/childs/renew/${childRenew?.id}/pdf/request-form-file?previousCard=${child.id}`}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSectionRenew
						person={child}
						personRenew={childRenew}
						updateFn={markCardAsPrintedRenew}
					/>
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
