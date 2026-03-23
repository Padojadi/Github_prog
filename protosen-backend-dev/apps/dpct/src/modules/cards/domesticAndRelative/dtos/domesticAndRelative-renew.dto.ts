import { object, string, TypeOf, z } from 'zod';
import { getAllSchema } from '@shared/schemas/public.schemas';
import { EGenderEnum, StatusEnum } from '@shared/types';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);

const renewDomesticAndRelativeDCBaseSchema = {
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

export const getRenewDomesticAndRelativesDCSchemas = object({
	query: getAllSchema.strict(),
});

export const updateRenewDomesticAndRelativeDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object(renewDomesticAndRelativeDCBaseSchema).strict(),
});

export const renewDomesticAndRelativeDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const renewDomesticAndRelativeDCSchema = object({
	body: object(renewDomesticAndRelativeDCBaseSchema).extend({
		previousDCId: string().uuid(),
	}),
});

export type RenewDomesticAndRelativeDCbYIdInput = TypeOf<
	typeof renewDomesticAndRelativeDCByIdSchema
>['params'];
export type GetRenewDomesticAndRelativesDCInput = TypeOf<
	typeof getRenewDomesticAndRelativesDCSchemas
>['query'];
export type UpdateRenewDomesticAndRelativeDCInput = TypeOf<
	typeof updateRenewDomesticAndRelativeDCSchema
>;
export type RenewDomesticAndRelativeDCInput = TypeOf<
	typeof renewDomesticAndRelativeDCSchema
>['body'];

export const setPrintedRenewDomesticAndRelativeDCSchema = object({
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
			return new Date(data.issueDate) < new Date(data.validUntil);
		},
		{
			message: "La date de prise d'emission ne peut pas être après la date d'expiration.",
			path: ['issueDate', 'validUntil'],
		},
	),
});

export type SetPrintedRenewDomesticAndRelativeDCSchema = TypeOf<
	typeof setPrintedRenewDomesticAndRelativeDCSchema
>;
