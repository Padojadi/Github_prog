import { object, string, TypeOf, z } from 'zod';
import { getAllSchema } from '../../../../shared/schemas/public.schemas';
import { EGenderEnum, EMatrimosnialStatus, StatusEnum } from '@shared/types';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);
const MatrimonialStatusType = z.nativeEnum(EMatrimosnialStatus);

const ownerDCBaseSchema = {
	title: string().min(1).max(200).optional(),
	firstName: string().min(1).max(200).optional(),
	lastName: string().min(1).max(200).optional(),
	email: string().email().min(1).max(100).optional(),
	phone: string().min(1).max(100).optional(),
	matrimonialStatus: MatrimonialStatusType.optional(),
	gender: Gender.refine((g) => Object.values(EGenderEnum).includes(g), {
		message: 'Genre invalide',
	}).optional(),
	adressSenegal: string().min(0).max(200).optional(),
	dateOfBirth: string().datetime().optional(),
	placeOfBirth: string().min(1).max(200).optional(),
	citizenship: string().min(1).max(200).optional(),
	countryOfBirth: string().min(1).max(200).optional(),
	grade: string().min(1).max(200).optional(),
	jobPosition: string().min(1).max(200).optional(),
	personReplaced: string().max(200).optional(),
	jobFunction: string().min(1).max(200).optional(),
	travellingNumber: string().min(1).max(200).optional(),
	deliverAt: string().min(1).max(200).optional(),
	deliverBy: string().min(1).max(200).optional(),
	deliverThe: string().datetime(),
	issueDate: string().datetime().optional(),
	validUntil: string().datetime().optional(),
	travellingTitleType: string().optional(),
	dateTakingOffice: string().datetime().optional(),
	dateArrivalSenegal: string().datetime().optional(),
	travellingTitleValidUntil: string().datetime().optional(),
	dateEndOfMission: string().datetime().optional(),
	lastCityAbroad: string().min(1).max(200).optional(),
	lastCountryAbroad: string().min(1).max(200).optional(),
	latestOfWorkCountry: string().min(1).max(200).optional(),
	latestWorkStructure: string().min(1).max(200).optional(),
	lastestWorkDate: string().datetime().optional(),
	lastStreetAbroad: string().min(1).max(200).optional(),
	status: StatusType.optional(),
	plaque: string().max(4).optional(),
};

// Fonction de validation: le passeport doit être valide au moins 6 mois
const isPassportValidAtLeast6Months = (dateString: string) => {
	const validUntil = new Date(dateString);
	const sixMonthsFromNow = new Date();
	sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
	return validUntil >= sixMonthsFromNow;
};

export const createOwnerDCSchema = object({
	body: object({
		title: string().min(1).max(200),
		firstName: string().min(1).max(200),
		lastName: string().min(1).max(200),
		email: string().email().min(1).max(100).optional(),
		phone: string().min(1).max(100).optional(),
		matrimonialStatus: MatrimonialStatusType,
		plaque: string().max(4).optional(),
		gender: Gender.refine((g) => Object.values(EGenderEnum).includes(g), {
			message: 'Genre invalide',
		}),
		adressSenegal: string().min(0).max(200).optional(),
		dateOfBirth: string().datetime(),
		placeOfBirth: string().min(1).max(200),
		citizenship: string().min(1).max(200),
		countryOfBirth: string().min(1).max(200),
		grade: string().min(1).max(200),
		personReplaced: string().min(0).max(200).optional(),
		jobFunction: string().min(1).max(200),
		travellingNumber: string().min(1).max(200),
		deliverThe: string().datetime(),
		issueDate: string().datetime().optional(),
		deliverBy: string().min(1).max(200),
		deliverAt: string().min(1).max(200),
		travellingTitleType: string(),
		dateTakingOffice: string().datetime(),
		travellingTitleValidUntil: string().datetime(),
		dateArrivalSenegal: string().datetime(),
		dateEndOfMission: string().datetime().optional(),
		lastCityAbroad: string().min(1).max(200),
		lastCountryAbroad: string().min(1).max(200),
		latestOfWorkCountry: string().min(1).max(200),
		latestWorkStructure: string().min(1).max(200),
		lastestWorkDate: string().datetime(),
		lastStreetAbroad: string().min(1).max(200),
	})
		.strict()
		.refine(
			(data) => {
				// Check if dateEndOfMission is provided and dateTakingOffice is before it
				if (data.dateEndOfMission) {
					return new Date(data.dateTakingOffice) <= new Date(data.dateEndOfMission);
				}
				return true; // No check if dateEndOfMission is not provided
			},
			{
				message: 'La date de prise de fonction ne peut pas être après la date de fin de mission.',
				path: ['dateTakingOffice'],
			},
		)
		.refine((data) => isPassportValidAtLeast6Months(data.travellingTitleValidUntil), {
			message: 'Le passeport doit être valide au moins 6 mois à partir de la date actuelle.',
			path: ['travellingTitleValidUntil'],
		}),
});

export const getOwnersDCSchemas = object({
	query: getAllSchema.strict(),
});

export const updateOwnerDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object(ownerDCBaseSchema)
		.refine(
			(data) => {
				// Check if dateEndOfMission is provided and dateTakingOffice is before it
				if (data.dateEndOfMission) {
					if (!data.dateTakingOffice) {return true;}
					return new Date(data.dateTakingOffice) <= new Date(data.dateEndOfMission);
				}
				return true; // No check if dateEndOfMission is not provided
			},
			{
				message: 'La date de prise de fonction ne peut pas être après la date de fin de mission.',
				path: ['dateTakingOffice'],
			},
		)
		.refine(
			(data) => {
				// Only validate if travellingTitleValidUntil is provided
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

export const printOwnerDCSchema = object({
	params: object({
		id: string(),
	}).strict(),
	body: object({
		issueDate: string().datetime(),
		validUntil: string().datetime(),
		plaque: string().max(4).optional(),
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

export const ownerDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export type OwnerDCbYIdInput = TypeOf<typeof ownerDCByIdSchema>['params'];

export type CreateOwnerDCInput = TypeOf<typeof createOwnerDCSchema>['body'];

export type GetOwnersDCInput = TypeOf<typeof getOwnersDCSchemas>['query'];

export type UpdateOwnerDCInput = TypeOf<typeof updateOwnerDCSchema>;

export type PrintOwnerDCSchema = TypeOf<typeof printOwnerDCSchema>;
