/**
 * Types communs partagés entre tous les modules
 */

export { UserPermission as Permission } from '@protosen/shared';

export enum StrictStatusEnum {
	ACTIVE = 'active',
	DISABLED = 'disabled',
}

export enum StatusEnum {
	ACTIVE = 'active',
	DISABLED = 'disabled',
	ALL = '',
}

// Permission enum is now re-exported from @protosen/shared as UserPermission (aliased to Permission for backward compatibility)
// See re-export at the top of this file

export interface IQueryOptions {
	status?: StatusEnum;
	search?: string;
	limit?: string;
	page?: string;
	sort?: string;
	organismId?: string;
	ownerCardId?: string;
	creatorId?: string;
	id?: string;
	expired?: string;
}

export interface IResults<T> {
	count: number;
	rows: T[];
}

export interface Itoken {
	accessToken: string;
	refreshToken: string;
}

export interface CustomFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer; // This is the content of the file
	size: number;
}

export enum EMatrimosnialStatus {
	MARIE = 'marié(e)',
	DIVORCE = 'divorcé(e)',
	CELIBATAIRE = 'celibataire',
}

export enum EGenderEnum {
	M = 'Masculin',
	F = 'Féminin',
}
