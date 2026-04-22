import type { FieldErrors } from "react-hook-form";
import { d } from "@/lib/dictionary";
import { featureFlagStore } from "@/store/feature-flag-store";
import type {
	TConferenceRegistrationStatus,
	TConferenceStatus,
} from "../types";

export const humanizeFieldName = (field: string | number): string => {
	const str = field.toString();

	return str
		.split(/(?=[A-Z])/)
		.join(" ")
		.replace(/^./, (item) => item.toUpperCase());
};

export type ErrorMessage = {
	field: string;
	label: string;
	message: string | undefined;
	category?: string;
	index?: number;
};

type ErrorValue = {
	message?: string;
	type?: string;
	ref?: unknown;
} & Record<string, unknown>;

type JobTitleOption = {
	id: number;
	label: string;
	value: string;
	category: string;
};

export const formatErrors = <T extends Record<string, unknown>>(
	errors: FieldErrors<T>,
): ErrorMessage[] => {
	const formattedErrors: ErrorMessage[] = [];

	const processErrors = (
		obj: FieldErrors<T> | ErrorValue | Array<ErrorValue>,
		parentField = "",
		parentLabel = "",
	): void => {
		if (!obj || typeof obj !== "object") {
			return;
		}

		Object.entries(obj).forEach(([key, value]) => {
			if (!key || value === undefined) {
				return;
			}

			const currentField = parentField ? `${parentField}.${key}` : key;
			const isArrayField = currentField.includes("[");
			const arrayMatch = currentField.match(/\[(\d+)\]/);
			const arrayIndex = arrayMatch ? parseInt(arrayMatch[1]) : undefined;

			const categoryName = currentField.split("[")[0];
			const categoryLabel =
				d[categoryName as keyof typeof d] || humanizeFieldName(categoryName);

			if (Array.isArray(value)) {
				value.forEach((item, index) => {
					if (item) {
						processErrors(item, `${currentField}[${index}]`, categoryLabel);
					}
				});
			} else if (value && typeof value === "object") {
				const errorValue = value as ErrorValue;
				if (errorValue.message) {
					formattedErrors.push({
						field: currentField,
						label: d[key as keyof typeof d] || humanizeFieldName(key),
						message: errorValue.message,
						category: isArrayField ? categoryLabel : undefined,
						index: arrayIndex,
					});
				} else {
					processErrors(errorValue, currentField, parentLabel);
				}
			}
		});
	};

	try {
		processErrors(errors);
	} catch (error) {
		console.error("Error processing form errors:", error);
	}

	return formattedErrors.sort((a, b) => {
		if (a.category && b.category) {
			if (a.category !== b.category) {
				return a.category.localeCompare(b.category);
			}
			return (a.index || 0) - (b.index || 0);
		}
		if (a.category) return 1;
		if (b.category) return -1;
		return 0;
	});
};

export function translateConferenceStatus(status: TConferenceStatus) {
	switch (status) {
		case "PENDING":
			return "En attente";
		case "ACCEPTED":
			return "Acceptée";
		case "VALIDATED":
			return "Validée";
		case "CONFIRMED":
			return "Confirmée";
		case "REJECTED":
			return "Rejetée";
		case "REJECTED_PERMANENTLY":
			return "Rejetée définitivement";
		case "PUBLISHED":
			return "Publiée";
		default:
			return status;
	}
}

export function translateConferenceRegistrationStatus(
	status: TConferenceRegistrationStatus,
) {
	switch (status) {
		case "PROCESSING":
			return "En cours de traitement";
		case "PAID":
			return "Payée";
		case "PENDING_PAYMENT":
			return "Paiement en attente";
		case "REJECTED":
			return "Rejetée";
		case "CANCELLED":
			return "Annulée";
		case "REFUNDED":
			return "Remboursée";
		default:
			return status;
	}
}

export function groupJobTitles(options: JobTitleOption[]) {
	if (options.length === 0) return {};
	const grouped = options.reduce(
		(acc, option) => {
			const category = option.category || "Autres";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(option);
			return acc;
		},
		{} as Record<string, JobTitleOption[]>,
	);

	return Object.fromEntries(
		Object.entries(grouped).map(([category, items]) => [
			category,
			items.sort((a, b) => (a.label || "").localeCompare(b.label || "")),
		]),
	);
}

export function isConferenceEnabled(userEmail?: string) {
	const conferenceFeatureFlag = featureFlagStore
		.select((context) => context.conferences)
		.get();

	return (
		conferenceFeatureFlag.enabled ||
		conferenceFeatureFlag.allowedUsers.includes(userEmail || "")
	);
}
