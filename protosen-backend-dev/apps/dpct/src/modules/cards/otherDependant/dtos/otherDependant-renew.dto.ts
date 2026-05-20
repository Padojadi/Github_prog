import { object, string, TypeOf, z } from 'zod';
import { getAllSchema } from '@shared/schemas/public.schemas';
import { EGenderEnum, StatusEnum } from '@shared/types';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);

const renewOtherDependantDCBaseSchema = {
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

export const getRenewOtherDependantsDCSchemas = object({
	query: getAllSchema.strict(),
});

export const updateRenewOtherDependantDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object(renewOtherDependantDCBaseSchema).strict(),
});

export const renewOtherDependantDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const renewOtherDependantDCSchema = object({
	body: object(renewOtherDependantDCBaseSchema).extend({
		previousDCId: string().uuid(),
	}),
});

export type RenewOtherDependantDCbYIdInput = TypeOf<
	typeof renewOtherDependantDCByIdSchema
>['params'];

export type GetRenewOtherDependantsDCInput = TypeOf<
	typeof getRenewOtherDependantsDCSchemas
>['query'];

export type UpdateRenewOtherDependantDCInput = TypeOf<typeof updateRenewOtherDependantDCSchema>;

export type RenewOtherDependantDCInput = TypeOf<typeof renewOtherDependantDCSchema>['body'];

// Schema for printing renewed card
export const setPrintedRenewOtherDependantDCSchema = object({
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

export type SetPrintedRenewOtherDependantDCSchema = TypeOf<
	typeof setPrintedRenewOtherDependantDCSchema
>;
