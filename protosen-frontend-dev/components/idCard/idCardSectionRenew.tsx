"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as z from "zod";
import { usePrintContext } from "@/app/print-context";
import IdCardBackRenew from "@/features/diplomatic-cards/renew/components/id-card-back-renew";
import IdCardFrontRenew from "@/features/diplomatic-cards/renew/components/id-card-front-renew";
import { getPlatesClient } from "@/features/others/plates/lib/apis.client";
import type { TPlate } from "@/features/others/plates/types";
import { getCardTypesClient } from "@/features/others/type-of-cards/lib/apis.client";
import type { CardType } from "@/features/others/type-of-cards/types";
import type { IPersonCardInfos, IPersonCardInfosRenew } from "@/lib/types";
import CustomInputSelect from "../customInputSelect";
import InputComponent from "../inputComponent";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
	ResponsiveModal,
	ResponsiveModalContent,
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "../ui/responsive-modal";
import { SystemSettings } from "@/features/settings/system-settings/types";
import { useSystemSettingsClient } from "@/features/settings/system-settings/hooks/use-system-settings";

const MyPDFPreview = dynamic(
	() =>
		import(
			"@/features/diplomatic-cards/renew/components/id-card-pdf-preview-renew"
		),
	{ ssr: false },
);

const printSchema = z.object({
	validUntil: z.date({
		message: "Veuillez sélectionner une date d'expiration",
		invalid_type_error: "Veuillez sélectionner une date d'expiration",
		required_error: "Veuillez sélectionner une date d'expiration",
	}),
	issueDate: z.date({
		message: "Veuillez sélectionner une date de délivrance",
		invalid_type_error: "Veuillez sélectionner une date de délivrance",
		required_error: "Veuillez sélectionner une date de délivrance",
	}),
	plaque: z
		.string({
			required_error: "Veuillez sélectionner une plaque",
		})
		.optional(),
	type_card: z
		.string({
			required_error: "Veuillez sélectionner un type de carte",
		})
		.min(1, "Veuillez sélectionner un type de carte"),
	color: z
		.string({
			required_error: "Veuillez sélectionner une plaque",
		})
		.min(1, "Veuillez sélectionner une couleur"),
	observation: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
});

const frenchTranslations: Record<string, string> = {
	validUntil: "Date de d'expiration",
	issueDate: "Date de délivrance",
	plaque: "Plaque",
	type_card: "Type de carte",
	color: "Couleur",
	observation: "Observation",
	description: "Description",
};

const genericErrorTranslations: Record<string, string> = {
	required_error: "Ce champ est obligatoire",
	invalid_type_error: "Type de données invalide",
	too_small: "La valeur est trop courte",
	too_big: "La valeur est trop longue",
	invalid_string: "Veuillez sélectionner une valeur",
	"Invalid date": "Veuillez sélectionner une date",
};

interface TransformedError {
	field: string;
	label: string;
	message: string;
}

function transformZodErrors(
	fieldErrors: Record<string, string[] | undefined>,
): TransformedError[] {
	const transformedErrors: TransformedError[] = [];

	Object.entries(fieldErrors).forEach(([field, errors]) => {
		if (errors && errors.length > 0) {
			// Get French translation for the field, fallback to original field name
			const label = frenchTranslations[field] || field;

			// Use the first error message
			const rawMessage = errors[0];

			// Try to map to generic error translations
			const message =
				genericErrorTranslations[rawMessage] ||
				rawMessage ||
				"Une erreur est survenue";

			transformedErrors.push({
				field,
				label,
				message,
			});
		}
	});

	return transformedErrors;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};

export default function IdCardSectionRenew({
	person,
	personRenew,
	updateFn,
}: {
	person: IPersonCardInfos;
	personRenew: IPersonCardInfosRenew;
	updateFn?: any;
}) {
	const {
		printColor,
		setPrintColor,
		setPhoto,
		plaque,
		setPlaque,
		deliverDate,
		setDeliverDate,
		expirationDate,
		setExpirationDate,
		setCardTitle,
	} = usePrintContext();
	const { diplomaticEntity, setDiplomaticEntity } = usePrintContext();
	const { OIText, setOIText } = usePrintContext();
	const [loading, setLoading] = React.useState(false);
	const [openPrintModal, setOpenPrintModal] = React.useState(false);

	const confirmed = personRenew?.documentStage === "confirmed";

	const printed = personRenew?.documentStage === "printed";

	const expired = personRenew?.expired as boolean;

	const { data } = useQuery({
		queryKey: ["card-types"],
		queryFn: () => getCardTypesClient(),
	});

	const { data: plateData } = useQuery({
		queryKey: ["plates"],
		queryFn: () => getPlatesClient(),
	});

	const { data: systemSettings } = useSystemSettingsClient();

	const settings = systemSettings?.data as SystemSettings;

	const markAsPrinted = async () => {
		const data = {
			validUntil: new Date(expirationDate),
			issueDate: new Date(deliverDate),
			plaque: plaque?.value || "",
			type_card: diplomaticEntity?.name,
			color: printColor,
			observation: OIText?.value || "",
			description: diplomaticEntity?.description || "",
		};

		const { success, error } = printSchema.safeParse(data);
		if (!success) {
			toast.error(
				<ul className="list-disc pl-4 text-slate-800">
					{transformZodErrors(error.flatten().fieldErrors).map((item) => (
						<li key={item.label}>
							<span className="font-semibold">{item.label}:</span>
							{item.message}
						</li>
					))}
				</ul>,
			);
			return;
		}
		// console.log(success, error);
		// console.log(JSON.stringify(data));

		setLoading(true);
		const res = await updateFn(data, personRenew?.id);
		// console.log(res);
		if (res?.status === "error") {
			toast.error("Une erreur est survenue");
			// console.log(res);
			setLoading(false);
		} else {
			toast.success("Carte marquée comme imprimée");
			setOpenPrintModal(false);
			setLoading(false);
		}
	};

	const convertImageToBase64 = React.useCallback(
		async (url: string) => {
			try {
				const response = await fetch(url, {
					cache: "no-store",
					method: "GET",
					mode: "cors",
				});

				const blob = await response.blob();
				const base64String = await blobToBase64(blob);
				setPhoto(base64String);
			} catch (error) {
				console.error("Error converting image to Base64:", error);
			}
		},
		[setPhoto],
	);

	useEffect(() => {
		if (personRenew && data && plateData) {
			const entity = data?.data.find(
				(e: CardType) => e.name === personRenew?.type_card,
			);
			const plaqueChosed = plateData?.data?.find(
				(e: TPlate) => e.code === personRenew?.plaque,
			);
			setCardTitle(personRenew?.type_card || "");
			setDeliverDate(
				personRenew?.issueDate && personRenew?.issueDate.length > 0
					? personRenew.issueDate
					: new Date().toISOString().split("T")[0],
			);
			setExpirationDate(personRenew?.validUntil || "");
			setPrintColor(personRenew?.color || "#AEFCAC");
			if (entity) {
				setDiplomaticEntity(entity);
			}
			if (plaqueChosed) {
				setPlaque({
					value: plaqueChosed.code,
					label: plaqueChosed.title,
				});
			}
			if (personRenew?.observation) {
				setOIText({
					label: personRenew?.observation,
					value: personRenew?.observation,
				});
			}
		}
	}, [
		personRenew,
		data,
		plateData,
		setCardTitle,
		setDeliverDate,
		setExpirationDate,
		setPrintColor,
		setDiplomaticEntity,
		setPlaque,
		setOIText,
	]);

	useEffect(() => {
		setPhoto("");
		if (person.photoLink) {
			convertImageToBase64(person.photoLink);
		}
	}, [person.photoLink, setPhoto, convertImageToBase64]);

	return (
		<>
			<ResponsiveModal open={openPrintModal}>
				<ResponsiveModalContent className="lg:max-w-6xl [&>button]:hidden overflow-hidden">
					<ResponsiveModalHeader className="fixed left-6 top-6 right-6 bg-background">
						<ResponsiveModalTitle>Imprimer la carte</ResponsiveModalTitle>
					</ResponsiveModalHeader>
					<div className="h-[calc(70%-128px)] overflow-auto mt-16 pb-20">
						<MyPDFPreview holder={person} holderRenew={personRenew} settings={settings} />
					</div>

					<ResponsiveModalFooter className="fixed bottom-0 left-6 right-6 bg-background h-[64px] items-center">
						<Button variant="outline" onClick={() => setOpenPrintModal(false)}>
							Annuler
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									className="btn bg-indigo-500 text-white"
									disabled={loading || printed || !updateFn}
								>
									Marquer comme imprimée
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="text-foreground">
										Confirmez votre action
									</AlertDialogTitle>
									<AlertDialogDescription>
										Êtes-vous sûr de vouloir marquer cette carte comme imprimée?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<AlertDialogAction
										className="bg-indigo-500 hover:bg-indigo-600 text-white"
										onClick={() => markAsPrinted()}
										disabled={loading || printed}
									>
										Confirmer
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</ResponsiveModalFooter>
				</ResponsiveModalContent>
			</ResponsiveModal>
			<div className="grid grid-cols-3 gap-5">
				<div className="col-span-2">
					<IdCardFrontRenew person={person} personRenew={personRenew} settings={settings} />
					<IdCardBackRenew person={person} personRenew={personRenew} settings={settings} />
				</div>
				<div className="flex flex-col gap-5 items-baseline">
					{confirmed || printed ? (
						<Button
							className="btn bg-indigo-500 text-white"
							onClick={() => setOpenPrintModal(true)}
							disabled={printed || expired}
						>
							Prévisualiser - PDF
						</Button>
					) : null}

					<CustomInputSelect
						className="mt-5"
						label="Choisir le type"
						required
						name="holderType"
						value={diplomaticEntity?.name}
						disabled={printed || expired}
						onChange={(value) => {
							const entity = data?.data.find((e: CardType) => e.name === value);
							if (entity) {
								setDiplomaticEntity(entity);
								setCardTitle(entity.name);
								setPrintColor(entity.color || "#FFFFFF");
								setOIText(undefined);
							}
						}}
						options={
							data?.data?.map((item: CardType) => {
								return {
									label: item.name,
									value: item.name,
									description: item.description,
									color: item.color,
								};
							}) || []
						}
					/>
					{!!person?.ownerDiplomaticCardFiles && (
						<CustomInputSelect
							className="mt-5"
							label="Choisir la plaque"
							required
							name="plaque"
							value={plaque?.value}
							disabled={printed || expired}
							onChange={(value) => {
								const plaqueChosed = plateData?.data.find(
									(e: TPlate) => e.code === value,
								);
								if (plaqueChosed) {
									setPlaque({
										label: plaqueChosed.title,
										value: plaqueChosed.code,
									});
									// if (entity.label === DiplomaticEntity.OI) {
									//   setPrintColor("#93C5FD");
									// }
								}
							}}
							options={
								plateData?.data?.map((item: TPlate) => {
									return {
										label: item.title,
										value: item.code,
									};
								}) || []
							}
						/>
					)}
					{diplomaticEntity?.observation &&
						diplomaticEntity?.observation.length > 0 && (
							<CustomInputSelect
								className="mt-5"
								label="Observation"
								name="OIText"
								value={OIText?.value}
								disabled={printed || expired}
								onChange={(value) => {
									const entity = diplomaticEntity.observation.find(
										(e) => e === value,
									);
									if (entity) {
										setOIText({
											label: entity,
											value: entity,
										});
									}
								}}
								options={
									diplomaticEntity.observation.map((item) => {
										return {
											value: item,
											label: item,
										};
									}) || []
								}
							/>
						)}
					<InputComponent
						name="deliver-date"
						label="Date de délivrance"
						required
						type="date"
						placeholder="Entrer une date"
						value={deliverDate}
						disabled={printed || expired}
						onChange={(e) => setDeliverDate(e.target.value)}
					/>
					<InputComponent
						name="expiration-date"
						label="Date de d'expiration"
						required
						type="date"
						placeholder="Entrer une date"
						disabled={printed || expired}
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
					/>
				</div>
			</div>
		</>
	);
}
