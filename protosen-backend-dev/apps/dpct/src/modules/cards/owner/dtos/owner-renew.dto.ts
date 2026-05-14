import { object, string, TypeOf, z } from 'zod';
import { getAllSchema } from '../../../../shared/schemas/public.schemas';
import { EGenderEnum, EMatrimosnialStatus, StatusEnum } from '@shared/types';

const Gender = z.nativeEnum(EGenderEnum);
const StatusType = z.nativeEnum(StatusEnum);
const MatrimonialStatusType = z.nativeEnum(EMatrimosnialStatus);

const renewOwnerDCBaseSchema = {
	title: string().min(1).max(200).optional(),
	firstName: string().min(1).max(200).optional(),
	lastName: string().min(1).max(200).optional(),
	email: string().email().min(1).max(100).optional(),
	phone: string().min(1).max(100).optional(),
	matrimonialStatus: MatrimonialStatusType.optional(),
	gender: Gender.refine((g) => Object.values(EGenderEnum).includes(g), {
		message: 'Genre invalide',
	}).optional(),
	dateOfBirth: string().datetime().optional(),
	placeOfBirth: string().min(1).max(200).optional(),
	citizenship: string().min(1).max(200).optional(),
	countryOfBirth: string().min(1).max(200).optional(),
	grade: string().min(1).max(200).optional(),
	jobPosition: string().min(1).max(200).optional(),
	personReplaced: string().min(1).max(200).optional(),
	jobFunction: string().min(1).max(200).optional(),
	travellingNumber: string().min(1).max(200).optional(),
	deliverAt: string().min(1).max(200).optional(),
	deliverBy: string().min(1).max(200).optional(),
	deliverThe: string().datetime(),
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
};

export const getRenewOwnersDCSchemas = object({
	query: getAllSchema.strict(),
});

export const updateRenewOwnerDCSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object(renewOwnerDCBaseSchema).strict(),
});

export const renewOwnerDCByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const renewOwnerDCSchema = object({
	body: object(renewOwnerDCBaseSchema).extend({
		previousDCId: string().uuid(),
	}),
});

export type RenewOwnerDCbYIdInput = TypeOf<typeof renewOwnerDCByIdSchema>['params'];

export type GetRenewOwnersDCInput = TypeOf<typeof getRenewOwnersDCSchemas>['query'];

export type UpdateRenewOwnerDCInput = TypeOf<typeof updateRenewOwnerDCSchema>;

export type RenewRenewOwnerdDCInput = TypeOf<typeof renewOwnerDCSchema>['body'];

// Schema for printing renewed card
export const setPrintedRenewOwnerDCSchema = object({
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
			// Check if validUntil is after issueDate
			return new Date(data.issueDate) < new Date(data.validUntil);
		},
		{
			message: "La date de prise d'emission ne peut pas être après la date d'expiration.",
			path: ['issueDate', 'validUntil'],
		},
	),
});

export type SetPrintedRenewOwnerDCSchema = TypeOf<typeof setPrintedRenewOwnerDCSchema>;
