import type { z } from "zod";

export type User = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
};

interface OwnerDiplomaticCardFiles {
	id: string;
	passportKey: string;
	lcKey: string;
	photoKey: string;
	othersKey: string[];
	ownerDiplomaticCardId: string;
	createdAt: string;
	updatedAt: string;
}

interface Organism {
	id: string;
	institutionType: string;
	code: string;
	libelle: string;
	service: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export type IHolder = {
	id: string;
	title: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	matrimonialStatus: string;
	gender: string;
	dateOfBirth: string;
	placeOfBirth: string;
	citizenship: string;
	countryOfBirth: string;
	grade: string;
	personReplaced: string;
	cardNumber: string;
	jobFunction: string;
	travellingNumber: string;
	deliverAt: string;
	deliverBy: string;
	deliverThe: string;
	travellingTitleType: string;
	dateTakingOffice: string;
	dateArrivalSenegal: string;
	travellingTitleValidUntil: string;
	dateEndOfMission: string;
	lastCityAbroad: string;
	lastCountryAbroad: string;
	latestOfWorkCountry: string;
	latestWorkStructure: string;
	lastestWorkDate: string;
	lastStreetAbroad: string;
	rejectReason: string | null;
	status: string;
	documentStage: string;
	demandType: string;
	creatorId: string;
	organismId: string;
	createdAt: string;
	updatedAt: string;
	ownerDiplomaticCardFiles: OwnerDiplomaticCardFiles;
	organism: Organism;
	passportLink: string;
	lcLink: string;
	photoLink: string;
	presignUrlOthersLink: string[];
};

export interface IFormMeta {
	[key: string]: any;
	validation?: z.ZodType;
}

export type IFormSections = {
	title: string;
	data: any[];
	supportingText?: string;
};

export type IPersonCardInfos = {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	jobFunction: string;
	cardNumber: string;
	deliverThe: string;
	travellingTitleValidUntil: string;
	issueDate: string;
	validUntil: string;
	citizenship: string;
	organism: Organism;
	photoLink: string;
	plaque: string | null;
	documentStage: string;
	ownerDiplomaticCardId: string;
	color: string | null;
	observation: string | null;
	type_card: string | null;
	description: string | null;
	ownerDiplomaticCardFiles: unknown;
	expired: boolean;
};

export type IPersonCardInfosRenew = {
	id: string;
	cardNumber: string;
	deliverThe: string;
	newDateEndOfMission: string;
	issueDate: string;
	validUntil: string;
	plaque: string | null;
	documentStage: string;
	previousCardId: string;
	color: string | null;
	observation: string | null;
	type_card: string | null;
	description: string | null;
	expired: boolean;
	previousCard: IPersonCardInfos;
	createdAt: string;
	updatedAt: string;
};

export type IPerson = {
	id: string;
	firstName: string;
	lastName: string;
	documentStage: string;
	ownerDiplomaticCardFiles: null | any;
	photoLink: string;
	[key: string]: any;
};

export type ISubmitAction = (formData: FormData) => Promise<
	| {
			message: string;
			status: string;
			errors: any;
			data?: undefined;
	  }
	| {
			message: string;
			status: string;
			errors?: undefined;
			data?: undefined;
	  }
	| {
			data: any;
			status: string;
			message: string;
			errors?: undefined;
	  }
>;

export type IFetchAction = () => Promise<
	| {
			message: string;
			status: string;
			errors: any;
			data?: undefined;
	  }
	| {
			message: string;
			status: string;
			errors?: undefined;
			data?: undefined;
	  }
	| {
			data: any;
			status: string;
			message: string;
			errors?: undefined;
	  }
>;
