"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { BsChevronLeft } from "react-icons/bs";
import FormDocumentOne from "@/components/formDocument/formDocumentOne";
import FormDocumentTwo from "@/components/formDocument/formDocumentTwo";
import IdCardSection from "@/components/idCard/idCardSection";
import { RelatedFiles } from "@/components/relatedFiles";
import { LinkButton } from "@/components/ui/linkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { markCardAsPrinted } from "@/lib/actions/diplomaticCards/holders";
import { formSections } from "../formMeta";
import { DependantsSection } from "./_components/dependants-section";

export default function TabLayout({ holder }: { holder: any }) {
	const currentUser = useCurrentUser();
	const router = useRouter();
	const [activeTab, setActiveTab] = useQueryState("activeTab");

	const canPreviewCard =
		(holder?.documentStage === "accepted" ||
			holder?.documentStage === "confirmed" ||
			holder?.documentStage === "printed") &&
		currentUser?.role !== "user";
	const canPreviewDocument =
		holder?.documentStage === "confirmed" ||
		holder?.documentStage === "printed";

	const pageKey = "";

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
			<Tabs
				defaultValue="requestFormfile"
				value={activeTab ?? "requestFormfile"}
				onValueChange={setActiveTab}
			>
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
					{pageKey === "" && (
						<TabsTrigger value="dependants">Dépendants</TabsTrigger>
					)}
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
							href={
								"/panel/diplomatic/holders/" +
								holder?.id +
								"/pdf/request-form-file"
							}
							className="mr-5"
						>
							Prévisualiser - PDF
						</LinkButton>
					</div>
				</TabsContent>
				<TabsContent value="idcard">
					<IdCardSection
						updateFn={markCardAsPrinted}
						person={holder}
						url={`/panel/diplomatic/holders/${holder.id}/pdf/id-card`}
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
				{pageKey === "" && (
					<TabsContent value="dependants">
						<DependantsSection holder={holder} />
					</TabsContent>
				)}
			</Tabs>
		</>
	);
}
