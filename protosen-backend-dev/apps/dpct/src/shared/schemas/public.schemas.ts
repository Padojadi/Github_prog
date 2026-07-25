import { TypeOf, array, object, string, z } from 'zod';
import {
	EAdminDocumentState,
	EDocumentState,
	ESuperAdminDocumentState,
} from '../../modules/cards/types/card.types';
import { StatusEnum } from '../types/common.types';

const AdminDocumentState = z.nativeEnum(EAdminDocumentState);
const SuperAdminDocumentState = z.nativeEnum(ESuperAdminDocumentState);
const StatusType = z.nativeEnum(StatusEnum);
const DocumentState = z.nativeEnum(EDocumentState);

export const getByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const adminValidateDocSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object({
		documentStage: AdminDocumentState,
		rejectReason: string().optional(),
	}),
});

export const superAdminValidateDocSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object({
		documentStage: SuperAdminDocumentState,
		rejectReason: string().optional(),
	}),
});

export const getAllSchema = object({
	status: StatusType.optional(),
	search: string().optional(),
	limit: string().optional(),
	page: string().optional(),
	sort: string().optional(),
	documentStage: array(DocumentState).optional(),
	ownerCardId: string().optional(),
	organismId: string().optional(),
	creatorId: string().optional(),
	id: string().optional(),
	expired: string().optional(),
});

export const getByCardNumberSchema = object({
	params: object({
		cardNumber: string().regex(/\d{4}$/),
	}).strict(),
});

export const requestDCDuplicataSchema = object({
	body: object({
		previousDCId: string().uuid(),
	}).strict(),
});

export type AdminValidateDocumentInput = TypeOf<typeof adminValidateDocSchema>;
export type SuperAdminValidateDocumentInput = TypeOf<typeof superAdminValidateDocSchema>;
export type GetByIdInput = TypeOf<typeof getByIdSchema>['params'];
export type GetByCardNumberInput = TypeOf<typeof getByCardNumberSchema>['params'];
export type RequestDCDuplicataInput = TypeOf<typeof requestDCDuplicataSchema>['body'];
