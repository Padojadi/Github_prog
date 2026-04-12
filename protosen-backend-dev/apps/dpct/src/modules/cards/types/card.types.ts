import { IQueryOptions } from '@shared/types';

/**
 * Types spécifiques au module Cards (cartes diplomatiques)
 */

// ========== Enums ==========

export enum EDocumentState {
	PENDING = 'pending',
	ONHOLD = 'onhold',
	APPROVED = 'accepted',
	REJECTED = 'rejected',
	CONFIRMED = 'confirmed',
	PRINTED = 'printed',
	RETURNED = 'RETURNED',
	ALL = '',
}

export enum EAdminDocumentState {
	APPROVED = EDocumentState.APPROVED,
	REJECTED = EDocumentState.REJECTED,
}

export enum ESuperAdminDocumentState {
	CONFIRMED = EDocumentState.CONFIRMED,
	REJECTED = EDocumentState.REJECTED,
}

export enum EDemandType {
	NEW = 'nouvelle',
	ALL = '',
	RENOUVELLEMENT = 'renouvellement',
	DUPLICATA = 'duplicata',
}

// ========== Base Interfaces ==========

interface IBaseSpouseDC {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	cardNumber?: string;
	gender: string;
	dateOfBirth: Date | string;
	placeOfBirth: string;
	citizenship: string;
	countryOfBirth: string;
	travellingNumber: string;
	deliverAt: string;
	deliverBy: string;
	deliverThe: string;
	issueDate?: string;
	travellingTitleType: string;
	travellingTitleValidUntil: string;
	demandType: EDemandType;
	ownerDiplomaticCardId: string;
	creatorId: string;
	expired?: boolean;
	validUntil?: Date | string | null;
}

interface IBaseOwnerDC {
	title: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	matrimonialStatus: string;
	gender: string;
	dateOfBirth: Date | string;
	placeOfBirth: string;
	citizenship: string;
	countryOfBirth: string;
	grade: string;
	personReplaced?: string;
	cardNumber?: string;
	jobFunction: string;
	travellingNumber: string;
	deliverAt: string;
	deliverBy: string;
	deliverThe: Date | string;
	issueDate?: Date | string;
	travellingTitleType: string;
	dateTakingOffice: Date | string;
	dateArrivalSenegal: Date | string;
	travellingTitleValidUntil: Date | string;
	dateEndOfMission?: Date | string | null;
	lastCityAbroad: string;
	lastCountryAbroad: string;
	latestOfWorkCountry: string;
	latestWorkStructure: string;
	lastestWorkDate: Date | string;
	lastStreetAbroad: string;
	creatorId: string;
	organismId: string;
	expired?: boolean;
	plaque: string | null;
	documentStage?: EDocumentState | EAdminDocumentState | ESuperAdminDocumentState;
}

// ========== Spouse Card Types ==========

export interface ICreateSpouseDC extends IBaseSpouseDC {
	organismId: string;
}

export interface IUpdateSpouseDC extends Partial<IBaseSpouseDC> {
	documentStage?: EDocumentState | EAdminDocumentState | ESuperAdminDocumentState;
	rejectReason?: string;
}

export interface ICreateRenewSpouseDC {
	previousCardId: string;
	cardNumber: string;
	creatorId?: string;
	organismId?: string;
}

export interface IUpdateRenewSpouseDC extends Partial<IBaseSpouseDC> {
	documentStage?: EDocumentState | EAdminDocumentState | ESuperAdminDocumentState;
	rejectReason?: string;
	issueDate?: string;
	validUntil?: string;
	type_card?: string;
	color?: string;
	plaque?: string;
	observation?: string | null;
}

// ========== Owner Card Types ==========

export interface ICreateOwnerDC extends IBaseOwnerDC {}

export interface IUpdateOwnerDC extends Partial<ICreateOwnerDC> {}

export interface ICreateRenewOwnerDC {
	previousCardId: string;
	cardNumber: string;
	creatorId?: string;
	organismId?: string;
}

export interface IUpdateRenewOwnerDC extends Partial<IBaseOwnerDC> {}

// ========== Duplicata ==========

export interface ICreateDuplicataDC {
	previousCardId?: string;
	renewCardId?: string;
	creatorId?: string;
	organismId?: string;
}

// ========== Validation Types ==========

export type IValidateDCByAdmin = {
	documentStage: EAdminDocumentState;
	rejectReason?: string;
};

export type IValidateDCBySuperAdmin = {
	documentStage: ESuperAdminDocumentState;
	rejectReason?: string;
};

// ========== File Upload Types ==========

interface IBaseAddFile {
	passportKey: string;
	lcKey: string;
	photoKey?: string;
	othersKey?: string[];
}

export interface IOwnerAddFile extends IBaseAddFile {
	ownerDiplomaticCardId: string;
}

export interface IRenewOwnerAddFile extends IBaseAddFile {
	renewOwnerDCId: string;
}

export interface ISpouseAddFile {
	passportKey: string;
	amKey: string;
	photoKey?: string;
	othersKey?: string[];
	spouseDCId: string;
}

export interface IChildAddFile {
	passportKey: string;
	anKey: string;
	photoKey?: string;
	othersKey?: string[];
	childDCId: string;
}

export interface IOtherDependnatAddFile {
	passportKey: string;
	adKey: string;
	photoKey?: string;
	othersKey?: string[];
	otherDependantDCId: string;
}

export interface IDomesticAndRelativeAddFile {
	passportKey: string;
	adKey: string;
	photoKey?: string;
	othersKey?: string[];
	domesticAndRelativeDCId: string;
}

export interface IOtherStaffAddFile {
	passportKey: string;
	adKey: string;
	photoKey?: string;
	othersKey?: string[];
	otherStaffDCId: string;
}

// ========== Query Options ==========

export interface IQueryOptionsDC extends IQueryOptions {
	demandType?: EDemandType;
	documentStage?: EDocumentState[];
	previousCardId?: string;
}
