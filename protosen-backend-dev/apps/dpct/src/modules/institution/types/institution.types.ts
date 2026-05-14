import { IQueryOptions } from '@shared/types';

/**
 * Types spécifiques au module Institution
 */

export interface IInstitutionQueryOptions extends IQueryOptions {
	code?: string;
	institutionType?: string;
}

export interface IInstitution {
	id: string;
	institutionType: string;
	code: string;
	libelle: string;
	service: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}
