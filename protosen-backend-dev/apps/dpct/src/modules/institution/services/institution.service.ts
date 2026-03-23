import { Institution } from 'database/models';
import { IInstitutionsRepo, InstitutionsRepo } from '../repositories/insitution.repository';
import { CreateInstitutionInput } from '../dtos/institution.dto';
import { IInstitutionQueryOptions } from '../types';
import { IResults } from '@shared/types';

export class InstitutionsService implements IInstitutionsRepo {
	async save(data: CreateInstitutionInput): Promise<Institution> {
		return await new InstitutionsRepo().save(data);
	}
	async update(id: string, data: Partial<Institution>): Promise<Institution | null> {
		return await new InstitutionsRepo().update(id, data);
	}

	async delete(id: string) {
		return await new InstitutionsRepo().delete(id);
	}

	async getById(id: string): Promise<Institution | null> {
		return await new InstitutionsRepo().getById(id);
	}

	async getByIds(ids: string[]): Promise<Institution[]> {
		return await new InstitutionsRepo().getByIds(ids);
	}

	async getAll(queryOptions: IInstitutionQueryOptions): Promise<IResults<Institution>> {
		return await new InstitutionsRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<Institution | null> {
		return await new InstitutionsRepo().getOne(field);
	}
}
