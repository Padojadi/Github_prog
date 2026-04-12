import { object, string, TypeOf, z } from 'zod';
import { EGenderEnum, StatusEnum } from '@shared/types';
import { getAllSchema } from '@shared/schemas/public.schemas';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);

const renewChildDCBaseSchema = {
	firstName: string().min(1).max(100).optional(),
	lastName: string().min(1).max(100).optional(),
	email: string().email().min(1).max(100).optional(),
	phone: string().min(1).max(100).optional(),
	gender: Gender.refine((g) => Object.values(EGenderEnum).includes(g), {
		message: 'Genre invalide',
	}).optional(),
	dateOfBirth: string().datetime().optional(),
	placeOfBirth: string().min(1).max(100).optional(),
	citizenship: string().min(1).max(100).optional(),
	countryOfBirth: string().min(1).max(100).optional(),
	travellingNumber: string().min(1).max(100).optional(),
	deliverAt: string().min(1).max(100).optional(),
	deliverBy: string().min(1).max(100).optional(),
	deliverThe: string().datetime(),
	travellingTitleType: string().optional(),
	travellingTitleValidUntil: string().min(1).max(100).optional(),
	status: StatusType.optional(),
};

export const getRenewChildsDCSchemas = object({
	query: getAllSchema.strict(),
});

export const updateRenewChildDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object(renewChildDCBaseSchema).strict(),
});

export const renewChildDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const renewChildDCSchema = object({
	body: object(renewChildDCBaseSchema).extend({
		previousDCId: string().uuid(),
	}),
});

export type RenewChildDCbYIdInput = TypeOf<typeof renewChildDCByIdSchema>['params'];

export type GetRenewChildsDCInput = TypeOf<typeof getRenewChildsDCSchemas>['query'];

export type UpdateRenewChildDCInput = TypeOf<typeof updateRenewChildDCSchema>;

export type RenewChildDCInput = TypeOf<typeof renewChildDCSchema>['body'];

// Schema for printing renewed card
export const setPrintedRenewChildDCSchema = object({
	params: object({
		id: string(),
	}).strict(),
	body: object({
		issueDate: string().datetime(),
		validUntil: string().datetime(),
		type_card: string(),
		color: string(),
		observation: string().optional().nullable(),
	}).refine(
		(data) => {
			// Check if validUntil is after issueDate
			return new Date(data.issueDate) < new Date(data.validUntil);
		},
		{
			message: "La date de prise d'emission ne peut pas être après la date d'expiration.",
			path: ['issueDate', 'validUntil'],
		},
	),
});

export type SetPrintedRenewChildDCSchema = TypeOf<typeof setPrintedRenewChildDCSchema>;
