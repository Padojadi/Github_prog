import { object, string, TypeOf, z } from 'zod';
import { getAllSchema } from '@shared/schemas/public.schemas';
import { EGenderEnum, StatusEnum } from '@shared/types';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);

// Fonction de validation: le passeport doit être valide au moins 6 mois
const isPassportValidAtLeast6Months = (dateString: string) => {
	const validUntil = new Date(dateString);
	const sixMonthsFromNow = new Date();
	sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
	return validUntil >= sixMonthsFromNow;
};

export const createDomesticAndRelativeDCSchema = object({
	body: object({
		firstName: string().min(1).max(100),
		lastName: string().min(1).max(100),
		email: string().email().min(1).max(100).optional(),
		phone: string().min(1).max(100).optional(),
		gender: Gender.refine((g) => Object.values(EGenderEnum).includes(g), {
			message: 'Genre invalide',
		}),
		dateOfBirth: string().datetime(),
		placeOfBirth: string().min(1).max(100),
		citizenship: string().min(1).max(100),
		countryOfBirth: string().min(1).max(100),
		travellingNumber: string().min(1).max(100),
		deliverAt: string().min(1).max(100),
		deliverBy: string().min(1).max(100),
		deliverThe: string().datetime(),
		issueDate: string().datetime().optional(),
		travellingTitleType: string(),
		travellingTitleValidUntil: string().min(1).max(100),
		ownerDiplomaticCardId: string().uuid(),
	})
		.strict()
		.refine((data) => isPassportValidAtLeast6Months(data.travellingTitleValidUntil), {
			message: 'Le passeport doit être valide au moins 6 mois à partir de la date actuelle.',
			path: ['travellingTitleValidUntil'],
		}),
});

export const updateDomesticAndRelativeDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object({
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
		issueDate: string().datetime().optional(),
		travellingTitleType: string().optional(),
		travellingTitleValidUntil: string().min(1).max(100).optional(),
		ownerDiplomaticCardId: string().uuid().optional(),
		status: StatusType.optional().optional(),
	})
		.strict()
		.refine(
			(data) => {
				if (data.travellingTitleValidUntil) {
					return isPassportValidAtLeast6Months(data.travellingTitleValidUntil);
				}
				return true;
			},
			{
				message: 'Le passeport doit être valide au moins 6 mois à partir de la date actuelle.',
				path: ['travellingTitleValidUntil'],
			},
		),
});

export const printDomesticAndRelativeDCSchema = object({
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
			// Check if validUntil is after and issueDate
			return new Date(data.issueDate) < new Date(data.validUntil);
		},
		{
			message: "La date de prise d'emission ne peut pas être après la date d'expiration.",
			path: ['issueDate', 'validUntil'],
		},
	),
});

export const domesticAndRelativeDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const getDomesticAndRelativesDCSchemas = object({
	query: getAllSchema.strict(),
});

export type DomesticAndRelativeDCbYIdInput = TypeOf<
	typeof domesticAndRelativeDCByIdSchema
>['params'];
export type CreateDomesticAndRelativeDCInput = TypeOf<
	typeof createDomesticAndRelativeDCSchema
>['body'];
export type GetDomesticAndRelativesDCInput = TypeOf<
	typeof getDomesticAndRelativesDCSchemas
>['query'];
export type UpdateDomesticAndRelativeDCInput = TypeOf<typeof updateDomesticAndRelativeDCSchema>;
export type PrintDomesticAndRelativeDCSchema = TypeOf<typeof printDomesticAndRelativeDCSchema>;
