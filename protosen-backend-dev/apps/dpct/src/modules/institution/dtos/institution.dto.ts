import { StatusEnum, StrictStatusEnum } from '@shared/types';
import { TypeOf, object, string, z } from 'zod';

const StatusType = z.nativeEnum(StatusEnum);

export const getInstitutionsSchema = object({
	query: object({
		status: StatusType.optional(),
		search: string().optional(),
		limit: string().optional(),
		page: string().optional(),
		sort: string().optional(),
		code: string().optional(),
		institutionType: string().optional(),
	}).strict(),
});

export const createInstitutionSchema = object({
	body: object({
		institutionType: z.string().min(1, "Le type d'institution est requis."),
		code: z.string().min(1, 'Le code est requis.'),
		libelle: z.string().min(1, 'Le libellé est requis.'),
		service: z.string().optional(),
		status: z.nativeEnum(StrictStatusEnum).optional(),
	}).strict(),
});

export const updateInstitutionSchema = object({
	body: object({
		institutionType: z.string().min(1, "Le type d'institution est requis.").optional(),
		code: z.string().min(1, 'Le code est requis.').optional(),
		libelle: z.string().min(1, 'Le libellé est requis.').optional(),
		service: z.string().optional(),
	}).strict(),
});

export type GetInstitutionsInput = TypeOf<typeof getInstitutionsSchema>['query'];
export type CreateInstitutionInput = TypeOf<typeof createInstitutionSchema>['body'];
export type UpdateInstitutionInput = TypeOf<typeof updateInstitutionSchema>['body'];
