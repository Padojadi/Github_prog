"use client";

import type React from "react";
import { useState } from "react";
import { BsChevronDoubleRight } from "react-icons/bs";
import { toast } from "react-toastify";
import type { z } from "zod";
import Badge from "@/components/badge";
import CitizenshipSelect from "@/components/citizenshipSelect";
import CountrySelect from "@/components/countrySelect";
import InputCreatableSelect from "@/components/InputCreatableSelect";
import InputCombobox from "@/components/input-combobox";
import InputComponent from "@/components/inputComponent";
import SubmitButton from "@/components/submitButton";
import { LinkButton } from "@/components/ui/linkButton";
import {
	createObject,
	getNamesFromMultipleArray,
} from "@/components/utils/utils";
import { checkError, isEmpty } from "@/components/utils/utilsClient";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { IHolder } from "@/lib/types";

interface DataFormRenewProps {
	formSections: {
		title: string;
		data: any[];
	}[];
	onSubmitAction: (data: unknown) => Promise<
		| {
				status: string;
				message: string;
				errors: {
					[x: string]: string[] | undefined;
					[x: number]: string[] | undefined;
					[x: symbol]: string[] | undefined;
				};
				data?: undefined;
		  }
		| any
	>;
	isEdit?: boolean;
	schemaForm: z.ZodObject<
		any,
		"strip",
		z.ZodTypeAny,
		{
			[x: string]: any;
		},
		{
			[x: string]: any;
		}
	>;
	initialValues?: {
		[x: string]: any;
	};
	title?: string;
	backLink: string;
	holders?: IHolder[];
}

const DataFormRenew: React.FC<DataFormRenewProps> = ({
	formSections,
	schemaForm,
	onSubmitAction,
	isEdit = false,
	initialValues = {},
	title,
	backLink,
	holders,
}) => {
	const [errors, setErrors] = useState({});
	const currentUser = useCurrentUser();

	const [formValues, setFormValues] = useState<any>(() => {
		const holderSelected = holders?.find(
			(holder) =>
				holder.id === initialValues?.previousCard?.ownerDiplomaticCardId,
		);

		return {
			...initialValues.previousCard,
			holderTitle: holderSelected?.title,
			holderFileNumber: holderSelected?.id,
			holderFirstName: holderSelected?.firstName,
			holderLastName: holderSelected?.lastName,
			holderCitizenship: holderSelected?.citizenship,
		};
	});

	async function formAction(formData: FormData) {
		const inputNames = getNamesFromMultipleArray(
			...formSections.map((section) => section.data),
		);
		if (!formData.get("plaque")) {
			formData.set("plaque", "");
		}
		if (!formData.get("ownerDiplomaticCardId")) {
			formData.set("ownerDiplomaticCardId", formValues.ownerDiplomaticCardId);
			formData.set("holderTitle", formValues.holderTitle);
			formData.set("holderFileNumber", formValues.holderFileNumber);
			formData.set("holderFirstName", formValues.holderFirstName);
			formData.set("holderLastName", formValues.holderLastName);
			formData.set("holderCitizenship", formValues.holderCitizenship);
		}

		const dataToSend = createObject(inputNames, formData);

		if (dataToSend?.dateEndOfMission && dataToSend?.dateTakingOffice) {
			if (
				new Date(dataToSend?.dateEndOfMission) <
				new Date(dataToSend?.dateTakingOffice)
			) {
				toast.error(
					"La date de prise de fonction ne peut pas être après la date de fin de mission.",
				);
				return;
			}
		}

		const validatedFields = schemaForm.safeParse(dataToSend);

		if (!validatedFields.success) {
			let errorMessage = "";
			validatedFields.error.issues.forEach((issue) => {
				errorMessage += `${issue.path[0]}: ${issue.message}\n`;
			});

			setErrors(validatedFields.error.flatten().fieldErrors);
			toast.error(
				"Une erreur est survenue veuillez vous assurez que tous les champs sont correctement renseignés",
			);
			// console.log(errorMessage);

			return;
		}

		setErrors({});

		let actionData;
		// TODO : What if the id not available
		if (isEdit) {
			actionData = {
				...validatedFields.data,
				id: initialValues?.previousCardId,
			};
		} else {
			actionData = validatedFields.data;
		}
		const { message, errors, status } = await onSubmitAction(actionData);

		if (message) {
			if (status === "success") {
				toast.success(message);
			} else if (status === "error") {
				toast.error(message);
			} else {
				toast(message);
			}
		}
		if (errors && !isEmpty(errors)) {
			toast.error(
				Object.keys(errors)
					.map((item) => errors[item])
					.join(", ") ||
					"Une erreur est survenue veuillez vous assurez que tous les champs sont correctement renseignés",
			);
			// console.log(JSON.stringify(errors));
			setErrors(errors);
		}
	}

	const options = holders?.map((item: IHolder) => ({
		label: `${item.title} - ${item.firstName} ${item.lastName}`,
		value: item.id,
	}));

	if (Array.isArray(options)) {
		options.unshift({ label: "Sélectionner un titulaire", value: "" });
	}

	const changeHandler = (e: any) => {
		if (e.target.name === "ownerDiplomaticCardId") {
			// Va dans data et prends l'objet qui a l'id correspondant à e.target.value
			const holderSelected = holders?.find(
				(holder) => holder.id === e.target.value,
			);
			setFormValues({
				...formValues,
				[e.target.name]: e.target.value,
				holderTitle: holderSelected?.title,
				holderFileNumber: holderSelected?.id,
				holderFirstName: holderSelected?.firstName,
				holderLastName: holderSelected?.lastName,
				holderCitizenship: holderSelected?.citizenship,
			});
		} else {
			setFormValues({ ...formValues, [e.target.name]: e.target.value });
		}
	};

	const changeHandlerCombobox = (value: string) => {
		// Va dans data et prends l'objet qui a l'id correspondant à value
		const holderSelected = holders?.find((holder) => holder.id === value);
		setFormValues({
			...formValues,
			ownerDiplomaticCardId: value,
			holderTitle: holderSelected?.title,
			holderFileNumber: holderSelected?.id,
			holderFirstName: holderSelected?.firstName,
			holderLastName: holderSelected?.lastName,
			holderCitizenship: holderSelected?.citizenship,
		});
	};

	return (
		<div className="relative bg-white dark:bg-slate-900 h-full">
			<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
				{/* Page header */}
				<div className="mb-8">
					<h1 className="text-2xl flex items-center md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
						{title || "Formulaire"}
						{isEdit ? (
							<Badge text="Édition" color="indigo" />
						) : (
							<Badge text="Nouveau" />
						)}
					</h1>
				</div>
				<div className="border-t border-slate-200 dark:border-slate-700">
					{/* Components */}
					<p className="mt-5">
						<span className="font-bold">Note:</span> Les champs marqués d'un
						astérisque (<span className="text-rose-500">*</span>) sont
						obligatoires.
					</p>
					<div className="space-y-8">
						<form action={formAction}>
							{formSections.map((section, index) => (
								<div key={section.title}>
									<h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold my-6">
										{section.title}
									</h2>
									<div className="grid gap-5 md:grid-cols-3">
										{section.data.map((item) => {
											if (item.type === "select-creatable") {
												return (
													<div key={item.label}>
														<InputCreatableSelect
															{...item}
															options={item.options}
															initialValue={formValues[item.name]}
															onChange={changeHandler}
															supportingText={item.supportingText}
															placeholder={item.placeholder || item.label}
														/>
													</div>
												);
											} else if (item.name === "ownerDiplomaticCardId") {
												return (
													<div key={item.label}>
														<InputCombobox
															{...item}
															options={options}
															value={formValues[item.name]}
															onChange={changeHandlerCombobox}
														/>
													</div>
												);
											} else if (item.type === "select-country") {
												return (
													<div key={item.label}>
														<CountrySelect
															{...item}
															initialCountry={formValues[item.name]}
															onChange={changeHandler}
														/>
													</div>
												);
											} else if (item.type === "select-citizenship") {
												return (
													<div key={item.label}>
														<CitizenshipSelect
															{...item}
															initialCitizenship={formValues[item.name]}
															onChange={changeHandler}
														/>
													</div>
												);
											} else {
												if (
													item.name === "plaque" &&
													currentUser?.role === "user"
												) {
													return null;
												}
												return (
													<div key={item.label}>
														<InputComponent
															{...item}
															errorText={checkError(item.name, errors)}
															required={item.required}
															name={item.name}
															label={item.label}
															type={item.type}
															placeholder={item.placeholder || item.label}
															value={formValues[item.name] || ""}
															onChange={changeHandler}
														/>
													</div>
												);
											}
										})}
									</div>
								</div>
							))}
							<div className="flex justify-end pt-5">
								<SubmitButton
									label={
										isEdit
											? "Mettre à jour les informations"
											: "Enregistrer & Suivant"
									}
								/>
								{isEdit ? (
									<LinkButton
										className="ml-3"
										href={`${backLink}/${initialValues.id}/files-form?previousCard=${initialValues?.previousCardId}`}
									>
										Suivant <BsChevronDoubleRight className="ml-2" size={16} />
									</LinkButton>
								) : null}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataFormRenew;
