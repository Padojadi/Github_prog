"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Value } from "@udecode/plate";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Calendar,
	ExternalLink,
	FileText,
	Loader2,
	Mail,
	MapPin,
	Pencil,
	Phone,
	Save,
	User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PlateEditor } from "@/components/editor/plate-editor";
import PlateStatic from "@/components/editor/plate-static";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { transformZodErrorsGeneric } from "@/lib/errors";
import { cn, hasPermission, verifyConferenceStatus } from "@/lib/utils";
import { createConference, updateCreatedConference } from "../../lib/apis";
import type { Conference } from "../../types";
import {
	conferenceCreationSchema,
	type TConferenceCreationSchema,
} from "../../types/schema";
import StatusActionPanel from "./status-action-panel";

type OverviewSectionProps = {
	conference: Conference;
	onViewFullHistory: () => void;
};

const editDescriptionSchema = z.object({
	id: z.string().min(1, "L'id de la conférence est requis"),
	description: z
		.string({
			required_error: "La description est requise",
			invalid_type_error: "Le description est requis",
		})
		.min(1, "La description de la conférence est requise"),
});

type FormValues = z.infer<typeof editDescriptionSchema>;

export function OverviewSection({
	conference,
	onViewFullHistory,
}: OverviewSectionProps) {
	const currentUser = useCurrentUser();
	const queryClient = useQueryClient();
	const { theme } = useTheme();

	const [description, setDescription] = useState<Value>(
		() => conference.description,
	);

	//permissions
	const canReject =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"ACCEPTED",
					"PENDING",
					"VALIDATED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"VALIDATE_CONFERENCE_REQUEST",
					"ACCEPT_CONFERENCE_REQUEST",
					"CONFIRM_CONFERENCE_REQUEST",
				])
			: false;

	const canRejectPermanently =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"ACCEPTED",
					"PENDING",
					"VALIDATED",
					"REJECTED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"VALIDATE_CONFERENCE_REQUEST",
					"ACCEPT_CONFERENCE_REQUEST",
					"CONFIRM_CONFERENCE_REQUEST",
				])
			: false;

	const canConfirm =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"VALIDATED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"CONFIRM_CONFERENCE_REQUEST",
				])
			: false;

	const canAccept =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"REJECTED",
					"PENDING",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"ACCEPT_CONFERENCE_REQUEST",
				])
			: false;

	const canValidate =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"REJECTED",
					"ACCEPTED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"VALIDATE_CONFERENCE_REQUEST",
				])
			: false;

	const canCreate =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"CONFIRMED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"MANAGE_CONFERENCES",
				])
			: false;

	const canEditCreated =
		conference.statusHistories && currentUser
			? verifyConferenceStatus(conference.statusHistories[0].status, [
					"PUBLISHED",
				]) &&
				hasPermission(currentUser.accessGroup?.permissions || [], [
					"MANAGE_CONFERENCES",
				])
			: false;

	// create conference
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: TConferenceCreationSchema) => {
			const response = await createConference(
				data,
				"Échec de création de la conférence",
				"Conférence publiée avec succès",
			);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de publication de la conférence",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["conferences"],
			});
			toast.success(message || "Conférence publiée avec succès");
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onCreate = useCallback(async () => {
		const data = {
			id: conference.id,
			description: JSON.stringify(description),
			accomodationIds: [],
		};
		console.log(data);

		const validationResult = conferenceCreationSchema.safeParse(data);

		if (!validationResult.success) {
			toast.error(
				<ul className="list-disc pl-4">
					{transformZodErrorsGeneric(
						validationResult.error.flatten().fieldErrors,
					).map((item) => (
						<li key={item.label}>
							<span className="font-semibold">{item.label}:</span>
							{item.message}
						</li>
					))}
				</ul>,
			);
			return;
		}
		mutate(data);
	}, [description, conference.id, mutate]);

	// edit created conference

	const { mutate: mutateEdit, isPending: editIsPending } = useMutation({
		mutationFn: async (data: FormValues) => {
			const response = await updateCreatedConference(
				conference.id,
				data,
				"Échec de modification de la description",
				"Description modifiée avec succès",
			);
			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Échec de modification de la description",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({
				queryKey: ["conferences"],
			});
			toast.success(message || "Description modifiée avec succès");
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const onEditCreated = useCallback(async () => {
		const data = {
			id: conference.id,
			description: JSON.stringify(description),
		};
		console.log(data);

		const validationResult = editDescriptionSchema.safeParse(data);

		if (!validationResult.success) {
			toast.error(
				<ul className="list-disc pl-4 text-slate-800">
					{transformZodErrorsGeneric(
						validationResult.error.flatten().fieldErrors,
					).map((item) => (
						<li key={item.label}>
							<span className="font-semibold">{item.label}:</span>
							{item.message}
						</li>
					))}
				</ul>,
				{
					duration: 5000,
				},
			);
			return;
		}
		mutateEdit(data);
	}, [description, conference.id, mutateEdit]);

	const handleDocumentClick = (url: string, docType: string) => {
		if (!url) {
			toast.error(`Document ${docType} non disponible`);
			return;
		}
		window.open(url, "_blank");
	};

	// useEffect(() => {
	//   if (conference) {
	//     setDescription(conference.description);
	//   }
	// }, [conference]);
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div className="lg:col-span-2 space-y-8">
				<div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in">
					<h3 className="text-xl font-medium mb-4">
						À propos de la conference
					</h3>
					<div
						className={cn(
							"w-full border rounded-lg border-border",
							theme === "dark" && "dark",
							(!canCreate || !canEditCreated) && "border-0",
							(canCreate || canEditCreated) && "max-h-[600px] overflow-hidden",
						)}
						data-registry="plate"
					>
						{conference.description && !canCreate && !canEditCreated ? (
							<PlateStatic value={conference.description} />
						) : (
							<PlateEditor
								value={description}
								onBlur={(value) => setDescription(value)}
							/>
						)}
					</div>

					<div className="flex items-center gap-2 mt-4">
						{canCreate && (
							<Button disabled={isPending} onClick={onCreate}>
								{isPending ? (
									<Loader2 className="size-4 mr-2 animate-spin" />
								) : (
									<Save className="size-4 mr-2" />
								)}
								Publier la conférence
							</Button>
						)}
						{canEditCreated && (
							<div className="">
								<Button
									variant="outline"
									disabled={editIsPending}
									onClick={onEditCreated}
								>
									{editIsPending ? (
										<Loader2 className="size-4 mr-2 animate-spin" />
									) : (
										<Pencil className="w-4 h-4 mr-2" />
									)}
									Modifier la description
								</Button>
							</div>
						)}
					</div>
				</div>
				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "150ms" }}
				>
					<h3 className="text-xl font-medium mb-4">Documents</h3>
					<div className="flex gap-4">
						<Button
							variant="outline"
							className="flex items-center gap-2"
							onClick={() => handleDocumentClick(conference.themeDoc, "theme")}
						>
							<FileText className="h-4 w-4" />
							Theme
							<ExternalLink className="h-4 w-4 ml-1" />
						</Button>
						<Button
							variant="outline"
							className="flex items-center gap-2"
							onClick={() =>
								handleDocumentClick(conference.budgetDoc, "budget")
							}
						>
							<FileText className="h-4 w-4" />
							Budget
							<ExternalLink className="h-4 w-4 ml-1" />
						</Button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "100ms" }}
				>
					<h3 className="text-xl font-medium mb-4">Informations sur le lieu</h3>
					<div className="flex items-center text-foreground/90 text-sm">
						<MapPin className="h-4 w-4 mr-2" />
						<span>{conference.location}</span>
					</div>
				</div>
				{conference?._count?.participants > 0 && (
					<div
						className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
						style={{ animationDelay: "150ms" }}
					>
						<h3 className="text-lg font-medium mb-4">Inscriptions</h3>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Participants
								</span>
								<span className="font-medium">
									{conference?._count?.participants ?? 0}
								</span>
							</div>

							{/* <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (conference.attendees / conference.capacity) * 100
                    }%`,
                  }}
                ></div>
              </div> */}

							{/* {conference.registrationStatus === "REGISTERED" ? (
                <div className="bg-success/10 border border-success/30 text-success rounded-md p-3 text-sm">
                  <p className="font-medium">
                    You are registered for this conference
                  </p>
                  <p className="mt-1">
                    Your registration is confirmed and you're all set to attend.
                  </p>
                </div>
              ) : (
                <Button className="w-full">Register Now</Button>
              )} */}
						</div>
					</div>
				)}

				<StatusActionPanel
					conferenceId={conference.id}
					currentStatus={conference?.statusHistories?.[0]?.status}
					reason={conference?.statusHistories?.[0].rejectionReason || undefined}
					statusHistory={conference.statusHistories}
					onViewFullHistory={onViewFullHistory}
					canAccept={canAccept}
					canValidate={canValidate}
					canConfirm={canConfirm}
					canReject={canReject}
					canRejectPermanently={canRejectPermanently}
					className="animate-fade-in"
					style={{ animationDelay: "200ms" }}
				/>

				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "300ms" }}
				>
					<h3 className="text-xl font-medium mb-4">
						Informations de la conférence
					</h3>

					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<p className="text-foreground">
								{format(new Date(conference.startDate ?? ""), "PPP", {
									locale: fr,
								})}{" "}
								-{" "}
								{format(new Date(conference.endDate ?? ""), "PPP", {
									locale: fr,
								})}
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<h4 className="font-medium">Demandeur</h4>
							<div className="flex items-center text-sm">
								<User className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">
									{conference.firstName} {conference.lastName},{" "}
									<span className="text-muted-foreground text-xs">
										{conference.job}
									</span>
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-2 text-sm">
							<h4 className="font-medium text-base">Contact du Demandeur</h4>
							<div className="flex items-center">
								<Mail className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">{conference.email}</p>
							</div>
							<div className="flex items-center">
								<Phone className="w-4 h-4 text-muted-foreground mr-3" />
								<p className="text-foreground">{conference.phone}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
