import { TypeOf, object, string } from 'zod';
import { getAllSchema } from '@shared/schemas/public.schemas';

export const createDuplicaDCSchema = object({
	body: object({
		previousCardId: string().uuid().optional(),
		renewCardId: string().uuid().optional(),
	}).refine(
		(data) => (data.previousCardId || data.renewCardId) && !(data.previousCardId && data.renewCardId),
		{ message: 'Fournir soit previousCardId soit renewCardId, mais pas les deux' },
	),
});

export const getsDuplicataDCsSchemas = object({
	query: getAllSchema
		.extend({
			previousCardId: string().uuid().optional(),
			ownerCardId: string().uuid().optional(),
		})
		.strict(),
});

export const printOtherDependantDuplicataDCSchema = object({
	params: object({
		id: string().uuid(),
	}),
	body: object({
		issueDate: string(),
		validUntil: string(),
		type_card: string(),
		color: string(),
		plaque: string().max(4).optional(),
		observation: string().optional().nullable(),
	}),
});

export type GetsDuplicataDCsInput = TypeOf<typeof getsDuplicataDCsSchemas>['query'];
export type CreateDuplicataDCInput = TypeOf<typeof createDuplicaDCSchema>['body'];
export type PrintOtherDependantDuplicataDCSchema = TypeOf<
	typeof printOtherDependantDuplicataDCSchema
>;
