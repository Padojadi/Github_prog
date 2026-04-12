"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import ErrorComponent from "@/components/error";
import LoadingComponent from "@/components/loadingComponent";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TabsListNew, TabsNew, TabsTriggerNew } from "@/components/ui/tabs-new";
import useCurrentUser from "@/hooks/useCurrentUser";
import { hasPermission, verifyConferenceStatus } from "@/lib/utils";
// import { ConferenceForm } from "../conference-form";
import { useGetConference } from "../../hooks/use-get-conferences";
import { deleteConference } from "../../lib/apis";
import { ConferenceDetailsAccommodationSection } from "../conference-details/accommodation-section";
import { OverviewSection } from "../conference-details/overview-section";
import { ParticipantValidationSection } from "../conference-details/participant-validation-section";
import { StatusHistorySection } from "../conference-details/status-history-section";
import { TicketsSection } from "../conference-details/tickets-section";

export function ConferenceDetails({ id }: { id: string }) {
	const router = useRouter();
	const currentUser = useCurrentUser();
	const queryClient = useQueryClient();
	const { data, isLoading, error, refetch } = useGetConference(id);

	// const organismResponse = useGetOrganismById(data?.data.institutionId);

	const [activeTab, setActiveTab] = useQueryState("activeTab", {
		defaultValue: "overview",
	});
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// permissions verification

	const canEdit = useMemo(
		() =>
			currentUser && data
				? hasPermission(currentUser?.accessGroup?.permissions || [], [
						"REQUEST_CONFERENCE",
					]) &&
					currentUser?.id === data?.data.creatorId &&
					verifyConferenceStatus(data?.data.statusHistories[0]?.status, [
						"PENDING",
						"REJECTED",
					])
				: false,
		[currentUser, data],
	);

	const canDelete = useMemo(
		() =>
			currentUser && data
				? hasPermission(currentUser?.accessGroup?.permissions || [], [
						"REQUEST_CONFERENCE",
					]) &&
					currentUser?.id === data?.data.creatorId &&
					verifyConferenceStatus(data?.data.statusHistories[0]?.status, [
						"PENDING",
						"REJECTED",
					])
				: false,
		[currentUser, data],
	);
	const canCreate = useMemo(
		() =>
			currentUser && data
				? hasPermission(currentUser.accessGroup?.permissions || [], [
						"MANAGE_CONFERENCES",
					]) && data?.data.statusHistories[0]?.status === "CONFIRMED"
				: false,
		[currentUser, data],
	);

	const canEditCreated = useMemo(
		() =>
			currentUser && data
				? hasPermission(currentUser.accessGroup?.permissions || [], [
						"MANAGE_CONFERENCES",
					]) && data?.data.statusHistories[0]?.status === "PUBLISHED"
				: false,
		[currentUser, data],
	);

	const canViewParticipants = useMemo(
		() =>
			data && currentUser
				? hasPermission(currentUser.accessGroup?.permissions || [], [
						"MANAGE_CONFERENCES",
					]) && data?.data.statusHistories[0]?.status === "PUBLISHED"
				: false,
		[currentUser, data],
	);

	// delete conference
	const deleteMutation = useMutation({
		mutationFn: async () => {
			const response = await deleteConference(id, "", "");
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de suppression de la demande conférence",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["conferences"],
			});
			toast.success(message || "Conférence supprimée avec succès");
			router.push("/panel/conferences/new-requests");
			setIsDeleteDialogOpen(false);
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onDelete = async () => {
		deleteMutation.mutate();
	};

	return (
		<>
			{isLoading ? (
				<LoadingComponent />
			) : error ? (
				<ErrorComponent error={error} retry={refetch} />
			) : data ? (
				<>
					<div className="container-custom relative z-10 flex justify-between items-center mb-6">
						<div>
							<button
								type="button"
								onClick={() => router.back()}
								className="inline-flex items-center text-foreground/80 hover:text-foreground transition-colors"
							>
								<ChevronLeft className="w-4 h-4 mr-1" /> Retour
							</button>
						</div>
						<div className="flex items-center gap-4">
							{canEdit && (
								<Link
									href={
										canEdit ? `/panel/conferences/${data?.data.id}/edit` : "#"
									}
								>
									<Button
										className="bg-yellow-500 hover:bg-yellow-600 text-white"
										disabled={!canEdit}
									>
										Modifier
										<BsPencil size={20} className="ml-2" />
									</Button>
								</Link>
							)}

							{canDelete && (
								<>
									<Button
										className="bg-red-500 hover:bg-red-600 text-white"
										disabled={!canDelete}
										onClick={() => {
											setIsDeleteDialogOpen(true);
										}}
									>
										Supprimer
										<BsTrash size={20} className="ml-2" />
									</Button>
									<AlertDialog
										open={isDeleteDialogOpen}
										onOpenChange={setIsDeleteDialogOpen}
									>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle className="text-foreground">
													Êtes-vous sûr de vouloir supprimer cette conférence?
												</AlertDialogTitle>
												<AlertDialogDescription>
													Cette action est irréversible. La conférence sera
													supprimée définitivement.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Annuler</AlertDialogCancel>
												<AlertDialogAction
													className="bg-red-500 hover:bg-red-600 text-white"
													disabled={deleteMutation.isPending}
													onClick={onDelete}
												>
													Supprimer
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</>
							)}
							{canViewParticipants && (
								<Link href={`/panel/conferences/${id}/registrations`}>
									<Button className="bg-green-500 hover:bg-green-500/90 text-white font-medium">
										Voir la liste des inscriptions
									</Button>
								</Link>
							)}
						</div>
					</div>
					<div className=" bg-white dark:bg-slate-950">
						<div className="container-custom py-2">
							<h2 className="text-xl font-medium truncate">
								{data.data.title}
							</h2>
						</div>
					</div>
					<div className="bg-white dark:bg-slate-950 border-b border-border">
						<div className="container-custom">
							<TabsNew
								defaultValue="overview"
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsListNew className="w-full justify-start bg-transparent border-b-0 p-0 h-auto">
									<TabsTriggerNew
										value="overview"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										À propos
									</TabsTriggerNew>
									<TabsTriggerNew
										value="passes"
										disabled={!canCreate && !canEditCreated}
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Tickets
									</TabsTriggerNew>
									<TabsTriggerNew
										value="hotels"
										disabled={!canCreate && !canEditCreated}
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Hébergements
									</TabsTriggerNew>
									<TabsTriggerNew
										value="validation"
										disabled={!canCreate && !canEditCreated}
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Catégories de participant
									</TabsTriggerNew>
									<TabsTriggerNew
										value="status"
										className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
									>
										Historique de statuts
									</TabsTriggerNew>
								</TabsListNew>
							</TabsNew>
						</div>
					</div>
					<div className="flex-1 py-8">
						<div className="container-custom">
							{activeTab === "overview" && (
								<OverviewSection
									conference={data.data}
									onViewFullHistory={() => setActiveTab("status")}
								/>
							)}
							{activeTab === "passes" && (
								<TicketsSection
									conference={data.data}
									canCreate={canCreate || canEditCreated}
								/>
							)}
							{activeTab === "hotels" && (
								<ConferenceDetailsAccommodationSection
									conferenceId={data.data.id}
									canCreate={canCreate}
									canEditCreated={canEditCreated}
								/>
							)}
							{activeTab === "validation" && (
								<ParticipantValidationSection conferenceId={data.data.id} />
							)}
							{activeTab === "status" && (
								<StatusHistorySection conference={data.data} />
							)}
						</div>
					</div>
				</>
			) : (
				<div className="text-center">Aucune donnée pour cette conférence</div>
			)}
		</>
	);
}
